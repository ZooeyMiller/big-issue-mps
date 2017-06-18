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
            return reply.redirect(
              '/error?error=Error%20sending%20email%20to%20MP.%20Please%20try%20again.'
            );
          });
      } else {
        userInfo.sent
          ? reply.redirect('/error?error=Sorry,%20email%20already%20sent.')
          : reply.redirect(
              '/error?error=Cannot%20find%20user%20name%20or%20email%20in%20our%20database.'
            );
      }
    });
  },
  config: {
    validate: {
      query: {
        code: Joi.string().max(40).required(),
        id: Joi.number().integer().min(1).required(),
      },
    },
  },
};
