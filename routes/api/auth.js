const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../../models/users');
const { verifyPassword } = require('../../lib/encryption');

router.get('/verify', (req, res) => {
  const accessToken = req.cookies.accessToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    const user = users.findUserByEmail(decoded.email);
    res.send({ isLogin: true, email: user.email });
  } catch (e) {
    res.send({ isLogin: false });
  }
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const user = users.findUserByEmail(email);

  try {
    const verify = async user => {
      return await verifyPassword(password, user.password.salt, user.password.hashedPassword);
    };

    if (!user || !verify(user)) return res.status(401).send('잘못된 이메일이나 비밀번호가 입력됐습니다.');
  } catch (error) {
    return res.status(400).send('로그인 오류');
  }

  const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.send(email);
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  const user = users.findUserByEmail(email);
  if (user) return res.status(409).send('중복된 이메일이 존재합니다.');

  await users.createUser(email, password);
  const newuser = users.findUserByEmail(email);

  res.send({ email, name: newuser.name });
});

router.get('/signout', (req, res) => {
  res.clearCookie('accessToken');

  res.send({ isLogin: false });
});

router.patch('/changepw', (req, res) => {
  const { email, nowPassword, newPassword, confirmPassword } = req.body;

  const user = users.findUser(email, nowPassword);

  if (!user) return res.status(401).send('비밀번호를 정확하게 입력해 주세요.');

  if (newPassword !== confirmPassword) return res.status(401).send('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');

  res.clearCookie('accessToken');
  users.changePassword(email, newPassword);

  return res.send('비밀번호 변경에 성공하셨습니다.');
});

router.delete('/withdrawal/:email', (req, res) => {
  const { email } = req.params;

  users.withdrawalUser(email);
  res.clearCookie('accessToken');
  return res.send({ isLogin: false, message: '회원 탈퇴가 완료됐습니다. 유니버스를 이용해주셔서 감사합니다.' });
});

module.exports = router;
