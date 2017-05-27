module.exports = {
  method: 'GET',
  path: '/',
  handler: (req, reply) => {
    reply.file('./public/index.html');
  },
};
