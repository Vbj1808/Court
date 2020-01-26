// Check status of sended message
const SMS = require('../')

const sms = new SMS('your-username', 'your-password')

sms.status('your-sent-sms-message_id')
  .then(body => console.log(body)) // returns [ { phone_number: '+393401234567', status: 'Sent' } ]
  .catch(err => console.log(err.message))
