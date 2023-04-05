const { SlashCommandBuilder, EmbedBuilder, Embed, PermissionFlagsBits, ButtonStyle, ActionRowBuilder, ButtonBuilder, ActionRow, TeamMemberMembershipState } = require('discord.js');

const Button = require('../obj/button');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('permrole')
		.setDescription('Create a message to allow students to assign roles to themselves')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addRoleOption(option => option.setName(`role1`).setDescription('First permanent role').setRequired(true))
		.addRoleOption(option => option.setName(`role2`).setDescription('Second permanent role').setRequired(false))
		.addRoleOption(option => option.setName(`role3`).setDescription('Third permanent role').setRequired(false))
		.addRoleOption(option => option.setName(`role4`).setDescription('Fourth permanent role').setRequired(false))
		.addRoleOption(option => option.setName(`role5`).setDescription('Fifth permanent role').setRequired(false))
        .addRoleOption(option => option.setName(`role6`).setDescription('Sixth permanent role').setRequired(false))
		.addRoleOption(option => option.setName(`role7`).setDescription('Seventh permanent role').setRequired(false))
		.addRoleOption(option => option.setName(`role8`).setDescription('Eighth permanent role').setRequired(false)),

	async execute(interaction, database) {
		const roles = [];
		const buttons = [];
        const buttons2 = [];

		const btnNameBase = 'permBtn';

		// Delete existing buttons from database
		await database.deleteButtonsStartingWith(btnNameBase);

		// TODO: Should we delete existing role assignment messages? Would need to store their ids

		for (i = 1; i <= 8; ++i) {
			roles.push(interaction.options.getRole(`role${i}`));
		}

		// Loop through the roles array and create a button for each role
		for (i = 0; i < roles.length; ++i) {
			if (roles[i]) {
				const btnID = btnNameBase + (i + 1);
				if (buttons.length < 5) {
					buttons.push(
						new ButtonBuilder()
							.setCustomId(btnID)
							.setLabel(`${roles[i].name}`)
							.setStyle(ButtonStyle.Secondary)
					);
				} else {
					// More than 5 buttons, add them to the second array
					buttons2.push(
						new ButtonBuilder()
							.setCustomId(btnID)
							.setLabel(`${roles[i].name}`)
							.setStyle(ButtonStyle.Secondary)
					);
				}
				// Save link between button and the role it assigns
				database.saveButton(new Button(btnID, roles[i].id));
			}
		}

		const buttonRow1 = new ActionRowBuilder()
			.addComponents(buttons)
			
		const embed = new EmbedBuilder()
			.setTitle('Role Selection Tutorial')
            .setDescription('Read the steps carefully to ensure you that you select the role want to have.')
			.setColor('Yellow')
			.addFields([
				{
					name: 'Step 1',
					value: 'Read through all roles to find ones that pertain to you or ones you would like to have.',
				},
				{
					name: 'Step 2',
					value: 'Click the button that is labelled with the role or roles that you are interested in.',
				},
				{
					name: 'Step 3',
					value: 'You will receive a message that will say that the role was successfully added. Click the button again to remove the role.',
				},
			])

        if (buttons2.length == 0) {
            await interaction.reply({ embeds: [embed], components: [buttonRow1] });
        } else {
            // If there are more than 5 buttons, create a new row
			const buttonRow2 = new ActionRowBuilder()
                .addComponents(buttons2)
            await interaction.reply({ embeds: [embed], components: [buttonRow1, buttonRow2] });
        }
	},


};