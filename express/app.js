const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


// A middleware function to verify the JWT and attach the decoded
// user object to the request object
const verifyJwt = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, "4ta$!sS2q#jGXOq0*7", (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        // attach the decoded user object to the request object
        req.user = decoded;
        next();
    });
};

const routes = {
    users: require('../express/routes/usersRoutes'),
    files: require('../express/routes/filesRoutes'),

};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
    return async function(req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

app.get('/', (req, res) => {
    res.send(`
		<h2>Hello, Sequelize + Express!</h2>
		<p>Make sure you have executed <b>npm run setup-example-db</b> once to have a populated example database. Otherwise, you will get <i>'no such table'</i> errors.</p>
		<p>Try some routes, such as <a href='/api/users'>/api/users</a> !</p>
		<p>To experiment with POST/PUT/DELETE requests, use a tool for creating HTTP requests such as <a href='https://github.com/jakubroztocil/httpie#readme'>HTTPie</a>, <a href='https://www.postman.com/downloads/'>Postman</a>, or even <a href='https://en.wikipedia.org/wiki/CURL'>the curl command</a>, or write some JS code for it with <a href='https://github.com/sindresorhus/got#readme'>got</a>, <a href='https://github.com/sindresorhus/ky#readme'>ky</a> or <a href='https://github.com/axios/axios#readme'>axios</a>.</p>
        'X-Container-Id',
	${process.env.HOSTNAME}`);

});




// We define the standard REST APIs for each route (if they exist).
for (const [routeName, routeController] of Object.entries(routes)) {
    if (routeController.getAll) {
        app.get(
            `/api/${routeName}`, verifyJwt,
            makeHandlerAwareOfAsyncErrors(routeController.getAll)
        );
    }
    if (routeController.create) {

        if(routeName === "files"){
            app.post(
                `/api/${routeName}`, verifyJwt,
                makeHandlerAwareOfAsyncErrors(routeController.create)
            );
        }
        app.post(
            `/api/${routeName}`,
            makeHandlerAwareOfAsyncErrors(routeController.create)
        );
    }
    if (routeController.update) {
        app.put(
            `/api/${routeName}/:id`,verifyJwt,
            makeHandlerAwareOfAsyncErrors(routeController.update)
        );
    }
    if (routeController.remove) {
        app.delete(
            `/api/${routeName}/:id`,verifyJwt,
            makeHandlerAwareOfAsyncErrors(routeController.remove)
        );
    }
    if (routeController.login) {
        app.post(
            `/api/${routeName}/login`,
            makeHandlerAwareOfAsyncErrors(routeController.login)
        );
    }

    if (routeController.getById) {
        app.get(
            `/api/${routeName}/:id`,
            makeHandlerAwareOfAsyncErrors(routeController.getById)
        );
    }
    if (routeController.uploadImage) {
        app.post(
            `/api/${routeName}/upload`, verifyJwt,
            makeHandlerAwareOfAsyncErrors(routeController.uploadImage)
        );
    }
    if (routeController.getAllUserFiles) {
        app.get(
            `/api/${routeName}/user/:id`, verifyJwt,
            makeHandlerAwareOfAsyncErrors(routeController.getAllUserFiles)
        );
    }
}






module.exports = app;