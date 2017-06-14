const dbConnection = require('../../database/connect.js');

const query = (query, valuesArray) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, valuesArray, (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

const insertUserInfoRow = ({ uuid, name, email, mpName, mpEmail }) => {
  return new Promise((resolve, reject) => {
    const insertionQuery = `INSERT INTO emails (uuid, name, email, mp_name, mp_email, sent) VALUES ($1, $2, $3, $4, $5, $6)`;
    const insertionValues = [uuid, name, email, mpName, mpEmail, false];
    query(insertionQuery, insertionValues).then(resolve).catch(reject);
  });
};

module.exports = { insertUserInfoRow };
