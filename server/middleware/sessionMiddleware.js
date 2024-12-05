const session = require('express-session');

const sessionMiddleware = session({
  secret: 'your_secret_key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if you're using HTTPS
});

module.exports = sessionMiddleware;
