const jwt = require('jsonwebtoken');

let users = [
  {
    email: 'sebap@gmail.com',
    password: 'sebap123',
    name: 'sebap',
    subscribe_list: [
      { id: 8, price: 'basic' },
      { id: 337, price: 'basic' },
    ],
    like_list: [
      { id: 849869, type: 'movie', modified_at: '2021-12-25T12:59:32.746Z' },
      { id: 505642, type: 'movie', modified_at: '2020-12-31T12:59:32.746Z' },
    ],
    watch_list: [
      { id: 849869, type: 'movie', modified_at: '2021-12-25T12:59:32.746Z' },
      { id: 119769, type: 'tv', modified_at: '2020-12-31T12:59:32.746Z' },
      { id: 668482, type: 'movie', modified_at: '2023-04-15T12:59:32.746Z' },
    ],
    history_list: [
      { id: 61889, type: 'tv', modified_at: '2022-02-01T12:59:32.746Z' },
      { id: 985939, type: 'movie', modified_at: '2022-01-01T12:59:32.746Z' },
      { id: 820232, type: 'movie', modified_at: '2022-01-01T13:59:32.746Z' },
      { id: 653851, type: 'movie', modified_at: '2022-04-01T12:59:32.746Z' },
      { id: 438148, type: 'movie', modified_at: '2023-01-01T12:59:32.746Z' },
      { id: 71712, type: 'tv', modified_at: '2023-02-01T12:59:32.746Z' },
      { id: 60735, type: 'tv', modified_at: '2023-04-01T13:59:32.746Z' },
      { id: 65334, type: 'tv', modified_at: '2022-05-02T12:59:32.746Z' },
      { id: 1433, type: 'tv', modified_at: '2023-03-30T12:59:32.746Z' },
      { id: 18165, type: 'tv', modified_at: '2023-03-31T12:59:32.746Z' },
      { id: 1104040, type: 'movie', modified_at: '2022-04-01T12:59:32.746Z' },
      { id: 493529, type: 'movie', modified_at: '2023-04-11T12:59:32.746Z' },
      { id: 736526, type: 'movie', modified_at: '2022-07-21T12:59:32.746Z' },
      { id: 675353, type: 'movie', modified_at: '2022-04-01T12:59:32.746Z' },
      { id: 82856, type: 'tv', modified_at: '2022-12-04T12:59:32.746Z' },
      { id: 60574, type: 'tv', modified_at: '2022-11-016T12:59:32.746Z' },
    ],
  },
  {
    email: 'squid@gmail.com',
    password: 'squid456',
    name: 'squid',
    subscribe_list: [{ id: 8, price: 'basic' }],
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
    subscribe_list: [{ id: 8, price: 'basic' }],
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

const findUserList = (email, list) => users.filter(user => user.email === email)[0][list];

const addContent = (email, list, value) => {
  const prevList = findUserList(email, list);
  const isDuplicate = prevList.find(({ id }) => id === value.id);

  if (isDuplicate) return;

  users = users.map(user => (user.email === email ? { ...user, [list]: [...prevList, value] } : user));
};

const deleteContent = (email, list, id) => {
  const isDuplicate = findUserList(email, list).find(({ id }) => id !== id);
  if (isDuplicate) return;

  const newList = [...findUserList(email, list).filter(movie => movie.id !== +id)];
  users = users.map(user => (user.email === email ? { ...user, [list]: newList } : user));
};

module.exports = {
  createUser,
  findUserByEmail,
  findUser,
  getUsers,
  generateToken,
  updateSubscribeList,
  addContent,
  deleteContent,
};
