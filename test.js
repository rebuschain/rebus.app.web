const fs = require('fs');
const path = require('path');
const kebabCase = require('lodash/kebabCase');

String.prototype.toCamelCase = function(cap1st) {
	'use strict';
	return ((cap1st ? '-' : '') + this).replace(/-+([^-])/g, function(a, b) {
			return b.toUpperCase();
	});
};

function isCamelCase(str){

	'use strict';

	var strArr = str.split('');
	var string = '';
	for(var i in strArr){

			if(strArr[i].toUpperCase() === strArr[i]){
					string += '-'+strArr[i].toLowerCase();
			}else{
					string += strArr[i];
			}

	}

	if(string.toCamelCase(true) === str){
			return true;
	}else{
			return false;
	}

}
const files = [];

const getFiles = (currDir) => {
	fs.readdirSync(currDir).forEach(file => {
		if (fs.statSync(path.join(currDir, file)).isDirectory()) {
			getFiles(path.join(currDir, file));
		} else if (isCamelCase(file)) {
			files.push(path.join(currDir, file));
		}
	});
};

getFiles(path.join(__dirname, 'public'));

console.log(files);

files.forEach((file) => {
	const split = file.split('/');
	const filename = split[split.length - 1];
	const res = `${kebabCase(filename.split('.')[0])}.${filename.split('.')[1]}`;
	fs.renameSync(file, path.join(split.slice(0, split.length - 1).join('/'), res));
});
