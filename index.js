const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const jwtMiddleware = require('./lib/authChecker');

const app = express();
const PORT = process.env.PORT || 9990;

const auth = require('./routes/api/auth');
const users = require('./routes/api/users');

app.use(express.json());
app.use(cookieParser());
app.use(jwtMiddleware);

app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
