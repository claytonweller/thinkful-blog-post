const mongoose = require('mongoose')
const faker = require('faker')

const { BlogPost, Author } = require('../models')

// seedDatabase()

function seedDatabase() {
  return new Promise((resolve, reject) =>{
    seedAuthorData()
    .then(authors => {
      let authorIdArray = authors.map(author => author._id)
      return seedBlogPostData(authorIdArray)
    })
    .then(blogPosts => resolve(blogPosts))
    .catch(err => reject(err))
  })
}

// AUTHOR SEED

function seedAuthorData() {
  return new Promise((resolve, reject) => {
    const seedData = []
    for( let i=1; i <= 4; i++){
      seedData.push(generateAuthorData())
    }
    Author.insertMany(seedData)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

function generateAuthorData() {
  return {
    firstName: faker.name.lastName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
  }
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting test database')
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  })
}

//BLOG POST SEED

function seedBlogPostData(authorIdArray) {
  return new Promise ((resolve, reject) => {
    const seedData = []
    for (let i=1; i<=10; i++) {
      seedData.push(generateBlogPostData(authorIdArray))
    }
    BlogPost.insertMany(seedData)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
  
}

function generateBlogPostData (authorIdArray) {
  return {
    title:generatePostTitle(),
    content:generateContent(),
    comments:gernerateComments(),
    author:returnRandomIndex(authorIdArray),
  }
}

function returnRandomIndex (array) {
  return array[Math.floor(Math.random()* array.length)]
}

function generatePostTitle() {
  const titles = [
    'Wow check this out',
    '10 tricks to ...',
    'How long will it take?'
  ]
  return returnRandomIndex(titles)
}

function generateContent() {
  const contents = [
    'BLAH BLAH BLAH BLAH',
    'This is the main part of the post. Wow It looks real goooood.',
    'No one is ever going to read this but me...'
  ]
  return returnRandomIndex(contents)
}

function gernerateComments() {
  const comments = [
    'This is great',
    'Terrible',
    'Please buy my product'
  ]
  let numberOfComments = Math.floor(Math.random() * 3)
  let commentArray = []
  for(let i=0; i < numberOfComments; i++){
    let comment = { content:returnRandomIndex(comments) }
    commentArray.push(comment)
  }
  return commentArray
}

module.exports = {seedDatabase, tearDownDb, generateAuthorData, generateBlogPostData}