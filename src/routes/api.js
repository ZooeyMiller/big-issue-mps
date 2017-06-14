const getCandidates = require('./../utils/getCandidates');
const Joi = require('joi');
const uuid = require('uuid/v1');
const { insertUserInfoRow } = require('../utils/database');

module.exports = {
  method: 'POST',
  path: '/api/get-candidate',
  handler: (req, reply) => {
    console.log(req.payload.postcode);
    getCandidates(req.payload.postcode)
      .then(candidate => {
        console.log('candidate is', candidate);
        insertUserInfoRow({
          mpName: candidate.name,
          mpEmail: candidate.email,
          name: req.payload.name,
          email: req.payload.email,
          uuid: uuid(),
        })
          .then(() => {
            console.log('.then is happening, saved to db');
            reply(candidate);
          })
          .catch(err => {
            console.log('insert into db failed ---', err);
            throw err;
          });
      })
      .catch(err => {
        console.log(err);
        reply;
      });
  },
  config: {
    validate: {
      payload: {
        postcode: Joi.string().max(12),
        email: Joi.string().email(),
        name: Joi.string().max(64),
      },
    },
  },
};
