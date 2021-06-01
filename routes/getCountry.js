const express = require('express');
const router = express.Router();
const { checkAccessToken } = require('../middleware/auth');
const { query } = require('../database');

router.post('/', checkAccessToken, async (req, res) => {
	try {
		const { countryName } = req.body;

		if (!countryName) return res.json({ status: false, message: 'You must submit the country name' });

		const result = await query(`SELECT * FROM country_detail WHERE countryName='${countryName}'`);

		if (result.length == 0)
			return res.json({ status: false, message: 'There is no country registered with this name' });

		return res.json({ status: true, message: 'Country data retrieved successfully', data: result[0] });
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
