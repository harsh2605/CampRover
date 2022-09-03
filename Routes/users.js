const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controller/users');



router.get('/register', users.renderRegister);
router.post('/register', catchAsync(users.register));
router.get('/login', users.renderlogin);
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.originallogin);
router.get('/logout', users.logout);
module.exports = router;