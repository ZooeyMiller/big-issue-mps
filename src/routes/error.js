const fs = require('fs');
const Joi = require('joi');
module.exports = {
  method: 'GET',
  path: '/error',
  handler: (req, reply) => {
    fs.readFile(`${__dirname}/../../public/error.html`, 'utf8', (err, res) => {
      if (err) return reply('Server error'); //TODO handle error better
      const templatedHtml = res.replace('<!--REPLACE ME-->', req.query.error);
      reply(templatedHtml);
    });
  },
  config: {
    validate: {
      query: {
        error: Joi.string().required(),
      },
    },
  },
};
