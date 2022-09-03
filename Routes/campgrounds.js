const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})
const campgrounds = require('../controller/campgrounds');

const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
router.get('/', catchAsync(campgrounds.index))
router.post('/', isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground));
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.get('/:id', catchAsync(campgrounds.showCampground))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))
router.put('/:id', isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground))
module.exports = router;