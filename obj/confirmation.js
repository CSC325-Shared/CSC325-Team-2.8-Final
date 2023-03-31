const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')

class Confirmation {
    static buildMsg(name, interaction) {
        const confirmationEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('Are you sure you want to perform this destructive action?')
        .setDescription('This action cannot be undone.');
        const buttons = [];
        buttons.push(
            new ButtonBuilder()
                .setCustomId('confirmYes' + name)
                .setLabel('Continue')
                .setStyle(ButtonStyle.Danger)
        );
        buttons.push(
            new ButtonBuilder()
                .setCustomId('confirmNo' + name)
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Primary)
        );
        const buttonRow = new ActionRowBuilder().addComponents(buttons);	

        const data = {
            embeds: [confirmationEmbed],
            components: [buttonRow],
            ephemeral: true
        }
        interaction.reply(data);
    }
}

module.exports = Confirmation;