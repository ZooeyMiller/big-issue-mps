const getCandidates = require('./../utils/getCandidates');
const Joi = require('joi');
const uuid = require('uuid/v1');
const { insertUserInfoRow } = require('../utils/database');
const recaptcha = require('../utils/recaptcha');

module.exports = {
  method: 'POST',
  path: '/api/get-candidate',
  handler: (req, reply) => {
    recaptcha
      .validate(req.payload.recaptcha)
      .then(res =>
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
          .catch(reply)
      )
      .catch(err => {
        reply({ error: 'recaptcha failed' });
      });
  },
  config: {
    validate: {
      payload: {
        postcode: Joi.string().max(12).required(),
        email: Joi.string().email().required(),
        name: Joi.string().max(64).required(),
        recaptcha: Joi.string().required(),
      },
    },
  },
};
