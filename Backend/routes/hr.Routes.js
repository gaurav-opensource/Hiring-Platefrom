const express = require('express');
const router = express.Router();

const hrController = require('../controller/hrController');
const authenticate = require('../middleware/authMiddleware');


router.post('/register', hrController.registerHR);
router.get('/getProfile',authenticate, hrController.getHRProfile);
router.post('/create',authenticate, hrController.createJob)
router.post('/getjob',  hrController.getJobsByHR)




module.exports = router;