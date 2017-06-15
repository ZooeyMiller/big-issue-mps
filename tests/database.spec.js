const tape = require('tape');
const {
  query,
  insertUserInfoRow,
  updateUserMessage,
  updateSent,
} = require('../src/utils/database');
const connect = require('./../database/connect');

const resetDb = require('../database/db_build_async');

tape('Query correctly promisifies PG queries', t => {
  t.plan(2);
  resetDb().then(() => {
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
});

tape('insertUserInfoRow adds a user to the database', t => {
  t.plan(4);
  resetDb().then(() => {
    const values = {
      uuid: '123',
      name: 'finn',
      email: 'finn@finn.com',
      mpName: 'bob',
      mpEmail: 'bob@bob.com',
    };
    insertUserInfoRow(values)
      .then(res => {
        t.equal(res, 1, 'The insert query returns an id of 1');
      })
      .then(() => {
        values.uuid = '1234';
        insertUserInfoRow(values).then(res => {
          t.equal(res, 2, 'The second insert query returns an id of 2');
        });
      })
      .then(() => {
        query(
          'SELECT uuid, name, email, mp_name, mp_email FROM emails WHERE id = 2'
        ).then(res => {
          const { uuid, name, email, mp_name, mp_email } = res.rows[0];
          result = { uuid, name, email, mpName: mp_name, mpEmail: mp_email };

          t.deepEqual(result, values, 'Added the correct information');
        });
      })
      .then(() => {
        insertUserInfoRow({ name: 'hi' }).catch(() => {
          t.pass('Errors with bad arguments');
        });
      });
  });
});

tape('updateUserMessage updates the user info message by row id', t => {
  t.plan(4);
  const update = 'test update 1';
  query('SELECT user_input FROM emails WHERE id = 1').then(res => {
    const input = res.rows[0].user_input;
    t.equal(input, null, 'Initial input is null');
  });

  updateUserMessage(1, 'test update 1')
    .then(res =>
      query(
        'SELECT user_input, verification_sent FROM emails WHERE id = 1'
      ).then(res => {
        const input = res.rows[0].user_input;
        const verify = res.rows[0].verification_sent;
        t.equal(input, 'test update 1', 'Correctly set the user_input');
        t.equal(verify, true, 'Label verification email as true');
      })
    )
    .then(res => updateUserMessage(1, 'test update 2'))
    .then(res =>
      query('SELECT user_input FROM emails WHERE id = 1').then(res => {
        const input = res.rows[0].user_input;
        t.equal(input, 'test update 2', 'Correctly overwrites the user_input');
      })
    );
});

tape('updateSent changes to sent', t => {
  t.plan(2);
  query('SELECT sent FROM emails WHERE id = 1')
    .then(res => {
      const sent = res.rows[0].sent;
      t.equal(sent, false, 'Initial sent value should be false');
      return 1;
    })
    .then(updateSent)
    .then(res => query('SELECT sent FROM emails WHERE id = 1'))
    .then(res => {
      const sent = res.rows[0].sent;
      t.equal(sent, true, 'After set sent value should be true');
    })
    .then(res => {
      connect.end();
    });
});
