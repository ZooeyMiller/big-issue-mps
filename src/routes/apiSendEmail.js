const postmark = require('../utils/postmark');
const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/api',
  handler: (req, reply) => {
    const { emails, fromEmail, userInput } = req.payload;
    postmark(emails, fromEmail, userInput)
      .then(res => {
        reply({ res });
      })
      .catch(err => {
        console.log(err);
        return reply(err);
      });
  },
  config: {
    validate: {
      payload: {
        emails: Joi.array().items(
          Joi.object().keys({
            email: Joi.string().email(),
            name: Joi.string().min(1),
          })
        ),
        fromEmail: Joi.object().keys({
          email: Joi.string().email(),
          name: Joi.string().min(1),
        }),
        userInput: Joi.any(),
      },
    },
  },
};
