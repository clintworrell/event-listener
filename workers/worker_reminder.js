'use strict';
let knex = require('./db/knex'),
    helper = require('sendgrid').mail,
    sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);

let now = new Date();
let nowPlus24hrs = new Date(now.getTime() + (24 * 60 * 60 * 1000));

knex('events').select()
.where('start_time', '>=', now).andWhere('start_time', '<=', nowPlus24hrs).returning('*')
.then( (events) => {
  let usersPromises = [];
  events.forEach( (event) => {
    let eventId = event.id;
    let userQuery = knex.select().from('users')
                .innerJoin('users_events', 'users_events.user_id', 'users.id')
                .innerJoin('events', 'events.id', 'users_events.event_id')
                .where('events.id', '=', eventId).andWhere('users_events.reminder', '=', false);
    usersPromises.push(userQuery);
  });
  return Promise.all(usersPromises);
})
.then( (eventUserList) => {
  let emailPromises = [];
  eventUserList.forEach( (events) => {
    events.forEach ( (userEvent) => {
      // console.log(userEvent);
      let sendEmailPromise = sendReminderEmail(userEvent);
      emailPromises.push(sendEmailPromise);
    });
  })
  return Promise.all(emailPromises);
})
.then( () => {
  process.exit(0);
});

function sendReminderEmail(userEvent) {
  let from_email = new helper.Email("event-listener@example.com")
  let to_email = new helper.Email(userEvent.email);
  let subject = `Reminder: ${userEvent.name}`.slice(0,77);
  let content = new helper.Content("text/html",
        `<html>
          <head>
            <style>
              body {
                text-align: center;
              }
              h1 {
                color: red;
              }
            </style>
          </head>
          <body>
            <h1><em>${userEvent.name}</em></h2>
            <h2>Organizer: ${userEvent.organizer_name}</h4>
            <hr>
            <h4>Start: ${userEvent.start_time}</h4>
            <h4>Venue: ${userEvent.venue}</h4>
            <a href="${userEvent.url}">${userEvent.url}</a>
          </body>
          </html>`
  );

  let mail = new helper.Mail(from_email, subject, to_email, content)

  let request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = mail;

  return sendEmailPromisify(request)
  .then( (response) => {
    // console.log(response);
    if(response.statusCode === 202) {
      console.log("reminder was sent successfully");
      knex('users_events').where('user_id', '=', userEvent.user_id).andWhere('event_id', '=', userEvent.event_id)
      .update({reminder: true}).returning('*')
      .then( (updatedUserEvents) => {
        console.log(`Successfuly updated reminder field`);
        console.log(updatedUserEvents);
      });
    } else {
      console.log("Failed to send reminder")
    }
  });

}


function sendEmailPromisify(emailRequest) {
  return new Promise((resolve, reject) => {
    sg.API(emailRequest, (response) => {
        resolve(response);
    });
  });
};
