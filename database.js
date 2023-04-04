const { ThreadChannel } = require("discord.js");
const fs = require("node:fs");
const sqlite3 = require('sqlite3').verbose();

const Course = require('./obj/course');
const Color = require('./obj/color');
const Button = require('./obj/button');
const CatLink = require('./obj/catlink');
const LogChannel = require('./obj/logchannel');

const schemaPath = 'data/schema.txt';
const dbPath = 'data/data.db';
const dbEditTable = 'edits';
const comment = '--';

class Database {
    constructor (client) {    
        this.db = new sqlite3.Database(dbPath);
        this.client = client;
    }

    setup() {
      // Setup edits table, if it hasn't been done already
      initDB(this.db, dbEditTable).then(cat => {
          let editsCount = 0;
          // Get number of edits that have been run
          let alsoDB = this.db; // Assign a local variable to db, as 'this' refers to something else in callback method
          this.db.get('select count(editID) as editCount from edits', 
          {}, (err, row) => {
              editsCount = row.editCount;

              // Run database commands from schema file
              fs.readFile(schemaPath, function(err, f){
                  var lines = f.toString().split(/\r?\n/); // '/n' doesn't work, but this does

                  // Remove comments
                  lines = lines.filter(function(item) {
                      return item.toString().substring(0, 2) !== comment;
                  });
                  var sqlCommands = lines.join('').split('^');
      
                  // Remove whitespace
                  for (let i = 0; i < sqlCommands.length; i++) {
                      sqlCommands[i] = sqlCommands[i].trim();
                  } 

                  // Run schema edits that have not been run previously
                  runDBEdits(alsoDB, sqlCommands, editsCount);
              });
          });
      });
  }

  saveCourse(course) {
      return course.saveToDB(this.db);
  }

  getAllCourses() {
      return Course.getAllCourses(this.db);
  }

  deleteCourse (dept, code, semester) {
      return Course.deleteCourse(this.db, dept, code, semester);
  }

  deleteCourseByCatIDandCourseCode(catID, code) {
    return Course.deleteCourseByCatIDandCourseCode(this.db, catID, code);
  }

  courseExists(dept, code, semester) {
      return Course.courseExists(this.db, dept, code, semester);
  }

  getCourseID(dept, code, semester) {
    return Course.getCourseID(this.db, dept, code, semester);
  }

  getCoursesWithCategory(catID) {
    return Course.getCoursesWithCategory(this.db, catID);
  }

  getCourseByNum(courseNum) {
    return Course.getCourseByNum(this.db, courseNum);
  }

  getAvailableColor() {
      return Color.getAvailableColor(this.db);
  }

  setColorUsed(hex) {
      return Color.setColorUsed(this.db, hex);
  }

  saveButton (button) {
      button.saveToDB(this.db);
  }

  deleteAllButtons() {
      return Button.deleteAll(this.db);
  }

  deleteButtonsStartingWith(btnMsgName) {
      return Button.deleteButtonsStartingWith(this.db, btnMsgName);
  }

  getRoleIDByButtonID(btnID) {
      return Button.getRoleIDByButtonID(this.db, btnID)
  }

  saveCategory(category) {
    return category.saveToDB(this.db);
  }

  saveCatLink(catlink) {
    return catlink.saveToDB(this.db);
  }

  getLinkCountByCatID(catID) {
    return CatLink.getLinkCountByCatID(this.db, catID);
  }

  saveLogChannelID(channelID) {
    return LogChannel.saveToDB(this.db, channelID);
  }

  getLogChannelID() {
    return LogChannel.getLogChannelID(this.db);
  }

  writeToLogChannel(msg) {
    this.getLogChannelID().then(id => {
        if (id != 'no channel') {
            const logChannel = this.client.channels.cache.get(id);
            logChannel.send(msg);
        }
    })
    
  }
}
module.exports = Database;


// Private methods, because js doesn't seem to have actual private functions for classes

function initDB(db, editTable) {
    return new Promise((resolve, reject) => {
        // Check if any tables exist
        db.get('SELECT count(name) as count FROM sqlite_master WHERE type=$type', 
        {
            $type: 'table'
        }, 
        (err, row) => {
            createDB(db, editTable, row).then(() => {
                resolve();
            });
        });
    });
}

function createDB(db, editTable, row) {
    return new Promise((resolve, reject) => {
        // Empty database
        if (row.count === 0) {
            // Create edits table
            db.run('CREATE TABLE ' + editTable + ' (' // Can't seem to use parameters when creating a table
                + ' editID INTEGER PRIMARY KEY,'
                + ' editMessage TEXT,'
                + ' editDate TEXT NOT NULL'
                + ' );', {}, (err, row) => {
                    db.run('INSERT INTO ' + editTable + '(editMessage, editDate)'
                        + ' VALUES(\'Create DB edits table\', datetime(\'now\', \'localtime\'))',
                    {}, (err, row) => {
                        resolve();
                    });
            });    
        }
        else {
            resolve();
        }
    });
}

async function runDBEdits(db, sqlCommands, editsCount) {        
    for (let i = editsCount - 1; i < sqlCommands.length; i++) {
        
        await runEdit(db, sqlCommands[i]);             
    }
}

function runEdit(db, edit) {
    return new Promise((resolve, reject)=>{
        db.run(edit, {}, (err, row) => {
            // Log the edit
            db.run('INSERT INTO ' + dbEditTable + '(editMessage, editDate)'
            + ' VALUES($message,'
            + ' datetime(\'now\', \'localtime\'));',
            {
                $message: edit
            }, (err, row) => {
                resolve();
            });
        });
    });
}