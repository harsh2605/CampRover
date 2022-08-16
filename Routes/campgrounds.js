const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressErrors = require('../utils/ExpressErrors');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressErrors(msg, 400)
    } else {
        next();
    }
}
router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.find({});
    res.render('campgrounds/index', { camp });
}))
router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressErrors('Data Not found',404);
    const store = req.body.campground;
    const campground = new Campground(store);
    await campground.save();
    req.flash("success", "Succesfully created a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { camp });
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Succesfully Updated the campground");
    res.redirect(`/campgrounds/${store._id}`);
}))
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Campground.findByIdAndDelete(id);
    req.flash("success", "Succesfully deleted campground");
    res.redirect('/campgrounds');
}))


module.exports = router;