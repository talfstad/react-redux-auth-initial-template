const sendinblue = require('sendinblue-api');

module.exports = function(options) {
  const parameters = {
    apiKey: 'mK8tzWXY0Z7cAbhV',
    timeout: 5000,
  };

  const client = new sendinblue(parameters);

  return new Promise(function(resolve, reject) {
    client.send_transactional_template(options, function(err, response) {
      if(err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};
