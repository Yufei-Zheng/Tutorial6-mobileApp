/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.issues.remove({});

/*const issuesDB = [
  { id:'Alice12345678', name: 'Alice', contact: '12345678', time:'2021-10-27' }, { id:'Bob87654321',name: 'Bob', contact: '87654321', time:'2021-10-27' }, { id:'Cindy56781234', name: 'Cindy', contact: '56781234', time:'2021-10-27'}
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');*/

db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ name: 1 });
db.issues.createIndex({ contact: 1 });
db.issues.createIndex({ time: 1 });