const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 9990;

const auth = require('./routes/auth');
const jwtMiddleware = require('./lib/authChecker');

const users = require('./models/users');

app.use(express.json());
app.use(cookieParser());
app.use(jwtMiddleware);

app.use('/', auth);

/**
 * GET /api/users
 */
app.get('/users', (req, res) => {
  // check!
  const user = users.getUsers();
  res.send(user);
});

/**
 * POST /api/users
 * {id, content, completed}
 */
app.post('/users', (req, res) => {
  users = [req.body, ...users];
  res.send(users);
});

/**
 * PATCH /api/users/:id
 * {completed}
 */
app.patch('/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.map(user => (user.id === +id ? { ...user, ...req.body } : user));
  res.send(users);
});

/**
 * PATCH /api/users
 * {completed}
 */
app.patch('/users', (req, res) => {
  users = users.map(user => ({ ...user, ...req.body }));
  res.send(users);
});

/**
 * DELETE /api/users/:id
 */
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  users = users.filter(user => user.id !== +id);
  res.send(users);
});

/**
 * DELETE /api/users?completed=false
 */
app.delete('/users', (req, res) => {
  const completed = JSON.parse(req.query.completed);
  users = users.filter(user => user.completed !== completed);
  res.send(users);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
