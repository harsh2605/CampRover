const User = require('../models/user');
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', 'A user with the given username has already registered');
        res.redirect('register');
    }
}

module.exports.renderlogin = (req, res) => {
    res.render('users/login');
}

module.exports.originallogin =  (req, res) => {
    req.flash('success', 'Succesfully Logged In');
    //console.log(req.session);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.backTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
    });
}