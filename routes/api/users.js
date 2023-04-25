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

// get user's list

router.get('/:email/:list', (req, res) => {
  const { email, list } = req.params;

  const user = users.findUserList(email, list);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
});

/**
 * PATCH /users
 * update Subscribe_list
 */
router.patch('/:email', (req, res) => {
  const { email } = req.params;

  console.log('email: ', email);

  users.updateSubscribeList(email, req.body);

  res.send(users);
});

/**
 * PATCH /users
 * update List(history, like, ..)
 */
router.patch('/:email/:list', (req, res) => {
  const { email, list } = req.params;

  console.log('email: ', email);
  console.log('list: ', list);
  console.log('req.body: ', req.body);

  users.addList(email, list, req.body);

  console.log('i am');
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

/**
 * DELETE /api/users/:email
 */

module.exports = router;
