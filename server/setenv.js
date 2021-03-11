require('dotenv').config()

export function setEnvironment(req,res) {
    const {environment, heroku} = req.body
    console.log({environment, heroku}, heroku)
    process.env.NODE_ENV = (heroku && environment !== 'sandbox') ? 'partner' : environment;
    process.env.TEST_ENV = environment
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
    res.send(`Environment set to ${process.env.NODE_ENV}`)
}