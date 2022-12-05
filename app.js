var express = require('express');
var path = require('path');
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const users = require('./routes/users');
const files = require('./routes/files');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/users', users.getUsers);
app.get('/api/files', files.getFiles);

app.get('/api/users/:id(\\d+)', users.getUserById);
app.get('/api/files/:id(\\d+)', files.getFileById);

app.post('/api/users', users.createUser);
app.post('/api/files', files.createFile);

app.delete('/api/users/:id(\\d+)', users.deleteUser);
app.delete('/api/files/:id(\\d+)', files.deleteFile);

app.put('/api/users', users.updateUser);
app.put('/api/files', files.updateFile);

app.post('/api/login', users.getUserLogin);

module.exports = app;