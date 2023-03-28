const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType, AuditLogEvent, Client, Events } = require('discord.js');
const {logChannel} = require('./config.json');
//const {channel, guildId, options}=interaction;

let logSetup = true; //If setup command has been ran or not

function handleLogs(client) {
    
    //Send message reguarding a log
    function send_log(guildId, embed) {
         try {
            logChannel.send({ embeds: [embed] });
        } catch(err) {
            console.log(err);
        }
    }

    // Channel Created
    client.on("channelCreate", (channel) => {

        const embed = new EmbedBuilder()
            .setTitle('Channel Created')
            .setColor('Green')
            .setDescription(`${channel.name} has been created.`);

        return send_log(channel.guild.id, embed);

    })



    /*
    // Channel Deleted
    client.on("channelDelete", (channel) => {

        const embed = new EmbedBuilder()
            .setTitle('Channel Deleted')
            .setColor('Red')
            .setDescription(`${channel.name} has been deleted.`);

        return send_log(channel.guild.id, embed);

    });


    // Role Created
    client.on("roleCreate", (role) => {

        const embed = new EmbedBuilder()
            .setTitle('Role Added')
            .setColor('Red')
            .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}`);

        return send_log(role.guild.id, embed);

    });

    // Role Deleted
    client.on("roleDelete", (role) => {

        const embed = new EmbedBuilder()
            .setTitle('Role Deleted')
            .setColor('Red')
            .setDescription(`Role: ${role}\nRolename: ${role.name}\nRoleID: ${role.id}\nHEX Code: ${role.hexColor}\nPosition: ${role.position}`);

        return send_log(role.guild.id, embed);

    });

    // Member Got Role
    client.on("guildMemberRoleAdd", (member, role) => {

        const embed = new EmbedBuilder()
            .setTitle('User Got Role!')
            .setColor('Green')
            .setDescription(`**${member.user.tag}** got the role \`${role.name}\``);

        return send_log(member.guild.id, embed);

    })

    // Member Lost Role
    client.on("guildMemberRoleRemove", (member, role) => {

        const embed = new EmbedBuilder()
            .setTitle('User Lost Role!')
            .setColor('Red')
            .setDescription(`**${member.user.tag}** lost the role \`${role.name}\``);

        return send_log(member.guild.id, embed);

    })
    */

}

module.exports = { handleLogs };