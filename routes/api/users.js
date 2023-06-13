const express = require('express');
const users = require('../../models/users');

const router = express.Router();

router.get('/:email', (req, res) => {
  const { email } = req.params;

  const user = users.findUserByEmail(email);
  const userData = { ...user, password: '****************' };

  if (user) {
    res.send(userData);
  } else {
    res.status(404).send('User not found');
  }
});

router.get('/:email/:list', (req, res) => {
  const { email, list } = req.params;

  const user = users.findUserList(email, list);

  if (user) {
    res.send(user);
  } else {
    res.status(404).send('User not found');
  }
});

router.patch('/:email', (req, res) => {
  const { email } = req.params;

  users.updateSubscribeList(email, req.body);

  res.send(users);
});

router.patch('/:email/:list', (req, res) => {
  const { email, list } = req.params;

  users.addContent(email, list, req.body);

  res.send(users);
});

router.patch('/:email/:list/:id', (req, res) => {
  const { email, list, id } = req.params;

  users.updateContent(email, list, id, req.body);

  res.send(users);
});

router.delete('/:email/:list/:id', (req, res) => {
  const { email, list, id } = req.params;

  users.deleteContent(email, list, id);

  res.send(users);
});

module.exports = router;
