const { SlashCommandBuilder, ChannelType, PermissionsBitField, PermissionFlagsBits, UserFlagsBitField  } = require('discord.js');
const Course = require('../obj/course');
const CatLink = require('../obj/catlink');
const Color = require('color');
const fs = require('fs');
const { LIMIT_LENGTH } = require('sqlite3');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newclass')
		.setDescription('Create a class')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) => option.setName('dept').setDescription('The class dept (without the class number)').setRequired(true))
		.addStringOption((option) => option.setName('classcode').setDescription('The class number (without the dept)').setRequired(true))
		.addStringOption((option) => option.setName('semester').setDescription('The class semester (example: "Fall 2022"').setRequired(true))
        
        .addBooleanOption((option) => option.setName('videos').setDescription('Does this class require videos (Zoom Video recordings, or other) to be created? (True/False)').setRequired(true))
        //meet day selection
        .addStringOption((option) => option.setName('meet-day').setDescription('Input the day(s) to which the class meets').setRequired(false)
            .addChoices( {name: 'mon', value:'Monday'}, {name: 'tue', value:'Tuesday'}, {name: 'wed', value:'Wednesday'}, {name: 'thur', value:'Thursday'}, {name: 'fri', value:'Friday'}))
        .addStringOption((option) => option.setName('second-day').setDescription('Input the day(s) to which the class meets').setRequired(false)
            .addChoices( {name: 'mon', value:'Monday'}, {name: 'tue', value:'Tuesday'}, {name: 'wed', value:'Wednesday'}, {name: 'thur', value:'Thursday'}, {name: 'fri', value:'Friday'}))
        //time
        .addStringOption((option) => option.setName('times').setDescription('Input the meeting times (Start Time (AM/PM) - End Time (AM/PM)').setRequired(false))
        //zoom
        .addStringOption((option) => option.setName('zoom').setDescription('Paste the Zoom link for the class').setRequired(false))
        .addChannelOption((option) => option.setName('cohabitate').setDescription('Select a class to cohabitate with').setRequired(false)
        .addChannelTypes(ChannelType.GuildCategory)),
	async execute(interaction, database) {
		const dept = interaction.options.getString('dept').toUpperCase();
		const course = interaction.options.getString('classcode');
		const semester = interaction.options.getString('semester');
        //video parameter
        const video =  interaction.options.getBoolean('videos');
        //zoom parameters
        const dayOne = interaction.options.getString('meet-day');
        const dayTwo = interaction.options.getString('second-day');
        const time = interaction.options.getString('times');
        const link = interaction.options.getString('zoom');
        const cohabitate = interaction.options.getChannel('cohabitate');

        //howto array
        const howArray = fs.readFileSync('./howto.txt').toString().split("\n");

        // Any message that should not cause the class creation to abort should be added to this variable
        let warning = "";

        // Default role color
        let studentColor = "";
        
        const dbv = await database.courseExists(dept, course, semester);
        if (dbv) {
                await interaction.reply({ content: 'Sorry, but class ' + dept + course + ' - ' + semester + ' already exists.', ephemeral: true});
        } else {
            const studentsRole = course + " Students";
            const veteranRole = course + " Veteran";

            let rolesList = [...interaction.guild.roles.cache.values()]
            // sort in the actual order shown in list, internal position is the opposite
            rolesList.sort(function(a, b) {
                return b.position - a.position;
            });
            const studentRoles = rolesList.filter(item => item.name.includes('Students'));
            // remove "Students" role from the array
            studentRoles.splice(studentRoles.indexOf("Students"), 1);

            if (!interaction.guild.roles.cache.find(role => role.name == studentsRole)) {
                studentColor = await database.getAvailableColor();
                if (studentColor === "No available color") {
                    studentColor = "ffffff";
                    warning += 'All colors in the database have been used! Defaulting student role color to #FFFFFF' + '\n';
                }
                await interaction.guild.roles.create({
                    name: studentsRole,
                    permissions: [PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.ReadMessageHistory,
                                PermissionsBitField.Flags.ChangeNickname,
                                PermissionsBitField.Flags.AddReactions, 
                                PermissionsBitField.Flags.AttachFiles],
                    color: studentColor,
                    position: findPosition(studentsRole, studentRoles)
                });

                database.setColorUsed(studentColor);
            }
            // Create veteran role, if it doesn't already exist
            if (!interaction.guild.roles.cache.find(role => role.name == veteranRole)) {
                const studentRole = interaction.guild.roles.cache.find(role => role.name == studentsRole);
                const studentRoleColor = studentRole.color;

                const veteranRoles = rolesList.filter(item => item.name.includes('Veteran'));
                await interaction.guild.roles.create({
                    name: veteranRole,
                    permissions: [PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.ReadMessageHistory,,
                                PermissionsBitField.Flags.ChangeNickname,
                                PermissionsBitField.Flags.AddReactions, 
                                PermissionsBitField.Flags.AttachFiles],
                    color: Color(studentRoleColor).darken(0.4).hex(),
                    position: findPosition(veteranRole, veteranRoles)
                });
            }
   
            // Resolve with the category id used by the class
            new Promise((resolve, reject) => {
                // template permissions and student id
                const studentRoleID = interaction.guild.roles.cache.find(role => role.name === studentsRole).id;
                const profChannelPerms = [{id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]},
                    {id: studentRoleID,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                    deny: [PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.CreateInstantInvite,
                        PermissionsBitField.Flags.CreatePrivateThreads,
                        PermissionsBitField.Flags.CreatePublicThreads]}];

                if (cohabitate) {
                    warning += 'Cohabitating with ' + cohabitate.name + '. No channels have been created! ' + '\n';

                    // Set permissions in category
                    cohabitate.permissionOverwrites.edit(studentRoleID, { ViewChannel: true, CreateInstantInvite: false });

                    // Set permissions in child channels (the ones that need it)
                    const announcementsChannel = cohabitate.children.cache.find(c => c.name.startsWith("announcements"));
                    const zoomChannel = cohabitate.children.cache.find(c => c.name.startsWith("zoom-meeting-info"));
                    const videoChannel = cohabitate.children.cache.find(c => c.name.startsWith("how-to-make-a-video"));
                    announcementsChannel.permissionOverwrites.edit(studentRoleID, { ViewChannel: true, 
                        SendMessages: false, CreateInstantInvite: false, CreatePrivateThreads: false,
                        CreatePublicThreads: false }).then(result => {
                            zoomChannel.permissionOverwrites.edit(studentRoleID, { ViewChannel: true, 
                                SendMessages: false, CreateInstantInvite: false, CreatePrivateThreads: false,
                                CreatePublicThreads: false }).then(result => {
                                    if (videoChannel) {
                                        videoChannel.permissionOverwrites.edit(studentRoleID, { ViewChannel: true, 
                                            SendMessages: false, CreateInstantInvite: false, CreatePrivateThreads: false,
                                            CreatePublicThreads: false });
                                    }
                                });
                        });


                    database.getCoursesWithCategory(cohabitate.id).then(courses => {
                        curCoursesTitle = '';
                        curCoursesNums = '';
                        for (var i = 0; i < courses.length; i++) {
                            curCoursesTitle = curCoursesTitle + courses[i].dept + ' ' + courses[i].code + '/';
                            curCoursesNums = curCoursesNums + courses[i].code + '-';
                        }
                        // Discord has an undocmented rate limit for changing a channel name of 2 per 10 min
                        // https://github.com/discordjs/discord.js/issues/4327#issuecomment-636488615
                        // Best we can do is to give a warning that the category might not have been properly named
                        if (courses.length >= 2) {
                            warning += 'WARNING! - Discord rate limits channel name changes to 2 per 10 minutes.'
                                + ' Please verify that the category and channels are properly named.' + '\n';
                        }
                        curCoursesTitle = curCoursesTitle + dept + ' ' + course + ' - ' + semester;
                        curCoursesNums = curCoursesNums + course;
                        cohabitate.setName(curCoursesTitle).then(result => {
                            announcementsChannel.setName('announcements-' + curCoursesNums).then(result => {
                                zoomChannel.setName('zoom-meeting-info-' + curCoursesNums);
                            });
                        });

                        resolve(cohabitate.id);
                    })
                }
                else {
                    //create channels => check for video parameters first
                    if (video === true) {
                        interaction.guild.channels.create({
                            name: getCatName(dept, course, semester),
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [{
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]},

                                {id: studentRoleID,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                                deny: [PermissionsBitField.Flags.CreateInstantInvite]}]})
                        .then(category => {
                            interaction.guild.channels.create({
                                name: 'announcements-' + course,
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: profChannelPerms
                            });
                            interaction.guild.channels.create({
                                name: 'zoom-meeting-info-' + course,
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: profChannelPerms
                            }).then(channel => {
                                channel.send("**Zoom Address**:         "+ link + "\n" + "**Class Days**: " + dayOne + ', ' + dayTwo + "\n" + "**Class Time**: " + time + "\n" + 'Note: You have to use SSO for UMICH when connecting to Zoom, using your UMICH ID')
                            })
                                interaction.guild.channels.create({
                                name: 'how-to-make-a-video',
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: profChannelPerms
                            }).then(channel => {
                                    for(i in howArray) {
                                        channel.send(howArray[i])
                                    }
                                })
                            interaction.guild.channels.create({
                                name: 'introduce-yourself',
                                type: ChannelType.GuildText,
                                parent: category.id
                            });
                            interaction.guild.channels.create({
                                name: 'chat',
                                type: ChannelType.GuildText,
                                parent: category.id
                            });

                            resolve(category.id);
                        });
                    }
                    else {
                        interaction.guild.channels.create({
                            name: getCatName(dept, course, semester),
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: [{
                                id: interaction.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel]},

                                {id: studentRoleID,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                                deny: [PermissionsBitField.Flags.CreateInstantInvite]}]})
                        .then(category => {
                            interaction.guild.channels.create({
                                name: 'announcements-' + course,
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: profChannelPerms
                            });
                            interaction.guild.channels.create({
                                name: 'zoom-meeting-info-' + course,
                                type: ChannelType.GuildText,
                                parent: category.id,
                                permissionOverwrites: profChannelPerms
                            }).then(channel => {
                                channel.send("**Zoom Address**:         "+ link + "\n" + "**Class Days**: " + dayOne + ', ' + dayTwo + "\n" + "**Class Time**: " + time + "\n" + 'Note: You have to use SSO for UMICH when connecting to Zoom, using your UMICH ID')
                            })
                            interaction.guild.channels.create({
                                name: 'introduce-yourself',
                                type: ChannelType.GuildText,
                                parent: category.id
                            });
                            interaction.guild.channels.create({
                                name: 'chat',
                                type: ChannelType.GuildText,
                                parent: category.id
                            });

                            resolve(category.id);
                        });
                    }
                }
            }).then(catID => {
                //Save course to database
                const courseObj = new Course(dept, course, semester);
                database.saveCourse(courseObj).then(result => {
                    // Save link between course and category id
                    database.getCourseID(dept, course, semester).then(courseID => {
                        const catLink = new CatLink(courseID, catID);
                        database.saveCatLink(catLink);
                    });
                });
                interaction.reply({ content: warning + 'Created class ' + dept
                    + ' ' + course + ' in semester ' + semester, ephemeral: true });
            })
	}},
};

function getCatName(dept, code, semester) {
    return dept + ' ' + code + ' - ' + semester;
}

// find new position for new student or veteran role
function findPosition(name, array) {

    // no student or veteran roles exist yet
    if (array.length == 0) {
        return 0;
    }

    let number = parseInt(name);
    let largestNum = parseInt(array[0].name);
    let smallestNum = parseInt(array[array.length - 1].name);

    // add role above role with the largest dept code
    if (number > largestNum) {
        return array[0].position + 1;
    }

    // add role below role with the smallest dept code
    if (number < smallestNum) {
        return array[array.length - 1].position;
    }

    // Find pos where role would be inserted
    for (var i = 0; i < array.length; ++i) {
        let currentNumber = parseInt(array[i].name);

        if (number > currentNumber) {
            return array[i].position + 1;
        }
    }
}