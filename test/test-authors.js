'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')

const { BlogPost, Author} = require('../models')
const { app, runServer, closeServer } = require('../server')
const { TEST_DATABASE_URL } = require('../config')
const { seedDatabase, tearDownDb, generateAuthorData } = require('./seedDatabase')
const { expect } = chai

chai.use(chaiHttp)

describe('Authors', function() {

  before(function(){
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(function() {
    console.log('seeding database')
    return seedDatabase()
  })

  afterEach(function() {
    return tearDownDb()
  })

  after(function(){
    return closeServer()
  })

//Begin GET tests
  describe('GET endpoint', function(){
    it('should list all blog posts', function (){
      let res
      return chai.request(app)
        .get('/authors')
        .then(function (_res){
          res = _res
          expect(res).to.have.status(200)
          return Author.countDocuments()
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count)
        })
    })
    
    it('should return authors with right fields', function(){
      let resAuthor
      return chai.request(app)
        .get('/authors')
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('array')
          expect(res.body.length).to.be.at.least(1)
          const expectedKeys = ['firstName', 'lastName', 'userName', '_id']
          res.body.forEach(function(author){
            expect(author).to.be.a('object')
            expect(author).to.include.keys(expectedKeys)
          })
          
          resAuthor= res.body[0]
          return Author.findById(resAuthor._id)
        })
        .then(function(author){
          expect(resAuthor._id).to.equal(String(author._id))
          expect(resAuthor.firstName).to.equal(author.firstName)
          expect(resAuthor.lastName).to.equal(author.lastName)
          expect(resAuthor.userName).to.equal(author.userName)
        })
    })
  
  })

  //End GET tests

//Begin Post tests
  describe('POST endpoint', function(){
    it('should add a new Author', function(){
      const newAuthor = generateAuthorData()
      return chai.request(app)
        .post('/authors')
        .send(newAuthor)
        .then(function(res) {
          expect(res).to.have.status(201)
          expect(res).to.be.json
          expect(res.body).to.a('object')
          expect(res.body).to.include.keys('_id', 'name', 'userName')
          expect(res.body._id).to.not.be.null
          expect(res.body.name).to.equal(`${newAuthor.firstName} ${newAuthor.lastName}`)
          expect(res.body.userName).to.equal(newAuthor.userName)
          return Author.findById(res.body._id)
        })
        .then(function(author){
          expect(author.firstName).to.equal(newAuthor.firstName)
          expect(author.lastName).to.equal(newAuthor.lastName)
          expect(author.userName).to.equal(newAuthor.userName)
        })
    })
  })

  //end POST tests

//Begin PUT tests
  describe('PUT endpoint', function(){
    it('should update fiels you send over', function() {
      const updateData= {
        firstName: 'UPDATED!',
        lastName:'sa;lfdkja;lkne;klfn;asdlkv;asljrlwna;flkkds;vouas;dlkjf'
      }
      return Author
        .findOne()
        .then(function(author){
          updateData['id'] = author._id
          return chai.request(app)
            .put(`/authors/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('object')
          const expectedKeys = ['_id', 'name', 'userName']
          expect(res.body).to.include.keys(expectedKeys) 
          expect(res.body.name).to.equal(`${updateData.firstName} ${updateData.lastName}`)
        })
    })
  })
  //end PUT

//Begin DELETE tests
  describe('DELETE endpoint', function(){
    it('should delete the author', function(){
      let author
      return Author
        .findOne()
        .then(function(_author){
          author = _author
          return chai.request(app).delete(`/authors/${author._id}`).send({id:author._id})
        })
        .then(function(res){
          expect(res).to.have.status(204)
          return Author.findById(author._id)
        })
        .then(function(_author){
          expect(_author).to.be.null
        })
    })

    it('should delete all blog posts made by that author', function(){
      let blogPost;
      return BlogPost
        .findOne()
        .then(function(_blogPost){
          blogPost = _blogPost
          let id = blogPost.author._id
          return chai.request(app).delete(`/authors/${id}`).send({id:id})
        })
        .then(function(res){
          expect(res).to.have.status(204)
          return BlogPost.findById(blogPost._id)
        })
        .then(function(res) {
          expect(res).to.be.null
        })
    
    })  

  })
})