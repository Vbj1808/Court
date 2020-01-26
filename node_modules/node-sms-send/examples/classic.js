// Send sms with Classic type
const SMS = require('../')

const sms = new SMS('your-username', 'your-password')

sms.send('+393401234567', 'Hello!')
  .then(body => console.log(body)) // returns { message_id: 'string' }
  .catch(err => console.log(err.message))
