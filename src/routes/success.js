const fs = require('fs');
const Joi = require('joi');
module.exports = {
  method: 'GET',
  path: '/success',
  handler: (req, reply) => {
    fs.readFile(
      `${__dirname}/../../public/success.html`,
      'utf8',
      (err, res) => {
        if (err) return console.log(err); //TODO deal with error properly
        const templatedHtml = res.replace('<!--REPLACE ME-->', req.query.name);
        reply(templatedHtml);
      }
    );
  },
  config: {
    validate: {
      query: {
        name: Joi.string().min(3).max(64).required(),
      },
    },
  },
};
