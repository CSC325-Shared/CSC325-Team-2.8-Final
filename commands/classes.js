const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('classes')
		.setDescription('Lists all active classes')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, database) {
		database.getAllCourses().then(courses => {
			let msg = '';
			if (courses.length === 0) {
				msg = 'There are no current courses!';
			}
			courses.forEach(course => {
				msg = msg + course.dept + course.code + ' - ' + course.semester + '\n';
			});
			interaction.reply(msg);
		});
		
	},
};
