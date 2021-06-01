const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { createAccessToken, createRefreshToken } = require('../middleware/auth');
const { query } = require('../database');

router.post('/', async (req, res) => {
	try {
		const { email, password } = req.body;


		if (!email) {
			return res.json({ status: false, message: 'You must submit your email' });
		}
		if (!password) {
			return res.json({ status: false, message: 'You must submit the password' });
		}


		const result = await query(`SELECT * FROM user WHERE email='${email}'`);
		if (result.length == 0) {
			return res.json({ status: false, message: 'This email address is not registered' });
		}

		let userSearch = result[0];

		if (!(await bcrypt.compare(password, result[0].password))) {
			return res.json({ status: false, message: 'The password is incorrect' });
		}

		const accessToken = await createAccessToken({ id: userSearch.id }, { expiresIn: '5m' });
		const refreshToken = await createRefreshToken({ id: userSearch.id }, { expiresIn: '5m' });

		res.cookie('access_token', accessToken, { maxAge: 5 * 60 * 1000 });
		res.cookie('refresh_token', accessToken, { maxAge: 86400 * 1000 * 30 });

		return res.json({
			status: true,
			message: 'You are now logged in successfully',
			accessToken,
			refreshToken,
		});

	} catch (e) {
		console.log(`Error in /routes/login, error: ${e.message}`, e);
		if (!res.headersSent)
			res.json({
				status: false,
				error: e.message,
			});
	}
});

module.exports = router;
