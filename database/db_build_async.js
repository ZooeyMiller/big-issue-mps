const fs = require('fs');
const path = require('path');
const connect = require('./connect');

const build = fs.readFileSync(path.join(__dirname, 'db_build.sql'), 'utf8');

module.exports = () => {
  return new Promise((resolve, reject) => {
    connect.query(build, (err, res) => {
      if (err) return reject();
      resolve();
    });
  });
};
