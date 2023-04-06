const client = require('..');

client.on("channelDelete", (channel) => {
        //database.writeToLogChannel(logMsg);
        console.log('Channel Deleted');
        //await interaction.reply({ content: 'Setup bot channels!', ephemeral: true });
});
