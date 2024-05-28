const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAgencyWithClient, getTopClientDetails } = require('../controllers/agencyController');
const { updateClient } = require('../controllers/clientController');
const { login, register } = require('../controllers/authController');


router.post('/signup', register);
router.post('/login', login);
router.post('/agency-client',auth, createAgencyWithClient);
router.put('/client/:id',auth, updateClient);
router.get('/top-client', auth, getTopClientDetails);

module.exports = router;
