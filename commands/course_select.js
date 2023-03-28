const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ActionRow, TeamMemberMembershipState } = require('discord.js');

const Button = require('../obj/button');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('courses')
		.setDescription('Create a message to allow students to assign roles to themselves')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addRoleOption(option => option.setName(`class1`).setDescription('Student role for first class').setRequired(true))
		.addRoleOption(option => option.setName(`class2`).setDescription('Student role for second class').setRequired(false))
		.addRoleOption(option => option.setName(`class3`).setDescription('Student role for third class').setRequired(false))
		.addRoleOption(option => option.setName(`class4`).setDescription('Student role for fourth class').setRequired(false))
		.addRoleOption(option => option.setName(`class5`).setDescription('Student role for fifth class').setRequired(false)),

	async execute(interaction, database) {
		const roles = [];
		const buttons = [];

		const btnNameBase = 'classBtn';

		// Delete existing buttons from database
		await database.deleteButtonsStartingWith(btnNameBase);

		// TODO: Should we delete existing role assignment messages? Would need to store their ids

		for (i = 1; i <= 5; ++i) {
			roles.push(interaction.options.getRole(`class${i}`));
		}

		// Loop through the roles array and create a button for each role
		for (i = 0; i < roles.length; ++i) {
			if (roles[i]) {
				const btnID = btnNameBase + (i + 1);
				buttons.push(
					new ButtonBuilder()
						.setCustomId(btnID)
						.setLabel(`${roles[i].name}`)
						.setStyle(ButtonStyle.Secondary)
				);
				// Save link between button and the role it assigns
				database.saveButton(new Button(btnID, roles[i].id));
			}
		}

		const buttonRow1 = new ActionRowBuilder()
			.addComponents(buttons)
			
		const embed = new EmbedBuilder()
			.setTitle('Course Selection Tutorial')
            .setDescription('Read the steps carefully to ensure you that you get into the right class that you are registered for.')
			.setColor('Yellow')
			.addFields([
				{
					name: 'Step 1',
					value: 'Verify what classes you have with Professor Spradling in SIS or your Class Schedule.',
				},
				{
					name: 'Step 2',
					value: 'View the courses below and verify that the ones you need match the ones you are registered in SIS with.',
				},
				{
					name: 'Step 3',
					value: 'Click the button that is labelled after the class that you need. You will receive a message that will say that the role was successfully added. Click the button again to remove the role.',
				},
				{
					name: 'Step 4',
					value: 'Verify that the channels you need access to were added to the sidebar after selecting the classes you need. You will see the left sidebar populate with channels after you click the buttons that are the classes you need.',
				},
			])

		await interaction.reply({ embeds: [embed], components: [buttonRow1] });
	},


};