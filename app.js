const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;

require('./database');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/routes', require('./routes'));

app.listen(PORT, () => console.log(`The Server is running on port: ${PORT}`));
