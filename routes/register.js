const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');
const { query } = require('../database');
const { createAccessToken } = require('../middleware/auth');

router.post('/', async (req, res) => {
	try {
		const { email, password, passwordConfirm } = req.body;

		if (!email) return res.json({ status: false, message: 'You must submit your email' });

		if (!password) return res.json({ status: false, message: 'You must submit the password' });

		if (!passwordConfirm) return res.json({ status: false, message: 'You must submit the password confirmation' });

		if (password != passwordConfirm)
			return res.json({ status: false, message: 'Password & password confirmation must be the same' });

		if (!emailValidator.validate(email)) return res.json({ status: false, message: 'This email is not valid' });

		if ((await query(`SELECT * FROM user WHERE email='${email}'`)).length != 0)
			return res.json({ status: false, message: 'This email is registered before, please use another one' });

		const hashedPassword = await bcrypt.hash(password, 10);

		let result = await query(`INSERT INTO user (email, password) VALUES ('${email}','${hashedPassword}')`);

		if (result.affectedRows == 0) return res.json({ status: false, message: 'Something wrong has happened' });

		const accessToken = await createAccessToken({ id: result.id }, { expiresIn: '5m' });

		res.cookie('access_token', accessToken, { maxAge: 5 * 60 * 1000 });

		return res.json({ status: true, message: 'You have been registered successfully', accessToken });

	} catch (e) {
		console.log(`Error in /users/register, error: ${e.message}`, e);
		res.json({
			status: false,
			errors: [e.message],
		});
	}
});

module.exports = router;
