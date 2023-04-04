class LogChannel{
    static tableName = 'Log_channel'; // For some reason, I need to declare this a static here, but redeclare it later

    constructor(channelID) {
        this.channelID = channelID;

        this.tableName = 'Log_channel';
    }

    static saveToDB(db, channelID) {
        // Remove existing log channel
        db.run('DELETE FROM ' + this.tableName,
        {}, (err) => {
            let c = 'INSERT INTO ' + this.tableName + '(channelID)'
            + ' VALUES($channelID);'
            db.run(c,
                {
                    $channelID: channelID,
                });
        });
    }

    static getLogChannelID(db) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT channelID from Log_channel',
            {}, (err, row) => {
                if (row) {
                    resolve(row.channelID);
                }
                else {
                    resolve('no channel');
                }
            });
        });
    }
}

module.exports = LogChannel;