# Comilio Node JS SMS Send

Node JS client module to send SMS messages using Comilio SMS Gateway.

To use this library, you must have a valid account on https://www.comilio.it.

**Please note** SMS messages sent with this library will be deducted by your Comilio account credits.

For any questions, please contact us at tech@comilio.it

# Installation

```bash
$ npm install node-sms-send --save
```

# Send a message with Classic type

```js
const SMS = require('node-sms-send')

const sms = new SMS('username', 'password')

sms.send('+393401234567', 'Hello!')
  .then(body => console.log(body)) // returns { message_id: 'string' }
  .catch(err => console.log(err.message))
```

# Check status of message

```js
const SMS = require('node-sms-send')

const sms = new SMS('username', 'password')

sms.status('A95455F7031140769030CCA81E764C5F')
  .then(body => console.log(body)) // returns [ { phone_number: '+393401234567', status: 'Sent' } ]
  .catch(err => console.log(err.message))
```

# More info

You can check out our website https://www.comilio.it
