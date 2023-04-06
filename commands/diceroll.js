const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Roll some dice')
		.addIntegerOption(option =>
			option.setName('quantity')
			.setDescription('How many dice to roll')
			.setRequired(true)
		)
        .addIntegerOption(option =>
			option.setName('sides')
			.setDescription('How many sides the dice should have')
			.setRequired(true)
		)
		.addIntegerOption(option =>
			option.setName('modifier')
			.setDescription('How much to add or subtract')
		),
		async execute(interaction) {
			const sides = interaction.options.getInteger('sides');
			const quantity = interaction.options.getInteger('quantity');
			const modifier = interaction.options.getInteger('modifier');
			var rolls = [];
			var total = 0;
			
			for (i = 0; i < quantity; i++){
				var roll = Math.floor(Math.random() * sides) + 1;
				rolls[i] = roll;
				total += roll;
			};
			
			var message1 = 'Rolled ' + quantity + 'd' + sides;
			var message2 = 'Individual rolls: ';
            var message3;

			for (i = 0; i < quantity; i++){
				message2 += '\n'; 
				message2 += rolls[i].toString();
			};
			if (modifier > 0)
				message3 = 'Total (+' + modifier + '): ';
			else if (modifier < 0)
				message3 = 'Total (' + modifier + '): ';
			else
				message3 = 'Total: ';
			
			const embed = new EmbedBuilder()
				.setColor('Blue')
				.setTitle('Dice Roller')
				.setThumbnail('https://i.imgur.com/W5ClLmz.png')
				.addFields(
					{name: message1, value:message2},
					{name: message3, value:(total+modifier).toString()},
				);
			await interaction.reply({embeds: [embed] });
		}
};