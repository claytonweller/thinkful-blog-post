'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')

const { BlogPost, Author} = require('../models')
const { app, runServer, closeServer } = require('../server')
const {TEST_DATABASE_URL} = require('../config')
const { seedDatabase, tearDownDb, generateBlogPostData } = require('./seedDatabase')
const { expect } = chai


chai.use(chaiHttp)


describe('Blog Posts', function() {

  before(function(){
    return runServer(TEST_DATABASE_URL)
  })

  beforeEach(function() {
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
    it('should list all Blog Posts', function (){
      let res
      return chai.request(app)
        .get('/blog-posts')
        .then(function (_res){
          res = _res
          expect(res).to.have.status(200)
          return BlogPost.countDocuments()
        })
        .then(function(count) {
          expect(res.body.blogPosts).to.have.lengthOf(count)
        })
    })
    
    it('should return Blog Posts with right fields', function(){
      let resBlogpost
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body.blogPosts).to.be.a('array')
          expect(res.body.blogPosts.length).to.be.at.least(1)
          const expectedKeys = ['title', 'author', 'content', 'id']
          res.body.blogPosts.forEach(function(blogPost){
            expect(blogPost).to.be.a('object')
            expect(blogPost).to.include.keys(expectedKeys)
          })
          
          resBlogpost= res.body.blogPosts[0]
          return BlogPost.findById(resBlogpost.id)
        })
        .then(function(blogPost){
          expect(resBlogpost.id).to.equal(String(blogPost._id))
          expect(resBlogpost.title).to.equal(blogPost.title)
          expect(resBlogpost.content).to.equal(blogPost.content)
          expect(resBlogpost.author).to.equal(`${blogPost.author.firstName} ${blogPost.author.lastName}`)
        })
    })
  
  })

  //End GET tests

//Begin POST tests
  describe('POST endpoint', function(){
    it('should add a new Blog Post', function(){
      let newBlogPost
      return Author
        .find()
        .then(function(authors) {
          let authorIdArray = authors.map(function(author){return String(author._id)})
          newBlogPost = generateBlogPostData(authorIdArray)
          delete newBlogPost.comments
          return chai.request(app)
            .post('/blog-posts')
            .send(newBlogPost)
        })
        .then(function(res) {
          expect(res).to.have.status(201)
          expect(res).to.be.json
          expect(res.body).to.a('object')
          expect(res.body).to.include.keys('id', 'title', 'content', 'comments', 'author')
          expect(res.body.id).to.not.be.null
          expect(res.body.title).to.equal(newBlogPost.title)
          expect(res.body.content).to.equal(newBlogPost.content)
          expect(res.body.author).to.equal(newBlogPost.author)
          return BlogPost.findById(res.body.id)
        })
        .then(function(blogPost){
          expect(blogPost.title).to.equal(newBlogPost.title)
          expect(blogPost.content).to.equal(newBlogPost.content)
        })
    })
  })

  //end POST tests

//Begin PUT tests
  describe('PUT endpoint', function(){
    it('should update fiels you send over', function() {
      const updateData= {
        title: 'UPDATED!',
        content:'sa;lfdkja;lkne;klfn;asdlkv;asljrlwna;flkkds;vouas;dlkjf'
      }
      return BlogPost
        .findOne()
        .then(function(blogPost){
          updateData['id'] = blogPost._id
          return chai.request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('object')
          const expectedKeys = ['id', 'author', 'title', 'comments', 'content']
          expect(res.body).to.include.keys(expectedKeys) 
          expect(res.body.title).to.equal(updateData.title)
          expect(res.body.content).to.equal(updateData.content)
        })
    })
  })
  //end PUT

//Begin DELETE tests
  describe('DELETE endpoint', function(){
    it('should delete the Blog Post', function(){
      let blogPost
      return BlogPost
        .findOne()
        .then(function(_blogPost){
          blogPost = _blogPost
          return chai.request(app).delete(`/blog-posts/${blogPost._id}`).send({id:blogPost._id})
        })
        .then(function(res){
          expect(res).to.have.status(204)
          return BlogPost.findById(blogPost._id)
        })
        .then(function(_blogPost){
          expect(_blogPost).to.be.null
        })
    }) 

  })
})