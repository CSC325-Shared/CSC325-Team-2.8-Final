// Imports
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const fs = require('node:fs');
const path = require('node:path');

const db = require('./database');

// Import token from private config file
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();
const database = new db(client);

// Parameter data for commands that use a confirmation message
const paramData = new Map();

// Import commands
const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log('[WARNING] The command at ${filePath} is missing a required "data" or "execute property!');
	}
}

// Event on startup
client.once(Events.ClientReady, c => {
	// Set the status message
	client.user.setPresence({
		activities: [
		  {
			name: 'your commands!',
			type: ActivityType.Listening
		  }
		],
		status: 'online'
	});
	console.log('Team 2.8 bot is now online!');
	console.log('Logged in as ' + c.user.tag);
	database.setup();
});

// Run the desired command
client.on(Events.InteractionCreate, async interaction => {
	// Run autocomplete methods
	if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction, database);
		}
		catch (error) {
			console.error(error);
		}
	}
	if (interaction.isButton()) {
		// Destructive action yes and no buttons
		if (interaction.customId.startsWith('confirmYes')) {
			const cmdName = interaction.customId.substring(10);
			const command = interaction.client.commands.get(cmdName);
			const data = paramData.get(cmdName);
			try {
				await command.execute(interaction, database, data);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}

			interaction.message.delete();
		}
		else if (interaction.customId.startsWith('confirmNo')) {
			const cmdName = interaction.customId.substring(9);
			const command = interaction.client.commands.get(cmdName);
			command.cancelled(interaction);

			interaction.message.delete();
		}
		// Course select and optional select role buttons
		else {
			const roleID = await database.getRoleIDByButtonID(interaction.customId);
			if (roleID !== 'No id found!') {
				const member = interaction.member;
				const role = interaction.guild.roles.cache.find(role => role.id == roleID);
				await interaction.deferReply({ ephemeral: true });
				if (!member.roles.cache.has(role.id)) {
					await member.roles.add(role);
					await interaction.editReply({ content: 'Role ' + role.name + ' added', ephemeral:true });
				}
				else {
					await member.roles.remove(role);
					await interaction.editReply({ content: 'Role ' + role.name + ' removed', ephemeral:true });
				}
				await wait(4000);
				await interaction.deleteReply();
			}
		}
	}
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		if (typeof command.confirmation === 'function') {
			// Set params from destructive command
			const data = command.confirmation(interaction);
			paramData.set(command.data.name, data);
		}
		else {
			await command.execute(interaction, database);
		}
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command! Check the console.', ephemeral: true });
	}
});

// Event handlers for log channel
client.on(Events.ChannelCreate, (channel) => {
	database.writeToLogChannel(`Created channel: **${channel.name}**`);
});

client.on(Events.ChannelDelete, (channel) => {
	database.writeToLogChannel(`Removed channel: **${channel.name}**`);
});

client.on(Events.GuildRoleCreate, (role) => {
	database.writeToLogChannel(`Created role: **<@&${role.id}>**`);
});

client.on(Events.GuildRoleDelete, (role) => {
	database.writeToLogChannel(`Removed role: **${role.name}**`);
});

client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
	if (oldMember.roles.cache.size < newMember.roles.cache.size) {
		// Find the added role
		const addedRole = newMember.roles.cache.find(role => !oldMember.roles.cache.has(role.id));
		// Log the role name and id
		database.writeToLogChannel(`Role **${addedRole.name}** added to user **<@${newMember.id}> (${newMember.user.tag})**`);
	}
	else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
		// Find the removed role
		const removedRole = oldMember.roles.cache.find(role => !newMember.roles.cache.has(role.id));
		// Log the role name and id
		database.writeToLogChannel(`Role **${removedRole.name}** removed from user **<@${newMember.id}> (${newMember.user.tag})**`);
	}
});


client.login(token);