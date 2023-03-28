const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, ChannelType, GuildManager } = require('discord.js');
const {channelLog} = require('../config.json');	//Log Channel ID
const {logSetup} = require('../handlerlog'); //If log channel is set up or not
const logFunction = require('../handlerlog'); //Imports function that creates each log
const {profChannelPerms} = require('./newclass');

//By Harley Pearson
//Work in progress

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setup")
        .setDescription("Set up a command line and logging channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
                
	async execute(interaction, database) {
		// const embed = new EmbedBuilder();
		// const category = 1089030381929504799;

		// logFunction.handleLogs(); //error #1


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

//Need better method of checking if log setup was complete (Make option to set if true or false for start up and create)
//				/setup true or /setup false


		/*
		//Check if setup has been ran or not to create necessary channels
		if (logSetup == true) {
			logFunction.handleLogs(); //Loads log function
			
			await interaction.reply({ content: 'The Setup has already been complete'});

		} else if (logSetup == false){
			//Create Category with channels (Command line/Log Channel)
			//Would also need to change channelLog ID
			await interaction.reply({ content: 'The Setup has been complete'});
			logSetup = true;

		} else {
			await interaction.reply({ content: 'An error has occured'});
		}
		*/
	},
};


//return interaction.reply({embeds: [embed], ephemeral: true});
