const express = require('express')
const router = express.Router()

const { BlogPost, Author } = require('./models')
router.use(express.json())

router.get('/', (req, res) => {
  BlogPost.find()
    .limit(20)
    .then(blogPosts => {
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
    .then(blogPost => {
      // let output = blogPost.serialize(true)
      // output.comments = blogPost.comments
      res.status(200).json(blogPost.serialize('comments'))
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Something went wrong on the Server'})
    })
})

router.post('/', (req, res) => {
  const requiredFields = ['title', 'content', 'author_id']
  requiredFields.forEach(requirement => {
    if(!(requirement in req.body)){
      let message = `Oops you're missing the ${requirement}`
      console.error(message)
      return res.status(400).send(message)
    }
  })
  Author.findById(req.body.author_id)
    .then(author => {
      BlogPost.create({
        title: req.body.title,
        author: author._id,
        content:req.body.content
      })
        .then(blogPost => res.status(201).json(blogPost.serialize('comments')))
        .catch(err =>{
          console.error(err)
          res.status(500).json({message: 'Something went wrong on the Server'})
        })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({message: 'This author doesn\'t exist yet'})
    })
})

router.put('/:id', (req, res) => {
  const requiredFields = ['title', 'content', 'id']
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
  const updatableFields = ['title', 'content']

  updatableFields.forEach(field => {
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })

  BlogPost
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(blogPost => res.status(200).json(blogPost.serialize('comments')))
    .catch(err => res.status(500).json({ message: 'Something went wrong on the server'}))
})

router.delete('/:id', (req, res) => {
  console.log(`Deleted blog post ${req.params.id}`)
  BlogPost.findByIdAndRemove(req.params.id)
    .then(blogPost => res.sendStatus(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong on the server'}))
})

module.exports = router