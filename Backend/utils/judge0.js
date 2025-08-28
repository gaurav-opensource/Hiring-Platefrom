const axios = require("axios");

const JUDGE0_HOST = process.env.JUDGE0_HOST; // e.g., judge0-ce.p.rapidapi.com
const JUDGE0_KEY = process.env.JUDGE0_KEY;

async function runSingleTest(sourceCode, languageId, stdin) {
  const url = `https://${JUDGE0_HOST}/submissions?base64_encoded=false&wait=true`;
  const payload = {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdin
  };

  const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Host": JUDGE0_HOST,
    "X-RapidAPI-Key": JUDGE0_KEY
  };

  const res = await axios.post(url, payload, { headers, timeout: 120000 });
  return res.data; // contains stdout, stderr, status
}

module.exports = { runSingleTest };
