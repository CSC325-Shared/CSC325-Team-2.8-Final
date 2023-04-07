const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js');

const Button = require('../obj/button');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('optional-select')
		.setDescription('Create a message to allow students to assign optional roles to themselves')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addRoleOption(option => option.setName('role1').setDescription('First role').setRequired(true))
		.addRoleOption(option => option.setName('role2').setDescription('Second role').setRequired(false))
		.addRoleOption(option => option.setName('role3').setDescription('Third role').setRequired(false))
		.addRoleOption(option => option.setName('role4').setDescription('Fourth role').setRequired(false))
		.addRoleOption(option => option.setName('role5').setDescription('Fifth role').setRequired(false))
		.addRoleOption(option => option.setName('role6').setDescription('Sixth role').setRequired(false))
		.addRoleOption(option => option.setName('role7').setDescription('Seventh role').setRequired(false))
		.addRoleOption(option => option.setName('role8').setDescription('Eighth role').setRequired(false)),

	async execute(interaction, database) {
		const roles = [];
		const buttons = [];
		const buttons2 = [];

		const btnNameBase = 'permBtn';

		// Delete existing buttons from database
		await database.deleteButtonsStartingWith(btnNameBase);

		for (let i = 1; i <= 8; ++i) {
			roles.push(interaction.options.getRole(`role${i}`));
		}

		// Loop through the roles array and create a button for each role
		for (let i = 0; i < roles.length; ++i) {
			if (roles[i]) {
				const btnID = btnNameBase + (i + 1);
				if (buttons.length < 5) {
					buttons.push(
						new ButtonBuilder()
							.setCustomId(btnID)
							.setLabel(`${roles[i].name}`)
							.setStyle(ButtonStyle.Secondary),
					);
				}
				else {
					// More than 5 buttons, add them to the second array
					buttons2.push(
						new ButtonBuilder()
							.setCustomId(btnID)
							.setLabel(`${roles[i].name}`)
							.setStyle(ButtonStyle.Secondary),
					);
				}
				// Save link between button and the role it assigns
				database.saveButton(new Button(btnID, roles[i].id));
			}
		}

		const buttonRow1 = new ActionRowBuilder()
			.addComponents(buttons);

		const embed = new EmbedBuilder()
			.setTitle('Role Selection Tutorial')
			.setDescription('Follow these steps below to select your desired role(s)')
			.setColor('Green')
			.addFields([
				{
					name: 'Step 1',
					value: 'Review all available roles and select the ones that are relevant or desirable to you.',
				},
				{
					name: 'Step 2',
					value: 'Click the button corresponding to the role(s) you wish to have.',
				},
				{
					name: 'Step 3',
					value: 'You will receive a message that will say that the role was successfully added. Click the button again to remove the role.',
				},
			]);

		if (buttons2.length == 0) {
			await interaction.reply({ embeds: [embed], components: [buttonRow1] });
		}
		else {
			// If there are more than 5 buttons, create a new row
			const buttonRow2 = new ActionRowBuilder()
				.addComponents(buttons2);
			await interaction.reply({ embeds: [embed], components: [buttonRow1, buttonRow2] });
		}
	},


};