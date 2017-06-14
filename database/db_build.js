const fs = require('fs');
const path = require('path');
const connect = require('./connect');

const build = fs.readFileSync(path.join(__dirname, 'db_build.sql'), 'utf8');

connect.query(build, (err, res) => {
  if (err) throw err;
  console.log('db build successful');
  connect.end();
});
