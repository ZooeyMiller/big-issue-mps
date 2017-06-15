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
    const insertionQuery = `INSERT INTO emails (uuid, name, email, mp_name, mp_email, sent, verification_sent) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID`;
    const insertionValues = [uuid, name, email, mpName, mpEmail, false, false];
    query(insertionQuery, insertionValues)
      .then(res => resolve(res.rows[0].id))
      .catch(reject);
  });
};

const getUserById = id => {
  return new Promise((resolve, reject) => {
    const getQuery = `SELECT uuid, name, email, mp_name, mp_email, sent, user_input, verification_sent FROM emails WHERE id = $1`;
    const getValue = [id];
    query(getQuery, getValue).then(res => resolve(res.rows[0])).catch(reject);
  });
};

const updateUserMessage = (id, userMessage) => {
  return new Promise((resolve, reject) => {
    const insertionQuery = `UPDATE emails SET user_input = $1, verification_sent = $2 WHERE id = $3 RETURNING ID`;
    const insertionValue = [userMessage, true, id];
    query(insertionQuery, insertionValue)
      .then(res => resolve(res.rows[0].id))
      .catch(reject);
  });
};

const updateSent = id => {
  return new Promise((resolve, reject) => {
    const insertionQuery = `UPDATE emails SET sent = $1 WHERE id = $2`;
    const insertionValue = [true, id];
    query(insertionQuery, insertionValue).then(resolve).catch(reject);
  });
};

module.exports = {
  insertUserInfoRow,
  getUserById,
  updateUserMessage,
  updateSent,
};
