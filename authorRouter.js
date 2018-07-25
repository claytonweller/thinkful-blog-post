const express = require('express')
const router = express.Router()

const { Author, BlogPost } = require('./models')
router.use(express.json())

router.get('/', (req, res) => {
  Author.find()
    .limit(20)
    .then(authors => {
      res.status(200).json(authors)
    })
    .catch(err =>{
      console.error(err)
      res.status(500).json({message:'something went wrong on the server'})
    })
})

router.get('/:id', (req, res) => {
  //Nothing yet
})

router.post('/', (req, res) => {
  //I created logic in the models page to deal with the case where they don't
  //enter any values for first or last name. So I only require the userName
  if(!req.body.userName){
    res.status(400).json({message: 'You must include a userName'})
  }
  Author.findOne({userName: req.body.userName})
    .then(author => {
      if(author){
        res.status(400).json({message: req.body.userName + ' is already a user name'})
        return
      } 
      return Author.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        userName:req.body.userName
      })      
    })
    .then(author => res.status(201).json(author.serialize()))
    .catch(err =>{
      console.error(err)
      res.status(500).json({message: 'something went awry on the server'})
    })
})

router.put('/:id', (req, res) => {
  if(!(req.body.id && req.params.id && req.body.id === req.params.id)){
    res.status(400).json({message: 'Params Id needs to match body ID, and both must be present'})
  }

  const toUpdate = {}
  const updatableFields = ['firstName', 'lastName', 'userName']

  updatableFields.forEach(field => {
    if(field in req.body){
      toUpdate[field] = req.body[field]
    }
  })

  Author.findOne({userName: req.body.userName})
    .then(author => {
      if(author){
        res.status(400).json({message: req.body.userName + ' is already a username'})
        return
      }
      return Author.findByIdAndUpdate(req.params.id, {$set: toUpdate})
    })
    .then(() => Author.findOne({_id:req.body.id}))      
    .then(author => res.status(200).json(author.serialize()))
    .catch(err => res.status(500).json({message: 'Something went awry on the server'}))
})

router.delete('/:id', (req, res) => {
  if(!(req.body.id && req.params.id && req.body.id === req.params.id)){
    res.status(400).json({message: 'Params Id needs to match body ID, and both must be present'})
  }
  BlogPost.deleteMany({author: req.params.id})
    .then(() => {
      console.log('Deleted all blog posts associated with ' + req.params.id)
      res.status(204).end()
    })
    .catch(err => res.status(500).json({message: 'Something went awry on the server'}))
 
  Author.findByIdAndRemove(req.params.id)
  .then(() => {
    console.log('Deleted author ' + req.params.id)
    res.status(204).end()
  })
  .catch(err => res.status(500).json({message: 'Something went awry on the server'}))

})

module.exports = router