const { SlashCommandBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits, GuildChannel, CategoryChannelChildManager, CategoryChannel } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
         .setName('delete-channels')
         .setDescription('This command will delete channels under a specific category.')
         .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
         .addChannelOption(option =>//select the class category to archive
         option.setName('cluster')
         .setDescription('Channel cluster to archive')
         .setRequired(true)
         .addChannelTypes(ChannelType.GuildCategory)),
         
    async execute(interaction, database) {
        const cluster = interaction.options.getChannel('cluster');
        const clusterName = cluster.name;

        cluster.children.cache.forEach(channel => channel.delete());
        cluster.delete();
        await interaction.reply({ content: 'Deleted category ' + clusterName, ephemeral: true});
    }
};