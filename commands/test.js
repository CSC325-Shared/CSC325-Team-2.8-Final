const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test command to prove the bot is running'),
	async execute(interaction) {
		await interaction.reply('Hello! The bot developed by Team #8 is online!');
	},
};