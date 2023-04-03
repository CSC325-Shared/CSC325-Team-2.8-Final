const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, ChannelType, GuildManager } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
        .setDescription("Set up a command line and logging channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
                
	async execute(interaction, database) {

		//Creates Category then channels for it
		interaction.guild.channels.create({
            name: 'Bot',
            type: ChannelType.GuildCategory,
			permissionOverwrites: [{
				id: interaction.guild.id,
				deny: [PermissionsBitField.Flags.ViewChannel]}],
			})
        .then(category => {
            interaction.guild.channels.create({
            name: 'Command-line',
            type: ChannelType.GuildText,
            parent: category.id,
            });
		interaction.guild.channels.create({
			name: 'Log Channel',
			type: ChannelType.GuildText,
			parent: category.id,
			}).then(logChannel => {
				database.saveLogChannelID(logChannel.id);
			});
		});
		
		await interaction.reply({ content: 'Setup bot channels!', ephemeral: true });


	},
};
