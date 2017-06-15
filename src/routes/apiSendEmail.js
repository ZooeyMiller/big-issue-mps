const { sendMail } = require('../utils/postmark');
const Joi = require('joi');
const { getUserById, updateSent } = require('../utils/database');

module.exports = {
  method: 'GET',
  path: '/api/send-email',
  handler: (req, reply) => {
    const { code, id } = req.query;
    getUserById(id).then(userInfo => {
      if (code === userInfo.uuid && !userInfo.sent) {
        console.log(userInfo.user_input);
        sendMail(
          //TODO EMAIL THE ACTUAL MP
          { name: userInfo.mp_name, email: userInfo.email },
          { name: userInfo.name, email: userInfo.email },
          userInfo.user_input
        )
          .then(res => {
            updateSent(id).then(() => {
              reply.redirect(`/success?name=${userInfo.mp_name}`);
            });
          })
          .catch(err => {
            console.log(err);
            return reply('IT DID NOT WORK');
          });
      } else {
        userInfo.sent
          ? reply.redirect('/error?error=Sorry,%20email%20already%20sent.')
          : reply.redirect(
              '/error?error=We%20had%20trouble%20finding%20your%20email%20in%20our%20database'
            );
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
