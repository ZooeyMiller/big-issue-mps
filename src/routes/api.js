const getCandidates = require('./../utils/getCandidates');

module.exports = {
  method: 'GET',
  path: '/api',
  handler: (req, reply) => {
    getCandidates(req.query.postcode).then(reply);
  },
};
