// I am not naming this "Class", even if that's valid
class Course {
    static tableName = 'Courses'; // For some reason, I need to declare this a static here, but redeclare it later

    constructor(dept, code, semester) {
        this.dept = dept;
        this.code = code;
        this.semester = semester;
        this.tableName = 'Courses';
    }

    saveToDB(db) {
        return new Promise((resolve, reject)=>{
            let c = 'INSERT INTO ' + this.tableName + '(dept, code, semester)'
            + ' VALUES($dept, $code, $semester);'
            db.run(c,
                {
                    $dept: this.dept,
                    $code: this.code,
                    $semester: this.semester
                },
                (err) => {
                    resolve();
                });
        });
    }

    static getAllCourses(db) {
        return new Promise((resolve, reject)=>{
            var courses = [];
            db.all('SELECT dept, code, semester FROM ' + this.tableName, 
            {}, 
            (err, rows) => {
                rows.forEach((row) => {
                    courses.push(new Course(row.dept, row.code, row.semester));
                });
                resolve(courses);
            });
        });
    }

    static deleteCourse(db, dept, code, semester) {
        // Get course ID
        this.getCourseID(db, dept, code, semester).then(id => {
            // Delete category links first
            db.run('DELETE FROM Cat_links'
            + ' WHERE courseID = $id',
            {
                $id: id
            }, (err) => {
                db.run('DELETE FROM ' + this.tableName
                + ' WHERE dept = $dept'
                + ' AND code = $code'
                + ' AND semester = $semester',
                {
                    $dept: dept,
                    $code: code,
                    $semester: semester
                });
            });
        })
    }

    static deleteCourseByID(db, id) {
        return new Promise((resolve, reject)=>{
            // Delete category links first
            db.run('DELETE FROM Cat_links'
            + ' WHERE courseID = $id',
            {
                $id: id
            }, (err) => {
                db.run('DELETE FROM ' + this.tableName
                + ' WHERE course_id = $id',
                {
                    $id: id
                }, (err) => {
                    resolve();
                });
            });
        });
    }

    static deleteCourseByCatIDandCourseCode(db, catID, code) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT c.course_id from Courses c'
                + ' LEFT JOIN Cat_links cl on cl.courseID = c.course_id'
                + ' WHERE cl.catID = $catID'
                + ' AND c.code = $code',
            {
                $catID: catID,
                $code: code
            }, (err, row) => {
                const id = row.course_id;
                this.deleteCourseByID(db, id).then(result => {
                    resolve();
                });
            });
        });
    }

    static courseExists(db, dept, code, semester) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM ' + this.tableName
            + ' WHERE dept = $dept'
            + ' AND code = $code'
            + ' AND semester = $semester',
            {
                $dept: dept,
                $code: code,
                $semester: semester
            }, (err, row) => {
                if (row === undefined) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }

    static getCourseID(db, dept, code, semester) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM ' + this.tableName
            + ' WHERE dept = $dept'
            + ' AND code = $code'
            + ' AND semester = $semester',
            {
                $dept: dept,
                $code: code,
                $semester: semester
            }, (err, row) => {
                if (row === undefined) {
                    resolve(-1);
                }
                else {
                    resolve(row.course_id);
                }
            });
        });
    }

    static getCoursesWithCategory(db, catID) {
        return new Promise((resolve, reject)=>{
            var courses = [];
            db.all('SELECT c.dept, c.code, c.semester FROM Cat_links cl'
            + ' LEFT JOIN Courses c on c.course_ID = cl.courseID'
            + ' WHERE cl.catID = $catID',
            {
                $catID: catID
            }, 
            (err, rows) => {
                if (rows) {
                    rows.forEach((row) => {
                        courses.push(new Course(row.dept, row.code, row.semester));
                    });
                }
                resolve(courses);
            });
        });
    }

    static getCourseByNum(db, courseNum) {
        return new Promise((resolve, reject)=>{
            db.get('SELECT * FROM ' + this.tableName
            + ' WHERE code = $code',
            {
                $code: courseNum
            }, (err, row) => {
                if (row === undefined) {
                    resolve('No course!');
                }
                else {
                    resolve(new Course(row.dept, row.code, row.semester));
                }
            });
        });
    }
}

module.exports = Course;