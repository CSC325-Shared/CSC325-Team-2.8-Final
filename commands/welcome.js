const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Generate a welcome message.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setTitle('Welcome to Professor Spradling\'s Discord!')
            .setThumbnail('https://blogs.umflint.edu/cas/wp-content/uploads/sites/5/2016/01/spradling.jpg')
			.setColor('Red')
			.addFields([
				{
					name: 'Rules',
                    value: 'Please be sure to read the rules as listed below before assigning roles to yourself. These rules are subject to change at will of Professor Spradling.',
				},  
                {
					name: 'Be respectful',
					value: 'Treat others with respect. This includes using peoples preferred names, pronouns, and other identifiers, as well as treating their views with respect.',
				},         
				{
					name: 'No Racism, Homophobia, Hate Speech',
					value: 'No racism, sexism, homophobia or other hate speech permitted in any text channel or voice channel (or on related Zoom calls). Please abide by the University of Michigan Student Code of Conduct',
				},
                {
					name: 'No NSFW content',
					value: 'No NSFW content permitted in any text, voice, or video channels (Porn/Adult Content, Graphic/Disturbingly Violent Content, Illegal Content). Please use your best discretion. Admins will warn/ban as they see fit.  This also includes external links, Zooms, streams, etc. linked to from the server.',
				},
                {
					name: 'No Spam',
					value: 'No excessive spam. Copy/Paste is encouraged but use it with discretion.',
				},
                {
					name: 'Banter Policy',
					value: 'Trash-talking/Competitive Spirit is encouraged but please refrain from crossing the line into bullying/harassment. Context matters!  (This includes bullying towards all university community members, so please don\'t bully your professors, other students, group partners, or staff members either!)',
				},
                {
					name: 'Posting Homework Solutions is not permitted',
					value: 'Please do not post solutions to assignments from your courses unless I have made an explicit exception.  It is difficult for me to keep track of which assignments have had their deadline passed for all courses, so this is the safer policy.',
				},
                {
					name: 'Unusual Activity',
					value: 'If you appear to be behaving like a bot, you may have your access removed while I verify whether or not you are still human.',
				},
                {
					name: 'Failure to abide by the rules will typically result in a warning. Repeated failures or egregious incidents will likely result in a time-out of up to 1 week (usually 24 hours), but failing that will likely result in a ban.',
                    value: ' ',
				},
			]);
		await interaction.reply({
			embeds: [embed],
		});
	},
};
