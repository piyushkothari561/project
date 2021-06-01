const express = require('express');
const router = express.Router();

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/getAllCountryDetail', require('./getAllCountryDetail'));
router.use('/getCountry', require('./getCountry'));
router.use('/refreshToken', require('./refreshToken'));

module.exports = router;
