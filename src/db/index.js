const mongoose = require('mongoose');

const options = {};
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL, options)
    .then(res => console.log('Successfully! DB has connected'))
    .catch(err => console.log(err.message));
module.exports = mongoose;
