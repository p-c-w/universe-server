const express = require('express');
const users = require('../models/users');

const jwt = require('jsonwebtoken');

const router = express.Router();

// auth 요청
router.get('/auth', (req, res) => {
  const { accessToken } = req.cookies;

  try {
    const { email } = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    res.send({ isLogin: true, email });
  } catch (error) {
    res.send({ isLogin: false });
  }
});

// 로그인
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // console.log(email, password);
  const user = users.findUser(email, password);
  // console.log('사용자 정보:', user);

  if (!user) return res.status(401).send({ error: '등록되지 않은 사용자입니다.' });

  const { accessToken } = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
    httpOnly: true,
  });

  res.send({
    email,
    name: user.name,
    subscribe_list: user.subscribe_list,
    like_list: user.like_list,
    watch_list: user.watch_list,
    history_list: user.history_list,
  });
});

// 회원가입
router.post('/signup', (req, res) => {
  const { email, password } = req.body;

  const user = users.findUserByEmail(email);

  console.log('중복된 계정:', user);

  if (user) return res.status(409).send({ error: '중복된 이메일이 존재합니다. ' });

  const newUser = users.createUser({ email, password });

  const accessToken = users.generateToken(newUser.email);

  res.cookie('accessToken', accessToken, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  res.send({ email, nickname });
});

// 로그아웃
router.get('/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.status(204).send({ message: '로그아웃 되었습니다.' });
});

module.exports = router;
