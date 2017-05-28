const getCandidates = require('./../utils/getCandidates');
const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/api',
  handler: (req, reply) => {
    getCandidates(req.query.postcode).then(reply).catch(reply);
  },
  config: {
    validate: {
      query: {
        postcode: Joi.string().max(12),
      },
    },
  },
};
