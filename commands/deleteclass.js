const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

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

	async execute(interaction) {
		const cluster = interaction.options.getChannel('cluster');
		const clusterName = cluster.name;

		cluster.children.cache.forEach(channel => channel.delete());
		cluster.delete();
		await interaction.reply({ content: 'Deleted category ' + clusterName, ephemeral: true });
	},
};