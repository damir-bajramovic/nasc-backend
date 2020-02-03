const express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction)
    require('./local-config');

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

//app.use(session({ secret: 'nasc', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(e => {
        console.log('connected to mongodb');
    }).catch(console.log)

if (!isProduction) {
    mongoose.set('debug', true);
    app.use(errorhandler());
}

require('./init/services');

require('./models/User');
require('./models/Event');
require('./models/Comment');
require('./config/passport');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function(err, req, res, next) {
        console.log(req.get('host') + req.originalUrl);
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({'errors': {
        message: err.message,
        error: err
        }});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
        message: err.message,
        error: {}
    }});
});

// finally, let's start our server...
var server = app.listen( process.env.PORT, function(){
    console.log('Listening on port ' + server.address().port);
});