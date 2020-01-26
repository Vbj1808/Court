// Send sms with Smart or SmartPro type
const SMS = require('../')

const sms = new SMS('your-username', 'your-password')

sms.send('+393401234567', 'Hello!', 'Smart', 'Sender')
  .then(body => console.log(body)) // returns { message_id: 'string' }
  .catch(err => console.log(err.message))
