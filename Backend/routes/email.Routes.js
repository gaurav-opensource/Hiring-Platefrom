const express = require("express");
const { sendSelectionEmail } = require("../controllers/emailController");
const router = express.Router();

router.post("/send-email", sendSelectionEmail);

module.exports = router;
