// $node https.js

// load express module
const express = require('express');
const app = express();

// server = https
// openssl genrsa 1024 > privatekey.pem
// openssl req -new -key privatekey.pem -out certificate.pem
const fs = require('fs');
const privateKey = fs.readFileSync('privatekey.pem');
const certificate = fs.readFileSync('certificate.pem');
const options = {key: privateKey, cert: certificate};
const https = require('https');
const server = https.createServer(options, app);

// socket connection
const io = require('socket.io')(server);
const bcrypt = require('bcrypt');
const saltRounds = 10;

// root -> index.html
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});
app.post('/chat', function(request, response) {
	let password = request.body.password;
	let salt = '$2b$10$Z7PNdi7kNEk0Nhf1HJNPKu';
	bcrypt.hash(password, salt, (err, hash) => {
		if (hash == '$2b$10$Z7PNdi7kNEk0Nhf1HJNPKu..T28iKTd4oWgy1c5Z0B8HSST.QJoUe') {
			response.sendFile(__dirname + '/chat.html');
		} else {
			response.sendFile(__dirname + '/index.html');
		}
	});
})
app.get('/push', function(request, response) {
	response.sendFile(__dirname + '/js/push.js');
}
)

let count = 1;
// socket on connection
io.on('connection', function(socket) {
	console.log('user connected: ', socket.id);

	let name = 'user' + count++;
	io.to(socket.id).emit('change name', name);

	socket.on('disconnect', function() {
		console.log('user disconnected: ', socket.id);
	});

	socket.on('send message', function(name, text) {
		let msg = name + ' : ' + text;
		console.log(msg);
		io.emit('receive message', msg);
	});

	socket.on('send emergency', function() {
		io.emit('receive emergency');
	});
});

server.listen(3030, function() {
	console.log('server on!');
});
