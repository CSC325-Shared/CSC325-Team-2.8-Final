const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const Confirmation = require('../obj/confirmation');
// developed by Sarah Luetz
module.exports = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archives a class cluster')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)// check if user has permission to manage roles
		.addChannelOption(option =>// select the class category to archive
			option.setName('cluster')
				.setDescription('Channel cluster to archive')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildCategory),
		).addIntegerOption(option =>
			option.setName('class-num')
				.setDescription('Class number')
				.setRequired(true),
		),

	async execute(interaction, database, optionsData) {
		// Since this command won't run until after a confirmation message, we need to fetch the stored parameter data,
		// instead of getting it from the interaction
		const classNum = optionsData[0];
		const cluster = optionsData[1];

		const classStu = interaction.guild.roles.cache.find(role => role.name === `${classNum}` + ' Students');
		const classVet = interaction.guild.roles.cache.find(role => role.name === `${classNum}` + ' Veteran');

		if (!classVet) {interaction.guild.roles.create({ name: `${classNum}` + ' Veteran' });}
		if (!classStu) {await interaction.reply({ content: 'There is no matching student role for that class number: ' + classNum, ephemeral: true });}

		database.getCourseByNum(classNum).then(() => {
			let logMsg = 'Archived class: **' + cluster.name + '**\n';

			interaction.guild.members.fetch().then(list => {
				let rolesChanged = 0;
				for (i = 0; i < list.size; i++) { // loop through all students who have the classStu role
					const member = list.at(i);
					if (member.roles.cache.some(role => role === classStu)) {
						member.roles.add(classVet); // add class-veteran role
						member.roles.remove(classStu);// remove classStu role
						rolesChanged = rolesChanged + 1;
					}
				}
				cluster.permissionOverwrites.delete(classStu);// remove permission from classStu to access class cluster
				cluster.children.cache.forEach(channel => channel.permissionOverwrites.delete(classStu)); // remove permission from individual channels within the cluster

				// Delete course from database
				database.deleteCourseByCatIDandCourseCode(cluster.id, classNum).then(() => {
					// Check if any courses are still using the category. If none, then mark the category as 'Archived'
					database.getLinkCountByCatID(cluster.id).then(linkCount => {
						if (linkCount === 0) {
							cluster.setName(cluster.name + ' (Archived)');
						}
					});
				});

				database.writeToLogChannel(logMsg);
				interaction.reply({ content: 'Archived class: **' + cluster.name + '**\n' + 'Users updated from student to veteran role: '
						+ rolesChanged, ephemeral: true });
			});
		});
	},

	confirmation(interaction) {
		Confirmation.buildMsg(this.data.name, interaction);

		const optionsData = [];
		optionsData.push(interaction.options.getInteger('class-num'));
		optionsData.push(interaction.options.getChannel('cluster'));
		return optionsData;
	},

	async cancelled(interaction) {
		interaction.reply({ content: 'Cancelled archival', ephemeral: true });
	},
};