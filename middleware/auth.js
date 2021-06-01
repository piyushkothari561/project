require('dotenv/config');
const auth = require('jsonwebtoken');
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
const { query } = require('../database');

module.exports = {
	createAccessToken: async (payload, options = {}) => {
		try {
			const token = await auth.sign(payload, ACCESS_SECRET_TOKEN, options);
			return token;
		} catch (e) {
			console.log(e);
			return false;
		}
	},

	checkAccessToken: async (req, res, next) => {
		try {
			const token =
				(req.headers['authorization'] && req.headers['authorization'].split(' ')[1]) ||
				(req.cookies['access_token'] && req.cookies['access_token']);

			if (!token) {
				return res.status(401).json({ status: false, message: 'You must login first' });
			}

			const user = await auth.verify(token, ACCESS_SECRET_TOKEN);

			//check DB existence
			const result = await query(`SELECT * FROM user WHERE id='${user.id}'`);
			if (result.length == 0) {
				return res.status(401).json({ status: false, message: 'You must login first' });
			}

			let userSearch = result[0];

			req.user = userSearch;
			return next();
		} catch (e) {
			console.log(e);
			return next();
		}
	},
	createRefreshToken: async (payload, options = {}) => {
		try {
			const token = await auth.sign(payload, REFRESH_SECRET_TOKEN, options);
			return token;
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	checkRefreshToken: async (token) => {
		try {
			if (!token) {
				return { status: false, message: 'You must submit the refresh token' };
			}

			const user = await auth.verify(token, REFRESH_SECRET_TOKEN);

			//check DB existence
			const result = await query(`SELECT * FROM user WHERE id='${user.id}'`);
			if (result.length == 0) {
				return { status: false, message: 'The refresh token is not valid' };
			}

			return { status: true, user: result[0] };
		} catch (e) {
			console.log(e);
			return { status: false, message: e.message };
		}
	},
};
