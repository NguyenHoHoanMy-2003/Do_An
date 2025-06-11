const express = require('express');
const router = express.Router();
const userPublicController = require('../controllers/userPublicController');

router.get('/public/:id_user', userPublicController.getUserById);

module.exports = router;
