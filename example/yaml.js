'use strict';

var config = {
	files: 'static', // Directory to crawl for static files
	template: 'template.yaml',
	output: 'app.yaml',
	placeholder: '%STATIC%'
}

var yaml = require('gae-static-yaml');

yaml(config, function (request, file, next) {
	// Massage the request and file values

	/*In this case, we are removing 'static' from the request URI
	so a file can be served from http://example.com/index.html
	instead of http://example.com/static/index.html, for example*/

	request = request.replace('static', '');

	// Alternatively, you can skip a file entry by setting request or file to '';

	next(request, file);
});