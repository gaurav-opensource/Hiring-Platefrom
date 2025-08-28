// const uuid = require('uuid').v4;
// const Question = require('../model/question.model.js');
// const TestSession = require('../models/TestSession');
// const Submission = require('../models/Submission');
// const { runSubmission } = require('../services/judge.service.js.js');
// const { codeHash, jaccardSimilarity } = require('../utils/cheatDetection');

// const MAX_TAB_SWITCHES = parseInt(process.env.MAX_TAB_SWITCHES || 5);
// const TEST_DURATION_MINUTES = parseInt(process.env.TEST_DURATION_MINUTES || 60);

// // Start Test
// exports.startTest = async (req, res) => {
//   try {
//     const existing = await TestSession.findOne({ userId: req.user._id, active: true, status: 'inprogress' });
//     if (existing) return res.status(400).json({ error: 'Another session is in progress' });

//     const allQs = await Question.find({});
//     if (!allQs || allQs.length === 0) return res.status(400).json({ error: 'No questions available' });

//     const shuffled = allQs.sort(() => 0.5 - Math.random()).slice(0, 5);
//     const now = new Date();
//     const expiresAt = new Date(now.getTime() + TEST_DURATION_MINUTES * 60 * 1000);

//     const session = await TestSession.create({
//       userId: req.user._id,
//       questions: shuffled.map(q => ({ questionId: q._id, type: q.type, weight: q.weight || 1 })),
//       startedAt: now,
//       expiresAt,
//       ip: req.ip,
//       userAgent: req.headers['user-agent'],
//       token: uuid(),
//       active: true
//     });

//     const payload = shuffled.map(q => ({
//       _id: q._id,
//       title: q.title,
//       text: q.text,
//       type: q.type,
//       options: q.options,
//       template: q.template,
//       language: q.language,
//       visibleSample: q.visibleSample,
//       weight: q.weight
//     }));

//     res.json({ sessionId: session._id, token: session.token, expiresAt, questions: payload });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Log anti-cheat events
// exports.logEvent = async (req, res) => {
//   try {
//     const { sessionId, eventType, payload } = req.body;
//     const session = await TestSession.findById(sessionId);
//     if (!session) return res.status(400).json({ error: 'Invalid session' });
//     if (String(session.userId) !== String(req.user._id)) return res.status(403).json({ error: 'Not your session' });

//     session.events.push({
//       eventType,
//       payload,
//       ip: req.ip,
//       ua: req.headers['user-agent']
//     });

//     const hiddenCount = session.events.filter(e => e.eventType === 'visibilityHidden').length;
//     if (hiddenCount >= MAX_TAB_SWITCHES) {
//       session.status = 'flagged';
//       session.active = false;
//     }

//     await session.save();
//     res.json({ ok: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Submit Test
// exports.submitTest = async (req, res) => {
//   try {
//     const { sessionId, answers } = req.body;
//     const session = await TestSession.findById(sessionId);
//     if (!session) return res.status(400).json({ error: 'Invalid session' });
//     if (String(session.userId) !== String(req.user._id)) return res.status(403).json({ error: 'Not your session' });
//     if (session.status !== 'inprogress') return res.status(400).json({ error: 'Session not in progress' });

//     if (new Date() > session.expiresAt) {
//       session.status = 'expired';
//       session.active = false;
//       await session.save();
//       return res.status(400).json({ error: 'Session expired' });
//     }

//     const alreadySubmitted = await Submission.findOne({ sessionId: session._id });
//     if (alreadySubmitted) return res.status(400).json({ error: 'Already submitted' });

//     const questions = await Question.find({ _id: { $in: answers.map(a => a.questionId) } });
//     const qmap = {};
//     questions.forEach(q => qmap[q._id] = q);

//     let totalWeight = 0;
//     let obtainedScore = 0;
//     const subAnswers = [];
//     const codeHashes = [];

//     for (const a of answers) {
//       const q = qmap[a.questionId];
//       if (!q) continue;
//       totalWeight += (q.weight || 1);

//       const ansObj = {
//         questionId: a.questionId,
//         type: a.type,
//         answerText: a.answerText || null,
//         code: a.code || null,
//         language: a.language || q.language || null,
//         codeHash: null,
//         judged: false,
//         passed: 0,
//         totalTestCases: 0,
//         score: 0
//       };

//       if (q.type === 'mcq') {
//         if (String(a.answerText) === String(q.correctOption)) {
//           obtainedScore += (q.weight || 1);
//           ansObj.score = q.weight || 1;
//         }
//       } else if (q.type === 'short') {
//         const keywords = q.keywords || [];
//         let matches = 0;
//         const userText = (a.answerText || '').toLowerCase();
//         for (const kw of keywords) if (userText.includes(String(kw).toLowerCase())) matches++;
//         const frac = keywords.length ? (matches / keywords.length) : 0;
//         const sc = frac * (q.weight || 1);
//         obtainedScore += sc;
//         ansObj.score = sc;
//       } else if (q.type === 'coding') {
//         const testCases = q.testCases || [];
//         ansObj.totalTestCases = testCases.length;
//         const ch = codeHash(a.code || '');
//         ansObj.codeHash = ch;
//         codeHashes.push({ hash: ch, code: a.code || '', questionId: q._id });

//         let passed = 0;
//         for (const tc of testCases) {
//           try {
//             const res = await runSubmission(a.code || '', ansObj.language || '50', tc.input || '');
//             const stdout = String(res.stdout || '').trim();
//             const expected = String(tc.output || '').trim();
//             if (stdout === expected) passed++;
//           } catch {
//             // Fail silently
//           }
//         }
//         ansObj.judged = true;
//         ansObj.passed = passed;
//         const sc = (passed / Math.max(1, testCases.length)) * (q.weight || 1);
//         ansObj.score = sc;
//         obtainedScore += sc;
//       }

//       subAnswers.push(ansObj);
//     }

//     const submission = await Submission.create({
//       userId: req.user._id,
//       sessionId: session._id,
//       answers: subAnswers,
//       totalScore: (obtainedScore / Math.max(1, totalWeight)) * 100
//     });

//     let flagged = false;
//     const hiddenEvents = session.events.filter(e => e.eventType === 'visibilityHidden').length;
//     if (hiddenEvents >= MAX_TAB_SWITCHES) flagged = true;

//     const allHashes = subAnswers.filter(s => s.codeHash).map(s => s.codeHash);
//     if (allHashes.length) {
//       const duplicates = await Submission.find({ 'answers.codeHash': { $in: allHashes }, userId: { $ne: req.user._id } }).limit(5);
//       if (duplicates && duplicates.length) flagged = true;
//     }

//     for (let i = 0; i < subAnswers.length; i++) {
//       for (let j = i + 1; j < subAnswers.length; j++) {
//         if (subAnswers[i].code && subAnswers[j].code) {
//           const sim = jaccardSimilarity(subAnswers[i].code, subAnswers[j].code);
//           if (sim > 0.9) flagged = true;
//         }
//       }
//     }

//     submission.flagged = flagged;
//     await submission.save();

//     session.status = flagged ? 'flagged' : 'submitted';
//     session.active = false;
//     await session.save();

//     res.json({ ok: true, score: submission.totalScore, flagged });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Run Code
// exports.runCode = async (req, res) => {
//   const { code, language } = req.body;
//   try {
//     const result = await runSubmission(code, language || '50', '');
//     res.json({ output: result.stdout || result.stderr || 'No output' });
//   } catch (err) {
//     res.status(500).json({ error: 'Error running code' });
//   }
// };
