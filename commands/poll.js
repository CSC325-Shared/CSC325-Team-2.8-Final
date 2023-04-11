const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Use this command to create a poll. The max amount of options you can enter is 6.')
		.addStringOption(option => option.setName('title').setDescription('Insert the title of the poll.').setMaxLength(300).setRequired(true))
		.addStringOption(option => option.setName('answer1').setDescription('Enter the first option to choose from').setMaxLength(200).setRequired(true))
		.addStringOption(option => option.setName('answer2').setDescription('Enter the second option to choose from').setMaxLength(200).setRequired(true))
		.addStringOption(option => option.setName('answer3').setDescription('Enter the third option to choose from').setMaxLength(200).setRequired(false))
		.addStringOption(option => option.setName('answer4').setDescription('Enter the fourth option to choose from').setMaxLength(200).setRequired(false))
		.addStringOption(option => option.setName('answer5').setDescription('Enter the fifth option to choose from').setMaxLength(200).setRequired(false))
		.addStringOption(option => option.setName('answer6').setDescription('Enter the sixth option to choose from').setMaxLength(200).setRequired(false)),

	async execute(interaction) {
		await interaction.deferReply();
		const { user, guild, channel } = await interaction;
		const title = interaction.options.getString('title');
		const options = interaction.options.data;
		const defaultEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];

		// embed builder
		const embed = new EmbedBuilder()
			.setTitle(title)
			.setColor('Purple')
			.setThumbnail('https://i.imgur.com/JJbJA0m.png');

		for (let i = 1; i < options.length; ++i) {
			const emoji = defaultEmoji[i - 1];
			const answer = options[i];
			embed.addFields(
				{
					name: `${emoji} ${answer.value}`,
					value: ' ',
				},
			);

		}
		const message = await channel.send({ embeds: [embed] });

		for (let i = 1; i < options.length; i++) {
			const emoji = defaultEmoji[i - 1];
			message.react(emoji);

		}
		await interaction.editReply({ content: '**Poll created!** Please react to the emoji that best fits your answer to the question!' });
	},
};