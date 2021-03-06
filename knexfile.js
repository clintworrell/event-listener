// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'event_listener'
    },
    debug: true
  },

  test: {
    client: 'postgresql',
    connection: {
      database: 'test_event_listener'
    },
    debug: false,
    pool: {
      min:1,
      max:1
    }
},

  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    debug: false,
    pool: {
      min:1,
      max:7
    }
  }

};
