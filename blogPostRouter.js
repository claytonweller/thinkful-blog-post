const express = require('express')
const router = express.Router()
// const mongoose = require('mongoose')

const bodyParser = require('body-parser')
// const jsonParser = bodyParser.json()


const { BlogPost } = require('./models')
router.use(express.json())

router.get('/', (req, res) => {
  BlogPost.find()
    .limit(20)
    .then(blogPosts => {
      console.log(blogPosts[0])
      res.status(200).json({
        blogPosts: blogPosts.map(blogPost => blogPost.serialize())
      })
    })
    .catch(err =>{
      console.log(err)
      res.status(500).json({message: 'Something went wrong on the Server'})
    })
})

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(blogPost => res.json(blogPost.serialize()))
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Something went wrong on the Server'})
    })
})

router.post('/', (req, res) => {
  const requiredFields = ['title', 'content', 'author']
  requiredFields.forEach(requirement => {
    if(!(requirement in req.body)){
      let message = `Oops you're missing the ${requirement}`
      console.error(message)
      return res.status(400).send(message)
    }
  })
  const splitNameArray = req.body.author.split(' ')
  if(!(splitNameArray[1])){
    splitNameArray[1]=''
  }
  console.log(splitNameArray)
  BlogPost.create({
    title: req.body.title,
    author: {
      firstName: splitNameArray[0],
      lastName:splitNameArray[1]
    },
    content:req.body.content
  })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err =>{
      console.error(err)
      res.status(500).json({message: 'Something went wrong on the Server'})
    })
})

router.put('/:id', (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id']
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)){
    const message = `Your params and body id have to match`
    console.log(message)
    return res.status(400).json({message: message})
  }
  requiredFields.forEach(requirement => {
    if(!(requirement in req.body)){
      const message = `Oops you're missing the ${requirement}`
      console.log(message)
      return res.status(400).send(message)
    }
  })

  const toUpdate = {};
  const updatableFields = ['author', 'title', 'content']
  
  // let updatedPost = BlogPost.update(req.body)
  // res.status(200).json(updatedPost)

  updatableFields.forEach(field => {
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })

  BlogPost
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(blogPost => res.status(200).json(blogPost))
    .catch(err => res.status(500).json({ message: 'Something went wrong on the server'}))
})

router.delete('/:id', (req, res) => {
  console.log(`Deleted blog post ${req.params.id}`)
  BlogPost.findByIdAndRemove(req.params.id)
    .then(blogPost => res.sendStatus(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong on the server'}))
})

module.exports = router