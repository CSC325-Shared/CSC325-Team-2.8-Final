class Button {
    static tableName = 'Buttons'; // For some reason, I need to declare this a static here, but redeclare it later

    constructor(btnID, roleID) {
        this.btnID = btnID;
        this.roleID = roleID;

        this.tableName = 'Buttons';
    }

    saveToDB(db) {
        let c = 'INSERT INTO ' + this.tableName + '(buttonID, roleID)'
        + ' VALUES($btn, $role);'
        db.run(c,
            {
                $btn: this.btnID,
                $role: this.roleID,
            });
    }

    static deleteAll(db) {
        return new Promise((resolve, reject)=>{
            let c = 'DELETE FROM ' + this.tableName;
            db.run(c, {}, (err, rows) => {resolve();});  
        });   
    }

    static deleteButtonsStartingWith(db, btnMsgName) {
        return new Promise((resolve, reject)=>{
            let c = 'DELETE FROM ' + this.tableName
                + ' WHERE buttonID LIKE $btnName';
            db.run(c, 
                {$btnName: btnMsgName + '%'}, 
                (err, rows) => {resolve();});  
        });   
    }

    static getRoleIDByButtonID(db, btnID) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT roleID FROM ' + this.tableName
            + ' WHERE buttonID = $btn',
            {
                $btn: btnID
            }, (err, row) => {
                if (row === undefined) {
                    resolve("No id found!");
                }
                else {
                    resolve(row.roleID);
                }
            });
        });
    }
}

module.exports = Button;