const tape = require('tape');
const { query } = require('../src/utils/database');

require('../database/db_build');

tape('Query correctly promisifies PG queries', t => {
  t.plan(2);

  const testQuery = `
    INSERT INTO
      emails (uuid, name, email, mp_name, mp_email, sent, verification_sent)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ID`;
  const values = ['1', '2', '3', '4', '5', false, false];

  query(testQuery, values)
    .then(res => {
      t.equal(res.rows[0].id, 1, 'The insert query returns an id of 1');
    })
    .catch();

  query('BAD QUERY', values).then().catch(err => {
    t.ok(true, 'Bad query correctly ends up in catch');
  });
});
