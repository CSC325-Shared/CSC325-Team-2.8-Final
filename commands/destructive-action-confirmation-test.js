const {Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions} = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("ready", () => {
    console.log("Bot is online!");

    client.user.setActivity('Botting', { type: "WATCHING" });
})


//Commands

client.on('message', message => {
    if (message.content.startsWith('/test')) { // /test should be replaced with the required command 
                                               // current command is just for testing purpouses
      const confirmationEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Are you sure you want to perform this destructive action?') //This message should be replaced with the specific action
        .setDescription('This action cannot be undone.')
        .setFooter(`Type "confirm" to confirm or "cancel" to cancel.`)
      message.channel.send(confirmationEmbed).then(confirmationMessage => {
        const filter = m => (m.author.id === message.author.id && (m.content.toLowerCase() === 'confirm' || m.content.toLowerCase() === 'cancel'));
        const collector = confirmationMessage.channel.createMessageCollector(filter, { time: 20000 }); // Wait for a response for 20 seconds
        collector.on('collect', m => {
          if (m.content.toLowerCase() === 'confirm') {
            message.channel.send('Destructive action confirmed!');
             //desired destructive action should be placed here and the above line should be replaced with
            // the desired message to be displayed to the user.
            // 
            // 
          } else {
            confirmationMessage.channel.send('Action cancelled.');
          }
        });
        collector.on('end', collected => {
          if (collected.size === 0) {
            confirmationMessage.channel.send('No response received. Action cancelled.');
          }
        });
      });
    }
  });