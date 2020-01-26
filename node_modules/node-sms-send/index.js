const request = require('request-promise')

class SMS {  // Main class
  constructor(username, password) {
    if (!username) {
      throw new TypeError('Username is required')
    }
    if (typeof username !== 'string') {
      throw new TypeError('Username is required to be a string')
    }
    if (!password) {
      throw new TypeError('Password is required')
    }
    if (typeof password !== 'string') {
      throw new TypeError('Password is required to be a string')
    }
    // username and password need for basic authentification
    this.authToken = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
  }

  // send sms message
  async send(phoneNumbers, text, messageType, senderString) {
    let phoneNumbersArray = []
    if (phoneNumbers) {
      if (typeof phoneNumbers === 'string') {
        phoneNumbersArray.push(phoneNumbers)
      } else if (Array.isArray(phoneNumbers)) {
        phoneNumbersArray = phoneNumbers
      } else {
        throw new TypeError('First argument phoneNumbers could be array for multiple numbers or string for one number')
      }
    } else {
      throw new TypeError('First argument phoneNumbers is required, it could be array for multiple numbers or string for one number')
    }
    if (!text || typeof text != 'string') {
      throw new TypeError('Second argument text is required, it must be string')
    }
    
    let typeArray = ['Smart', 'SmartPro']
    let requestBody = {
          phone_numbers: phoneNumbersArray,
          text: text,
    }
    
    if (!typeArray.includes(messageType)) {
      requestBody.message_type = 'Classic'
    }
    else {
      requestBody.message_type = messageType
      requestBody.sender_string = senderString
    }
      
    try {
      const response = await request({
        method: 'POST',
        uri: 'https://api.comilio.it/rest/v1/message/',
        body: requestBody,
        headers: {
          'Authorization': this.authToken,
          'Content-Type': 'application/json; charset=utf-8'
        },
        json: true
      })
      return response
    } catch (err) {
      throw err
    }
  }

  // check message status
  async status(messageId) {
    if (!messageId) {
      throw new TypeError('Message Id is required, it should be string')
    }

    try {
      const response = await request({
        method: 'GET',
        uri: 'https://api.comilio.it/rest/v1/message/' + messageId,
        headers: {
          'Authorization': this.authToken,
          'Content-Type': 'application/json; charset=utf-8'
        },
        json: true
      })
      return response
    } catch (err) {
      throw err
    }
  }
}

module.exports = SMS
