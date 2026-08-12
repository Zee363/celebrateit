const express = require('express');
const router = express.Router();
const { sendInvitationEmail } = require('../controllers/emailController');

router.post('/send-invitation-email', sendInvitationEmail);

module.exports = router;
