//include express
var express = require('express');

//create main app
var app = express();

//Set the port (Either attains the relevant port from the environment or picks a port for local dev)
var localPort = 5000;
var port = process.env.PORT || localPort;
//Set a variable for other config stuff that may depend on the environment
var local = false;
if (port == localPort) {
	local = true;
}

//Set up sessions (NOT WORKING CURRENTLY)
app.configure(function () {
	app.use(express.cookieParser());
	app.use(express.session({secret: 'secret', key: 'express.sid'}));
})

//Set up the views templates dir, use Jade to render them
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);

//Routes
app.get('/', function(req, res){
	//If base route render the page template
    res.render('page', {local: local});
});

//This allows us to call files in the public dir with /filename.extension
app.use(express.static(__dirname + '/public'));

//start listening
//app.listen(port); //no socket.io
//Configure socket.io
var io = require('socket.io').listen(app.listen(port));
console.log('Listening on port -' + port);
//if we are using Heroku or similar we need to fall back to xhr polling :( due to using the free hosting
if (!local) {
	io.configure(function () { 
  		io.set("transports", ["xhr-polling"]); 
  		io.set("polling duration", 10); 
	});
}

//Configure Sockets
io.sockets.on('connection', function (socket) {
	console.log('connection');
	socket.on('styleUpdate', function (data) {
		io.sockets.emit('update', data);
	})
})






