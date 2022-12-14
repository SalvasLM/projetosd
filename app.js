const app = require('./express/app');
const sequelize = require('./sequelize');
const cors = require('cors')
const PORT = 8080;
const os = require('os');

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function init() {
    await assertDatabaseConnectionOk();

    console.log(`Starting Sequelize + Express example on port ${PORT}...`);

    const corsOpts = { origin: '*', methods: ['GET', 'POST', 'DELETE', 'PUT'], allowedHeaders: ['Content-Type']};
    app.use(cors(corsOpts));
  
      app.listen(PORT, () => {
        console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
    });



}

init();