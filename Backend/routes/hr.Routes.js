const express = require('express');
const router = express.Router();

const hrController = require('../controller/hrController');
const authenticate = require('../middleware/authMiddleware');


router.post('/register', hrController.registerHR);
router.get('/getProfile',authenticate, hrController.getHRProfile);
router.post('/create',authenticate, hrController.createJob)
router.post('/getjob',  hrController.getJobsByHR)

// router.post("/job/:jobId/resumeScreen", resumeScreen);
// router.post("/job/:jobId/sortResume", sortResume);
// router.post("/job/:jobId/selectForTest", selectForTest);
// router.post("/job/:jobId/conductInterview", conductInterview);
// router.post("/job/:jobId/finalSelection", finalSelection);


module.exports = router;