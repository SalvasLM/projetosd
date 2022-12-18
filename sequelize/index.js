const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('../sequelize/extra-setup');
const connectionString = process.env.DATABASE_URL
const connectionHost = process.env.DATABASE_HOST
const connectionPW = process.env.DATABASE_PASSWORD
const connectionUser = process.env.DATABASE_USER
const connectionPort = process.env.DATABASE_PORT
const connectionDatabase = process.env.DATABASE_DB




/*const sequelize = new Sequelize(connectionUser, connectionDatabase, connectionPW, {
    host: connectionHost,
    port: connectionPort,
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
    define: {
        timestamps: false
    }

});*/



const sequelize = new Sequelize('postgres', 'postgres', '7CnaH1Gghs0J32L', {
    host: 'sdprojectdb.internal',
    port: connectionPort,
    dialect: 'postgres',
    logQueryParameters: true,
    benchmark: true,
    define: {
        timestamps: false
    }

});










const modelDefiners = [
    users = require('../sequelize/models/users'),
    files = require('../sequelize/models/files'),

    // Add more models here...
    // require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize, Sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;