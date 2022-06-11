'use strict'

const mongoose = require("mongoose")
mongoose.Promise = global.Promise;

const dbConnection = mongoose.connect(process.env.MONGODB_CNN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then((result) => {
    console.log('Base de datos online');
}).catch((err) => {
    console.log('Error al iniciar la base de datos', err);
});



module.exports = {
    dbConnection

}