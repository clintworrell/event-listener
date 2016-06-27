"use strict";

let helper = require('sendgrid').mail
let from_email = new helper.Email("test@example.com")
let to_email = new helper.Email("heladolk@yahoo.com")
let subject = "Happy Monday Morning"
let content = new helper.Content("text/plain", "Sending an email using sendgrid is very fun")
let mail = new helper.Mail(from_email, subject, to_email, content)

let sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY)
let requestBody = mail.toJSON()
let request = sg.emptyRequest()
request.method = 'POST'
request.path = '/v3/mail/send'
request.body = requestBody
sg.API(request, function (response) {
  console.log(response.statusCode)
  console.log(response.body)
  console.log(response.headers)
})
