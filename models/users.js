const jwt = require('jsonwebtoken');

let users = [
  {
    email: 'snowlover@gmail.com',
    password: 'snow123',
    name: 'snowlover',
    subscribe_list: [{ id: 8, price: 7900 }],
    like_list: [
      { id: 849869, type: 'movie', modified_at: '2021-12-25T12:59:32.746Z' },
      { id: 505642, type: 'movie', modified_at: '2020-12-31T12:59:32.746Z' },
    ],
    watch_list: [{ id: 776835, type: 'movie', modified_at: '2021-05-18T12:59:32.746Z' }],
    history_list: [
      { id: 668482, type: 'movie', modified_at: '2023-04-15T12:59:32.746Z' },
      { id: 61889, type: 'tv', modified_at: '2022-01-01T12:59:32.746Z' },
    ],
  },
  {
    email: 'squid@gmail.com',
    password: 'squid456',
    name: 'squid',
    subscribe_list: [{ id: 8, price: 7900 }],
    like_list: [
      { id: 843794, type: 'movie', modified_at: '2021-12-25T12:59:32.746Z' },
      { id: 616037, type: 'movie', modified_at: '2020-12-31T12:59:32.746Z' },
    ],
    watch_list: [{ id: 736526, type: 'movie', modified_at: '2021-05-18T12:59:32.746Z' }],
    history_list: [
      { id: 507086, type: 'movie', modified_at: '2023-04-15T12:59:32.746Z' },
      { id: 555604, type: 'movie', modified_at: '2022-01-01T12:59:32.746Z' },
    ],
  },
  {
    email: 'noname@gmail.com',
    password: 'noname123',
    name: 'noname',
    subscribe_list: [{ id: 8, price: 7900 }],
    like_list: [
      { id: 585511, type: 'movie', modified_at: '2021-12-25T12:59:32.746Z' },
      { id: 635302, type: 'movie', modified_at: '2020-12-31T12:59:32.746Z' },
    ],
    watch_list: [{ id: 766507, type: 'movie', modified_at: '2021-05-18T12:59:32.746Z' }],
    history_list: [
      { id: 438148, type: 'movie', modified_at: '2023-04-15T12:59:32.746Z' },
      { id: 411, type: 'movie', modified_at: '2022-01-01T12:59:32.746Z' },
    ],
  },
];

const generateToken = newEmail =>
  jwt.sign(newEmail, process.env.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });

const createName = email => email.match(/^([a-zA-Z0-9_.+-]+)@/)[1];

const createUser = (email, password) => {
  // users = [...users, { userid, password: bcrypt.hashSync(password, 10) }];
  users = [
    ...users,
    { email, password, name: createName(email), subscribe_list: [], like_list: [], watch_list: [], history_list: [] },
  ];
};

const findUserByEmail = email => users.find(user => user.email === email);

const findUser = (email, password) =>
  // users.find(user => user.userid === userid && bcrypt.compareSync(password, user.password));
  users.find(user => user.email === email && user.password === password);

const getUsers = () => users;

const updateSubscribeList = (email, object) =>
  (users = users.map(user => (user.email === email ? { ...user, ...object } : user)));

const addList = (email, list, value) => {
  const newList = [...users.filter(user => user.email === email)[0][list], value];

  users = users.map(user => (user.email === email ? { ...user, [list]: newList } : user));
};

const findUserList = (email, list) => users.filter(user => user.email === email)[0][list];

module.exports = {
  createUser,
  findUserByEmail,
  findUser,
  getUsers,
  generateToken,
  updateSubscribeList,
  addList,
  findUserList,
  deleteList,
};
