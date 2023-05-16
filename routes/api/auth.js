const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../../models/users');

router.get('/verify', (req, res) => {
  const accessToken = req.cookies.accessToken;

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    console.log('😀 사용자 인증 성공!', decoded);

    const user = users.findUserByEmail(decoded.email);
    res.send({ isLogin: true, email: user.email });
  } catch (e) {
    console.log('😱 사용자 인증 실패..', e);

    res.send({ isLogin: false });
  }
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(401).send({ error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.' });

  const user = users.findUser(email, password);
  console.log('[USER]', user);

  if (!user) return res.status(401).send({ error: '등록되지 않은 사용자입니다.' });

  const accessToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  // 로그인 성공
  res.send(email);
});

router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const user = users.findUserByEmail(email);
  if (user) return res.status(409).send({ error: '중복된 이메일이 존재합니다. ' });

  users.createUser(email, password);
  res.send(email);
});

router.get('/signout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(204).send({ message: '로그아웃 되었습니다.' });
  res.end();
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
  return res.send('회원 탈퇴가 완료됐습니다. 유니버스를 이용해주셔서 감사합니다.');
});

module.exports = router;
