const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connected to mongodatabase!!');
    })
    .catch((err) => {
        console.log('connection unsuccesfull');
        console.log(err);
    });
const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63085ebbe11796264d8aff05',//username:Harsh agarwal ,password:Harsh@123
            location: `${cities[random1000].city} - ${cities[random1000].state}`,
            title: `${sample(descriptors)} - ${sample(places)}`,
            description: 'Lorem ipsum door are closed for the persoin who are too much greedy oin the world of the roman and is likely to the the best one in the whole universe and is likely to be the best person in the world',
            price,
            geometry:{
                type:"Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[
                {
                    url: 'https://res.cloudinary.com/de3t4ccjr/image/upload/v1661960313/YelpCamp/ym0yrqva4wsneqlnwd1t.jpg',
                    filename: 'YelpCamp/ym0yrqva4wsneqlnwd1t',
                },
                {
                    url: 'https://res.cloudinary.com/de3t4ccjr/image/upload/v1661960312/YelpCamp/q1speudg9clkwmi1wtsz.jpg',
                    filename: 'YelpCamp/q1speudg9clkwmi1wtsz',
                }
            ]
            })
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})