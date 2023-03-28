class Color {
    static tableName = 'Colors'; // For some reason, I need to declare this a static here, but redeclare it later

    constructor() {
        this.tableName = 'Colors';
    }

    static getAvailableColor(db) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM ' + this.tableName
            + ' WHERE available = $available'
            + ' ORDER BY random()',
            {
                $available: 1,
            }, (err, row) => {
                if (row === undefined) {
                    resolve("No available color");
                }
                else {
                    resolve(row.hex);
                }
            });
        });
    }

    static setColorUsed(db, color) {
        return new Promise((resolve, reject)=>{
            db.run('UPDATE ' + this.tableName
            + ' SET available = 0'
            + ' WHERE hex = $hex',
            {
                $hex: color
            });
        });
    }
}

module.exports = Color;