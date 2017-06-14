const getCandidates = require('./../utils/getCandidates');
const Joi = require('joi');
const uuid = require('uuid/v1');
const { insertUserInfoRow } = require('../utils/database');

module.exports = {
  method: 'GET',
  path: '/api',
  handler: (req, reply) => {
    getCandidates(req.query.postcode)
      .then(candidate => {
        insertUserInfoRow({
          mpName: candidate.name,
          mpEmail: candidate.email,
          name: req.query.name,
          email: req.query.email,
          uuid: uuid(),
        })
          .then(() => reply(candidate))
          .catch(err => {
            throw err;
          });
      })
      .catch(reply);
  },
  config: {
    validate: {
      query: {
        postcode: Joi.string().max(12),
        email: Joi.string().email(),
        name: Joi.string().max(64),
      },
    },
  },
};
