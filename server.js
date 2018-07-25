'use-strict'

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

const blogPostRouter = require('./blogPostRouter')
const authorRouter = require('./authorRouter')

app.use(morgan('common'))
app.use('/blog-posts', blogPostRouter)
app.use('/authors', authorRouter)

mongoose.Promise = global.Promise

const {PORT, DATABASE_URL} = require('./config')

let server;

function runServer(databseUrl, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databseUrl, {useNewUrlParser: true}, err =>{
      if (err) {
        return reject(err)
      }

      server = app.listen(port, () => {
        console.log('App is LIstening on Port ' + port)
        resolve()
      })
      .on('error', err =>{
        mongoose.disconnect()
        reject(err)
      })
    })
  })    
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server')
      server.close(err =>{
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = { app, runServer, closeServer}