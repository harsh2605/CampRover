const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Review = require('./models/review');
const campgrounds = require('./Routes/campgrounds');
const reviews = require('./Routes/reviews');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressErrors = require('./utils/ExpressErrors');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connected to mongodatabase!!');
    })
    .catch((err) => {
        console.log('connection unsuccesfull');
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
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
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
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