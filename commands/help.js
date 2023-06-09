const { SlashCommandBuilder, EmbedBuilder,  PermissionFlagsBits  } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Learn about the bot commands')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('Yellow')
			.setTitle('Bot Command Help')
			.addFields([
				{
					name: '/setup',
					value: 'Assigns a category for the bot log and to interact with the bot',
				},
				{
					name: '/welcome',
					value: 'Creates a welcome message that displays the server rules',
				},
				{
					name: '/course-select',
					value: 'Creates a message for students to self-assign roles',
				},
				{
					name: '/optional-select',
					value: 'Creates a message for users to self-assign optional roles',
				},
				{
					name: '/newrole',
					value: 'Creates a new role',
				},
				{
					name: '/newclass',
					value: 'Generates a new class category with child channels',
					/* additional info: uses pre-existing student/veteran roles if they exist, creates them if not. sets student role permissions.
					saves course to list of currently active classes. */
				},
				{
					name: '/classes',
					value: 'Lists all the currently active classes',
				},
				{
					name: '/delete-channels',
					value: 'Deletes a class category and its child channels',
					// additional info: destructive action
				},
				{
					name: '/archive',
					value: 'Gives veteran roles, removes student roles, and removes permissions for a given category and class number.',
					/* additonal info: needs to be run multiple times for cohabitated course. will mark course as archived when no courses using the category.
					deletes course from the database. destructive action*/
				},
				{
					name: '/poll',
					value: 'Creates a poll after you enter a title, and at least two options.',
				},
				{
					name: '/roll',
					value: 'Rolls a given number of dice with a certain number of sides, can optionally add or subtract a modifier from the total.',
				},
			]);
		await interaction.reply({
			embeds: [embed],
		});
	},
};