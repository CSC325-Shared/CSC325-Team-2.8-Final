const client = require('..');

client.on('roleDelete',(role) => {
	console.log('Role Deleted');
});