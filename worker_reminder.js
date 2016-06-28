'use strict'
let knex = require('./db/knex'),
    helper = require('sendgrid').mail,
    sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);

// worker connects to postgres and searches events that starts within 24hrs from events table
// then worker get list of users who saved the events
let now = new Date();
// let now = new Date('2018-06-28 14:00:00-07');
let nowPlus24hrs = new Date(now.getTime() + (24 * 60 * 60 * 1000));
console.log(now);
console.log(nowPlus24hrs);

knex('events').select().where('start_time', '>=', now).andWhere('start_time', '<=', nowPlus24hrs).returning('*')
.then( (events) => {
  console.log(events);

  let usersPromises = [];
  events.forEach( (event) => {
    let eventId = event.id;
    let userQuery = knex.select().from('users')
                .innerJoin('users_events', 'users_events.user_id', 'users.id')
                .innerJoin('events', 'events.id', 'users_events.event_id')
                .where('events.id', '=', eventId);
    usersPromises.push(userQuery);
  });
  return Promise.all(usersPromises);
})
.then( (eventLists) => {
  eventLists.forEach( (events) => {
    events.forEach ( (userEvent) => {
      sendReminderEmail(userEvent);
    });
  });
});

function sendReminderEmail(userEvent) {
  let user_email = userEvent.email;
  console.log(user_email);
  // compose reminder email
  let from_email = new helper.Email("event-listener@example.com")
  let to_email = new helper.Email(user_email);
  let subject = `Event reminder: ${userEvent.name}`;
  let content = new helper.Content("text/plain", `${userEvent.name} will happen ${userEvent.start_time} at ${userEvent.venue}`);
  let mail = new helper.Mail(from_email, subject, to_email, content)

  // send email
  let requestBody = mail.toJSON()
  let request = sg.emptyRequest()
  request.method = 'POST'
  request.path = '/v3/mail/send'
  request.body = requestBody
  sg.API(request, function (response) {
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  });

}



// worker send reminders to users who saved the events
