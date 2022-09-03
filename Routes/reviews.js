const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const review = require('../controller/reviews');
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const { validateReview, isLoggedIn,isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview))
router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(review.deleteReview));

module.exports = router;