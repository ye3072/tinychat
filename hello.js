const http = require('http');

var routes = {
	'/': function index (request, response) {
		// 1. Tell the browser everything is OK 
		//    (Status code 200, and the data is in plain text)
		response.writeHead(200);

		// 2. Write the announced text to the body of the page
		response.write('Hello, world');

		// 3. Tell the server that all of the response headers 
		//    and body have been sent
		response.end();
	},
	'/foo': function foo (request, response) {
		response.writeHead(200);
		response.write('You are now viewing "foo"!');
		response.end();
	}
}

http.createServer((request, response) => {

	if (request.url in routes) {
		return routes[request.url](request, response);
	}

	response.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	
	response.writeHead(404);
	response.write(http.STATUS_CODES[404]);
	response.end();

}).listen(1337); // 4. Tells the server what port to be on

