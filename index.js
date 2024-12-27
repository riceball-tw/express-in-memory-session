import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Use body-parser to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

const users = [];

app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method="POST" action="/register">
      <label>username: <input type="text" name="username" required /></label><br/>
      <label>password: <input type="password" name="password" required /></label><br/>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.send(
      '<h1>Registration Failed: Username is already exists</h1><a href="/register">Go Registration page</a>',
    );
  }

  users.push({ username, password });
  res.send('<h1>Registration Success!</h1><a href="/login">Go Login Page</a>');
});

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="POST" action="/login">
      <label>username: <input type="text" name="username" required /></label><br/>
      <label>password: <input type="password" name="password" required /></label><br/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    req.session.isLoggedIn = true;
    req.session.username = username;
    res.send(`<h1>Login Success! welcome, ${username}!</h1><a href="/profile">Go Profile Page</a>`);
  } else {
    res.send('<h1>Login Failed!</h1><a href="/login">Go Login Page</a>');
  }
});

app.get('/profile', (req, res) => {
  if (req.session.isLoggedIn) {
    res.send(`<h1>Profile</h1><p>Welcome, ${req.session.username}！</p><a href="/logout">Logout</a>`);
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Logout Failed');
    }
    res.clearCookie('connect.sid');
    res.send('<h1>Logout Success!</h1><a href="/login">Go Login Page</a>');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});