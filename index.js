const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const jwtMiddleware = require('./lib/authChecker');

const app = express();
const { PORT } = process.env;

const auth = require('./routes/api/auth');
const users = require('./routes/api/users');

const corsOptions = {
  origin: process.env.CORS_CLIENT_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(jwtMiddleware);

app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(PORT);
