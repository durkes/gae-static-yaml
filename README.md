# gae-static-yaml

Automatically generate a GAE app.yaml file with a handler for every static file - for use with a custom 404 handler.

The purpose of gae-static-yaml is to easily generate an app.yaml file for Google App Engine, including a static file handler for every static file in your module. By explicitly defining a handler for each file, you can then us e a catch-all handler to serve a custom 404 page. (Note: You will need to serve your 404 page with a script in order to set the 404 status header.)

### Table of Contents
 * [Installation](#installation)
 * [template.yaml](#template-yaml)
 * [Config](#config)
 * [Deploy](#deploy)
 * [Example](#example)

## Installation
If you do not already have Node.js installed, you will need to install it from [nodjs.org](http://www.nodejs.org/).

Inside (or near) your project directory, from the command line:
```bash
$ npm install gae-static-yaml
```

## template.yaml
Create a yaml template (named something other than app.yaml - we're calling it template.yaml) and include a placeholder variable for the static file handlers (%STATIC%):
```yaml
version: 1
runtime: php55
api_version: 1

handlers:
%STATIC%
- url: /.*
  script: error/404.php
```

## Config
Create a JavaScript file (named yaml.js) to configure and run gae-static-yaml:
```js
var yaml = require('gae-static-yaml');

var config = {
	files: 'static', // Directory to crawl for static files
	template: 'template.yaml',
	output: 'app.yaml',
	placeholder: '%STATIC%'
}

yaml(config, function (request, file, next) {
	// Massage the request and file values

	/*In this case, we are removing 'static' from the request URI
	so a file can be served from http://example.com/index.html
	instead of http://example.com/static/index.html, for example*/

	request = request.replace('static', '');

	// Alternatively, you can skip a file entry by setting request or file to '';

	next(request, file);
});
```

## Deploy
Generate your app.yaml file:
```bash
$ node yaml
```

Deploy by specifying app.yaml
```bash
$ appcfg.py -A PROJECT update app.yaml
```

## Example
See an [example](example) including the directory structure, [config](example/yaml.js), [template.yaml](example/template.yaml), and generated [app.yaml](example/app.yaml) file.

### License
[MIT](LICENSE)