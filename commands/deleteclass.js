const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Confirmation = require('../obj/confirmation');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-channels')
		.setDescription('This command will delete channels under a specific category.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	// select the class category to archive
		.addChannelOption(option =>
			option.setName('cluster')
				.setDescription('Channel cluster to archive')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildCategory)),

	async execute(interaction, database, optionsData) {
		const cluster = optionsData[0];
		const clusterName = cluster.name;
		cluster.children.cache.forEach(channel => channel.delete());
		cluster.delete();
		await interaction.reply({ content: 'Deleted category ' + clusterName, ephemeral: true });
	},

	confirmation(interaction) {
		Confirmation.buildMsg(this.data.name, interaction);

		const optionsData = [];
		optionsData.push(interaction.options.getChannel('cluster'));
		return optionsData;
	},

	async cancelled(interaction) {
		interaction.reply({ content: 'Cancelled archival', ephemeral: true });
	},
};