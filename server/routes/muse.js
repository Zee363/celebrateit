const express = require('express');
const router = express.Router();
const museController = require('../controllers/museController');

// POST /api/muse-reply
router.post('/muse-reply', museController.generateReply);

module.exports = router;
