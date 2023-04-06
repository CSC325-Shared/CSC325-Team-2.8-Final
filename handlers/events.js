const fs = require('fs');

module.exports = () => {
	let events = fs.readdirSync('./events');//Events Folder
	for(let file of events) {
		require(`../events/${file}`);//Require events file
}};