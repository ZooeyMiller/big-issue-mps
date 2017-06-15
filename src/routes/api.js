const getCandidates = require('./../utils/getCandidates');
const Joi = require('joi');
const uuid = require('uuid/v1');
const { insertUserInfoRow } = require('../utils/database');

module.exports = {
  method: 'POST',
  path: '/api/get-candidate',
  handler: (req, reply) => {
    getCandidates(req.payload.postcode)
      .then(mp => {
        insertUserInfoRow({
          mpName: mp.name,
          mpEmail: mp.email,
          name: req.payload.name,
          email: req.payload.email,
          uuid: uuid(),
        })
          .then(id => {
            const mpObject = Object.assign({}, mp);
            mpObject.email = mpObject.email ? true : false;
            reply({ mp: mpObject, id });
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
