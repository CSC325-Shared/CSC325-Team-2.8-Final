const client = require('..');

client.on('roleCreate',(role) => {
	console.log('Role Created');
});