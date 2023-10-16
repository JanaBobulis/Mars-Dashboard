require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const router = express.Router()
const port = 3005

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/rover/:name', async (req, res) => {
    console.log(req, res)
    let { name } = req.params
    try {
        let roverData = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name.toLowerCase()}/latest_photos?api_key=Cl35W9WR8IQcclfc4rcMbclDGPzTjN1AXJXWWZn1`)
        .then(res => res.json())
        res.send(roverData)
    } catch (err) {
        console.log('error', err);
    }
})

app.listen(process.env.PORT || port, () => console.log(`Mars Dashboard app listening on port ${port}!`))
