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
    const insertionQuery = `INSERT INTO emails (uuid, name, email, mp_name, mp_email, sent) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID`;
    const insertionValues = [uuid, name, email, mpName, mpEmail, false];
    query(insertionQuery, insertionValues)
      .then(res => resolve(res.rows[0].id))
      .catch(reject);
  });
};

const getUserById = id => {
  return new Promise((resolve, reject) => {
    const getQuery = `SELECT uuid, name, email, mp_name, mp_email, sent, user_input FROM emails WHERE id = $1`;
    const getValue = [id];
    query(getQuery, getValue).then(res => resolve(res.rows[0])).catch(reject);
  });
};

const updateUserMessage = (id, userMessage) => {
  return new Promise((resolve, reject) => {
    const insertionQuery = `UPDATE emails SET user_input = $1 WHERE id = $2 RETURNING ID`;
    const insertionValue = [userMessage, id];
    query(insertionQuery, insertionValue)
      .then(res => resolve(res.rows[0].id))
      .catch(reject);
  });
};

module.exports = { insertUserInfoRow, getUserById, updateUserMessage };
