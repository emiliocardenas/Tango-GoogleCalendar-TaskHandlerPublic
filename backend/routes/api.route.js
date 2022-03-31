const router = require('express').Router();
const { google } = require('googleapis')


const GOOGLE_CLIENT_ID = '' // Type your own client ID
const GOOGLE_CLIENT_SECRET = '' // Type your own cliendID secret

const REFRESH_TOKEN = '' // Type your own refresh token

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' })
})

router.post('/create-tokens', async (req, res, next) => {

  try {
    const { code } = req.body
    const { tokens } = await oauth2Client.getToken(code)
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event', async (req, res, next) => {
  try {

    const { summary, description, location, startDateTime, endDateTime } = 
      req.body

    const message = {
      base: 'TANGO REMINDER: '
    }
    
    oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        summary: message.base + summary,
        description: description,
        location: location,
        colorId: '6',
        start: {
          dateTime: new Date(startDateTime),
        },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    })
    res.send(response)

  } catch (error) {
    next(error)
  }
})


// router.post('/calendar-info', async (req, res, next) => {
//   try {

//     const { summary, description, location, startDateTime, endDateTime } = 
//       req.body

//     const message = {
//       base: 'TANGO REMINDER: '
//     }
    
//     oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
//     const calendar = google.calendar('v3')
//     const response = await calendar.events.list({
//       auth: oauth2Client,
//       calendarId: 'primary',
//       timeMin: (new Date()).toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: 'startTime',
//     })
//     res.send(response)

//   } catch (error) {
//     next(error)
//   }
// })



module.exports = router
