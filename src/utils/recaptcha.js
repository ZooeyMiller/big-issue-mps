reCAPTCHA = require('recaptcha2');

recaptcha = new reCAPTCHA({
  siteKey: '6LeYliUUAAAAAOKBgZSSwtnC_7TlFQV2IP_3y-PZ',
  secretKey: process.env.RECAPCHA_SECRET,
});

module.exports = recaptcha;
