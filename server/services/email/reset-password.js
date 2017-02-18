const { RESET_EMAIL_TEMPLATE } = require('./template-types');
const emailTo = require('./email');

module.exports = function({ resetToken, email }) {
  const RESET_EMAIL_PASSWORD_LINK = `http://localhost:8080/reset-password/${resetToken}`;

  const options = {
    id: 1,
    to: email,
    attr: {
      RESET_EMAIL_PASSWORD_LINK,
    }
  };

  return emailTo(options);
};
