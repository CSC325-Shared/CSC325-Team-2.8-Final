const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js');
//developed by Sarah Luetz
module.exports = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archives a class cluster')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)//check if user has permission to manage roles
		.addChannelOption(option =>//select the class category to archive
		option.setName('cluster')
		.setDescription('Channel cluster to archive')
		.setRequired(true)
		.addChannelTypes(ChannelType.GuildCategory)
		).addIntegerOption( option =>
			option.setName('class-num')
			.setDescription('Class number')
			.setRequired(true)
		),
		
		async execute(interaction, database) {
			const classNum = interaction.options.getInteger('class-num');
			const cluster = interaction.options.getChannel('cluster');
			// get class num from category name
			
			//confirm destructive action
			var proceed;
			const wait = require('node:timers/promises').setTimeout;
			const confirmationEmbed = new EmbedBuilder()
				.setColor('Red')
				.setTitle('Are you sure you want to perform this destructive action?')
				.setDescription('This action cannot be undone.')
				.setFooter({ text: 'React ✅ to confirm or ❌ to cancel',});
			const message = await interaction.reply({ embeds: [confirmationEmbed], fetchReply: true });
			await message.react('✅').then(() => message.react('❌')) //create & display confirmation message with reactions
			
			const filter = (reaction, user) => { 
				return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
			};

			message.awaitReactions({ filter, max: 1, time: 20000}).then(collected => {//catch the users reaction and compare it
				const reaction = collected.first();
				if (reaction.emoji.name === '✅') { //if they react with this specific emoji, destructive action is confirmed 
					proceed = true;
				} 
				else { //if they react literally any other way, including not reacting at all, do not confirm.
					proceed = false;
				}
			})
		
			.catch(collected => {
			proceed = false;
			});
			
			await wait(20000); //wait until reaction is collected and proceed is given a boolean
			if(proceed === true){ //if confirmed continue with archival
				
				// todo: add something to handle cohabitated classes
			const classStu = interaction.guild.roles.cache.find(role => role.name === `${classNum}` + ' Students'); 
			const classVet = interaction.guild.roles.cache.find(role => role.name === `${classNum}` + ' Veteran');
			
			if (!classVet) {interaction.guild.roles.create({name: `${classNum}` + ' Veteran'})}
			if (!classStu) {await interaction.followUp({content: 'There is no matching student role for that class number: ' + classNum, ephemeral: true});}

			var logMsg = "Archived class " + classNum + '\n';

			const list = await interaction.guild.members.fetch();
			var rolesChanged = 0;
			//this could probably be optimized by using .filter, look into it later 
			for(i = 0; i < list.size; i++){ //loop through all students who have the classStu role
				var member = list.at(i); 
				if (member.roles.cache.some(role => role === classStu)) {
					member.roles.add(classVet); //add class-veteran role
					member.roles.remove(classStu);//remove classStu role
					rolesChanged = rolesChanged + 1
					logMsg = logMsg + '	Removed role <@&' + classStu.id + '> and added role <@&' + classVet.id 
						+ '> to ' + member.user.username + '\n';
				}
			}
			cluster.permissionOverwrites.delete(classStu);//remove permission from classStu to access class cluster
			cluster.children.cache.forEach(channel => channel.permissionOverwrites.delete(classStu)); //remove permission from individual channels within the cluster
			
			// Delete course from database
			database.deleteCourseByCatIDandCourseCode(cluster.id, classNum).then(result => {
				// Check if any courses are still using the category. If none, then mark the category as 'Archived'
				database.getLinkCountByCatID(cluster.id).then(linkCount => {
					if (linkCount === 0) {
						cluster.setName(cluster.name + " (Archived)");
					} 
				})
			}); 

			database.writeToLogChannel(logMsg);

			await interaction.followUp({content: 'Archived class ' + cluster.name + '\n' + 'Users updated from student to veteran role: '
				+ rolesChanged, ephemeral: true});
			}
			else{ //if not confirmed, cancel
				await interaction.followUp({content: 'Cancelled archival', ephemeral: true});
			}
			
		}
}