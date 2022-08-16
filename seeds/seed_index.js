const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities =require('./cities');
const {descriptors,places} =require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connected to mongodatabase!!');
    })
    .catch((err) => {
        console.log('connection unsuccesfull');
        console.log(err);
    });
    const sample = array =>array[Math.floor(Math.random()*array.length)]

    const seedDb =async()=>{
        await Campground.deleteMany({});
        for(let i=0;i<50;i++){
            const random1000 = Math.floor(Math.random()*1000);
            const price = Math.floor(Math.random()*30)+1;
            const camp = new Campground({
                location:`${cities[random1000].city} - ${cities[random1000].state}`,
                title:`${sample(descriptors)} - ${sample(places)}`,
                image:'https://source.unsplash.com/collection/483251',
                description:'Lorem ipsum door are closed for the persoin who are too much greedy oin the world of the roman and is likely to the the best one in the whole universe and is likely to be the best person in the world',
                price
            })
            await camp.save();
        }
    }
    seedDb() .then(()=>{
        mongoose.connection.close();
    })