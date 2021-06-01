const express = require('express');
const router = express.Router();
const { checkRefreshToken, createAccessToken } = require('../middleware/auth');
const { query } = require('../database');

router.post('/', async (req, res) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) return res.json({ status: false, message: 'You must submit the refresh token' });

		const createResult = await checkRefreshToken(refreshToken);
		if (!createResult.status) return res.status(401).json({ status: false, message: 'You are not authorized' });

		const accessToken = await createAccessToken({ id: createResult.user.id }, { expiresIn: '5m' });

		res.cookie('access_token', accessToken, { maxAge: 5 * 60 * 1000 });
		return res.json({ status: true, message: 'Access token refreshed successfully', accessToken });
	} catch (e) {
		console.log(`Error in /routes/getAllCountryDetail, error: ${e.message}`, e);
		if (!res.headersSent)
			return res.json({
				status: false,
				error: e.message,
			});
	}
});

module.exports = router;
