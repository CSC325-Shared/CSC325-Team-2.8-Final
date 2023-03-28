class CatLink{
    static tableName = 'Cat_links'; // For some reason, I need to declare this a static here, but redeclare it later

    constructor(courseID, catID) {
        this.courseID = courseID;
        this.catID = catID;

        this.tableName = 'Cat_links';
    }

    saveToDB(db) {
        let c = 'INSERT INTO ' + this.tableName + '(courseID, catID)'
        + ' VALUES($courseID, $catID);'
        db.run(c,
            {
                $courseID: this.courseID,
                $catID: this.catID,
            });
    }

    static getLinkCountByCatID(db, catID) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT COUNT(catID) as links from Cat_links'
            + ' WHERE catID = $catID',
            {
                $catID: catID
            }, (err, row) => {
                resolve(row.links);
            });
        });
    }
}

module.exports = CatLink;