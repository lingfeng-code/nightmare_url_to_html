var Nightmare1 = require('nightmare');
var nightmare = Nightmare1({
	show: true,
	width: 1000,
	height: 800,
	gotoTimeout: 5000,
});
var fs = require('fs');
var URL = require('url');
var vo = require('vo');
var run = function* () {
	//split the read links on operating-specific newlines into an array
	var links = fs.readFileSync('links.txt')
		.toString()
		.split(require('os')
			.EOL);
	//filter out blank lines
	links = links.filter(function (link) {
		return !(/^\s*$/.test(link));
	});
	var n = 0;
	//run the page HTML retrieval and save for each link
	for (var ix in links) {
		var title = yield nightmare.goto(links[ix])
			.title();
		title = title.replace(/([^\x81-\xFE])\\/g, "$1＼");
		title = title.replace(/([^\x81-\xFE])\|/g, "$1｜");
		title = title.replace(/\//g, "／");
		title = title.replace(/:/g, "：");
		title = title.replace(/\*/g, "＊");
		title = title.replace(/\?/g, "？");
		title = title.replace(/</g, "＜");
		title = title.replace(/>/g, "＞");
		n++;
		title = String(n) + '_' + title + '.html';
		nightmare.html(title, 'HTMLComplete');
		console.log(title);
	}
	yield nightmare.end();
};
vo(run)(function (err) {
	console.log('done');
});
