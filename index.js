// require('dotenv').config();

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');


const userRoutes = require('./Routes/users');
const campgroundsRoutes = require('./Routes/campgrounds');
const reviewsRoutes = require('./Routes/reviews');
// const dbUrl = process.env.DB_URL;

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connected to mongodatabase!!');
    })
    .catch((err) => {
        console.log('connection unsuccesfull');
        console.log(err);
    });




const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressErrors = require('./utils/ExpressErrors');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressErrors(msg, 400)
    }
    else {
        next();
    }
}
const sessionConfig = {
    name:'session',
    secret: "thisisthebestsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//it is being added for security puropseso that client cannot accees the cookies directly
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
// app.use(helmet({contentSecurityPolicy:false}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.get('/', (req, res) => {
    res.render('home');
})
app.all('*', (req, res, next) => {
    next(new ExpressErrors('Page Not Found!!', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no Something went wrong!!';
    res.status(statusCode).render('error', { err });
})
app.listen(3000, () => {
    console.log("Listening to port 3000!!!");
})