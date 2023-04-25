const express = require('express');
const users = require('../../models/users');

const router = express.Router();

// router.post('/users', (req, res) => {
//   const { email, password } = req.body;

//   console.log(req.body);

//   res.send({ email, password });
// });

/**
 * GET /api/users
 */
router.get('/', (req, res) => {
  // check!
  const user = users.getUsers();
  res.send(user);
});

/**
 * GET /api/users/:email
 */
router.get('/:email', (req, res) => {
  const { email } = req.params;

  const user = users.findUserByEmail(email);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
});

/**
 * PATCH /users
 * {}
 */
router.patch('/:email', (req, res) => {
  const { email } = req.params;

  console.log('email: ', email);

  users.changeUsers(email, req.body);

  res.send(users);
});

/**
 * DELETE /api/users/:email
 */
router.delete('/:email', (req, res) => {
  const { email } = req.params;
  const _user = users.getUsers();

  const newUser = _user.filter(user => user.email !== email);
  res.send(newUser);
});

module.exports = router;
