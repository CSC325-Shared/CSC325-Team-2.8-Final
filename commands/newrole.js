const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newrole')
		.setDescription('Create a new general role')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) => option.setName('name').setDescription('Enter the name of the role').setRequired(true))
		.addStringOption((option) => option.setName('color').setDescription('Enter a hexcode for the color of the role. Ex: #84b55b').setRequired(true)),


	async execute(interaction) {
		const name = interaction.options.getString('name');
		const color = interaction.options.getString('color');


		interaction.guild.roles.create({
			name: name,
			color: color,
			permissions:
				[PermissionsBitField.Flags.SendMessages,
					PermissionsBitField.Flags.ViewChannel,
					PermissionsBitField.Flags.ReadMessageHistory,
					PermissionsBitField.Flags.ChangeNickname,
					PermissionsBitField.Flags.AddReactions,
					PermissionsBitField.Flags.AttachFiles],
		});
		await interaction.reply({ content: 'Created a new role: ' + name, ephemeral:true });
	},
};