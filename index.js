'use strict';

module.exports = function (config, custom) {
	if (typeof config !== 'object') {
		return console.error('No config object provided');
	}

	if (!config.files) {
		config.files = 'static';
	}

	if (!config.template) {
		config.template = 'template.yaml';
	}

	if (!config.output) {
		return console.error('Output file not defined');
	}

	if (!config.placeholder) {
		config.placeholder = '%STATIC%';
	}

	var fs = require('fs');

	var yaml;
	fs.readFile(config.template, 'utf8', function (error, data) {
		if (error) return console.error(error);

		yaml = data;
		generate();
	});

	function generate() {
		var finder = require('findit2')(config.files);

		var entries = '';
		finder.on('file', function (file) {
			file = file.replace(/\\/g, '/');
			var request = file;

			if (custom) return custom(request, file, save);
			save(request, file);
		});

		function save(request, file) {
			if (request && file) {
				var entry = '- url: ' + request + '\n  static_files: ' + file + '\n  upload: ' + file + '\n';
				console.log(entry);

				entries += entry;
			}
		}

		finder.on('end', function () {
			yaml = yaml.replace(config.placeholder, entries);

			fs.writeFile(config.output, yaml, function (error) {
				if (error) return console.error(error);

				console.log('Saved to ' + config.output);
			});
		});
	}
};