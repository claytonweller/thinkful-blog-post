// 'use strict'

// const chai = require('chai')
// const chaiHttp = require('chai-http')

// const { BlogPost, Author} = require('../models')
// const { app, runServer, closeServer } = require('../server')
// const {TEST_DATABASE_URL} = require('../config')
// const { seedDatabase } = require('./seedDatabase')
// const { expect } = chai


// chai.use(chaiHttp)


// describe('Blog Posts', function() {

//   before(function(){
//     return runServer(TEST_DATABASE_URL)
//   })

//   beforeEach(function() {
//     return seedBlogPostData()
//   })

//   afterEach(function() {
//     // return tearDownDb()
//   })

//   after(function(){
//     return closeServer()
//   })

//   it('should list blog Posts on Get', function (){
//     return chai
//       .request(app)
//       .get('blog-posts')
//       .then(function (){
//         console.log(res.body)
//       })
//   })

//   // it('should list blog posts on GET', function(){
//   //   return chai
//   //     .request(app)
//   //     .get('/blog-posts')
//   //     .then(function(res){
//   //       expect(res).to.have.status(200)
//   //       expect(res).to.be.json
//   //       expect(res.body.blogPosts).to.be.a('array')
//   //       expect(res.body.blogPosts.length).to.be.at.least(1)
//   //       const expectedKeys = ['id', 'title', 'content', 'author']
//   //       res.body.blogPosts.forEach(function(blogPost) {
//   //         expect(blogPost).to.be.a('object')
//   //         expect(blogPost).to.include.keys(expectedKeys)
//   //       });
//   //     })
//   // })

//   // it('should create blog posts on POST', function(){
//   //   const newPost = {title:'It Happened', content:'I saw a moose for real', author:'still clayton'}
//   //   return chai
//   //     .request(app)
//   //     .post('/blog-posts')
//   //     .send(newPost)
//   //     .then(function(res){
//   //       expect(res).to.have.status(201)
//   //       expect(res).to.be.json
//   //       expect(res.body).to.be.a('object')
//   //       const expectedKeys = ['id', 'title', 'content', 'author']
//   //       expect(res.body).to.include.keys(expectedKeys)
//   //     })
//   // })

//   // it('should delete blog posts on DELETE', function(){
//   //   return chai
//   //     .request(app)
//   //     .get('/blog-posts')
//   //     .then(function(res){
//   //       const selectedPost = res.body.blogPosts[0]
//   //       return chai
//   //         .request(app)
//   //         .delete('/blog-posts/'+selectedPost.id)
//   //         .then(function(res){
//   //           expect(res).to.have.status(204)
//   //         })
//   //     })
//   // })

//   // it('should update blog posts on PUT', function(){
//   //   let updatedPost = {title: 'Moose', content: 'I really did see a moose', author:'Clayton'}
//   //   return chai
//   //     .request(app)
//   //     .get('/blog-posts')
//   //     .then(function(res){
//   //       updatedPost.id = res.body.blogPosts[0].id
//   //       return chai
//   //         .request(app)
//   //         .put('/blog-posts/'+updatedPost.id)
//   //         .send(updatedPost)
//   //         .then(function(res){
//   //           expect(res).to.have.status(200)
//   //           expect(res).to.be.json
//   //           expect(res.body).to.be.a('object')
//   //           const expectedKeys = ['title', 'author', 'content', 'id']
//   //         })
//   //     })
//   // })

// })