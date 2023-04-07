# CSC325 Team 2 and 8 Development
 Development repo for Team 2 and 8

 Code started from: https://github.com/AndrewJager/CSC325-Team-8-Snapshot-3

## Setup
To run this bot, you must create a config.json file (in the same directory as index.js) with the following structure:

```
{
    "token" : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "clientId" : "1111111111111111111111",
    "guildId" :"222222222222222222222"
}
```

Replace the values with your token, clientId(ID of the bot), and guildId(ID of the server)

You also must have Discord.js and Node.js installed. 
Tutorial here: https://discordjs.guide/preparations/#installing-node-js

You'll need to install the sqlite library with the following command: `npm install sqlite3` and the color package: `npm install color`

## Commands
**Current commands:**

`/help` - Shows a list of current commands and a description of each.

`/setup` - Creates the channels the bot will use. This is currently in progress, and the channels are not used by the bot yet.

`/welcome` - Creates a message to welcome new members to the server and specify the rules of the server.

`/course-select` - Generates a message with the chosen roles. Users can click the buttons on the message to get roles assigned to them.

`/optional-select` - Same as above, but for optional roles.

`/newrole` - Creates a new role, allowing you to specify a color for it. Used for misc roles outside of the class roles.

`/newclass` - Creates a class, taking the department, course number, and semester as parameters. When this command is ran, a new group of channels is created in the server, with the parameters from the `/newclass` command used to name the channels. This command also allows you to select a category to cohabitate with, which will use an existing category for the class, instead of creating new channesl.

`/classes` - Lists all current classes

`/delete-channels` - Allows you to select a category, and delete it along will all of its child channels
**Note:** This command is not required for the specifications, as class categories will not be archived rather than deleted This command was created to make testing easier, and may be removed from the final bot.

`/archive` - Takes a category and class number as parameters. All users with the student role receive the veteran role, and have the student role removed. The access the student role to the category is removed. The category has "(Archived)" appended to its name. When archiving cohabitated courses, each course must be individually archived. The category will not be renamed to "(Archived)" until all courses using that category have been archived.

`/poll` - Creates a poll after you enter a title, and at least two options.

`/roll` - Rolls a given number of dice with a certain number of sides, can optionally add or subtract a modifier from the total.

## Starter Code
The starter code for this bot was from [Chase C's tutorial bot](https://github.com/Meapers0/Tutorial-bot), following [this guide](https://discordjs.guide/).
## Poll Command
Code for Poll Command is sourced by [Golden Development](https://sites.google.com/view/golden-development/home), following [this guide](https://www.youtube.com/watch?v=qeO25uNZwOQ).

## Previous Snapshots
Snapshot #1 - https://github.com/AndrewJager/CSC325-Team-8-Snapshot-1
Snapshot #2 - https://github.com/AndrewJager/CSC325-Team-8-Snapshot-2 
