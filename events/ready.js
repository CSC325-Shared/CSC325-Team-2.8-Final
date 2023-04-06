const client = require('..');
const {ActivityType} = require('discord.js');

//Not really necessary, just testing for now

client.on('ready',() => {
	//console.log(`Logged in as ${client.user.tag}`)

	client.user.setActivity('DND',{
		type: ActivityType.Playing
	});

	client.user.setStatus('dnd');
});