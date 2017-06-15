const { sendVerificationMail } = require('../utils/postmark');
const { getUserById } = require('../utils/database');
const Joi = require('joi');

module.exports = {
  method: 'POST',
  path: '/api/send-mail',
  handler: (req, reply) => {
    const { id, name, email, mpName, userInput } = req.payload;

    //TODO ADD USERINPUT TO DB BEFORE SENDING VERIFICATION
    getUserById(id).then(res => {
      //TODO MAKE THE IF STATEMENT BELOW A NICER MODULAR FUNCTION
      if (
        name === res.name &&
        email === res.email &&
        mpName === res['mp_name'] &&
        !res.verification_sent
      ) {
        sendVerificationMail(email, res.uuid, id)
          .then(res => {
            reply({ res });
          })
          .catch(err => {
            return reply(err);
          });
      } else {
        reply({
          err: !res.verification_sent
            ? `ERROR: VERIFICATION ALREADY SENT TO ${res.email}`
            : 'ERROR: USER INFO DID NOT MATCH',
        });
      }
    });
  },
  config: {
    validate: {
      payload: {
        id: Joi.number().integer(),
        email: Joi.string().email(),
        name: Joi.string().min(1),
        mpName: Joi.string().min(1),
        userInput: Joi.any(),
      },
    },
  },
};
