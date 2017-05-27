const fs = require('fs');

module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    console.log(fs.readFileSync('./public/index.html'));
    reply.file('./public/index.html');
  },
};
