const express = require('express');
const users = require('../../models/users');

const router = express.Router();

/**
 * GET /api/users
 */
router.get('/', (req, res) => {
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
 * GET /api/users/:email/:list
 */
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
 * PATCH /users/:email
 * update Subscribe_list
 */
router.patch('/:email', (req, res) => {
  const { email } = req.params;

  users.updateSubscribeList(email, req.body);

  res.send(users);
});

/**
 * PATCH /users/:email/:list
 * Add to List(history, like, ..)
 */
router.patch('/:email/:list', (req, res) => {
  const { email, list } = req.params;

  users.addContent(email, list, req.body);

  res.send(users);
});

/**
 * DELETE /api/users/:email
 * Delete to List
 */

router.delete('/:email/:list/:id', (req, res) => {
  const { email, list, id } = req.params;

  users.deleteContent(email, list, id);

  res.send(users);
});

module.exports = router;
