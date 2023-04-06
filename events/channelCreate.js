const client = require('..');

client.on("channelCreate", (channel) => {
        //database.writeToLogChannel(logMsg);
        console.log('Channel Created');
        //await interaction.reply({ content: 'Setup bot channels!', ephemeral: true });
});