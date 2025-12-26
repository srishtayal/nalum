module.exports = {
  generateRandomUser: function(context, events, done) {
    const randomNum = Math.floor(Math.random() * 1000000);
    context.vars.randomEmail = `user${randomNum}@loadtest.com`;
    context.vars.randomPassword = `pass${randomNum}`;
    context.vars.randomName = `User ${randomNum}`;
    return done();
  },

  logResponse: function(requestParams, response, context, ee, next) {
    if (response.statusCode >= 400) {
      console.log(`Error: ${response.statusCode} - ${response.body}`);
    }
    return next();
  }
};
