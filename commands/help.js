const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//optional: put in a specific command for more details
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Learn about the bot commands'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('Yellow')
			.setTitle('Bot Command Help')
			.addFields([
				{
					name: '/Archive',
					value: 'Gives veteran roles, removes student roles, and removes permissions for a given category and class number.',
					/*additonal info: needs to be run multiple times for cohabitated course. will mark course as archived when no courses using the category.
					deletes course from the database. destructive action*/
				},
				{
					name: '/Classes',
					value: 'Lists all the currently active classes',
				},
				{
					name: '/Course Select',
					value: 'Creates a message for students to self-assign roles',
				},
				{
					name: '/Delete Class',
					value: 'Deletes a class category and its child channels',
					//additional info: destructive action
				},
				{
					name: '/New Class',
					value: 'Generates a new class category with child channels',
					/*additional info: uses pre-existing student/veteran roles if they exist, creates them if not. sets student role permissions.
					saves course to list of currently active classes. */
				},
				{
					name: '/New Role',
					value: 'Creates a new role',
				},
				{
					name: '/Setup',
					value: 'Assigns a category for the bot log and to interact with the bot',
				},
				{
					name: '/Welcome',
					value: 'Creates a welcome message that displays the server rules',
				},
			]);
			await interaction.reply({
			embeds: [embed],
		});
	},
};