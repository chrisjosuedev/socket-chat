require('dotenv').config();

const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGODB_CONN);
        console.log('Connected Database.');
    } catch (error) {
        console.log(error);
        throw new Error('Database Connection Failed.');
    }
};

module.exports = {
    dbConnection,
};
