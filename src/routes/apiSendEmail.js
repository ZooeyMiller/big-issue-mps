const { sendMail } = require('../utils/postmark');
const Joi = require('joi');
const { getUserById } = require('../utils/database');

module.exports = {
  method: 'GET',
  path: '/api/send-email',
  handler: (req, reply) => {
    const { code, id } = req.query;
    console.log('test');

    getUserById(id).then(userInfo => {
      if (code === userInfo.uuid && !userInfo.sent) {
        console.log(userInfo.userInput);
        sendMail(
          //TODO EMAIL THE ACTUAL MP
          { name: userInfo.mp_name, email: userInfo.email },
          { name: userInfo.name, email: userInfo.email },
          userInfo.user_input
        )
          .then(res => {
            reply.redirect(`/success?name=${userInfo.mp_name}`);
          })
          .catch(err => {
            console.log(err);
            return reply('IT DID NOT WORK');
          });
      } else {
        userInfo.sent
          ? reply('IT DID NOT WORK GETTING THE USER')
          : reply('IT DID NOT WORK SENDING AGAIN');
      }
    });
  },
  config: {
    validate: {
      query: {
        code: Joi.string().max(40),
        id: Joi.number().integer(),
      },
    },
  },
};
