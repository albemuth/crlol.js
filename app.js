var _ = require('lodash');
var crautos = require('./lib/crautos.js');
var restify = require('restify');

var server = restify.createServer({
    name: 'crautos.js'

});

server.use(restify.fullResponse())
    .use(restify.bodyParser())
    .use(restify.queryParser());

server.get('/search', function (req, res, next) {
    crautos.search({
        modelstr: req.query.model
    }).then(function(results) {
        res.send(results);
    });
});


var port = process.env.PORT || 5000;
server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url)
});

