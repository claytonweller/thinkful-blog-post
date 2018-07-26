const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
  firstName:String,
  lastName: String,
  userName: {type:String, required:true}
})

authorSchema.methods.serialize = function () {
  return {
    _id : this._id,
    name: nameSorter(this),
    userName: this.userName
  }
}

const nameSorter = function (name){
  if(name.firstName && name.lastName){
    return `${name.firstName} ${name.lastName}`
  } else if (name.firstName){
    return name.firstName
  } else {
    return name.userName
  }
}

const commentSchema = mongoose.Schema({content:String})

const blogPostSchema = mongoose.Schema({
  title:{type: String, required:true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  content:{type:String, required:true},
  comments:[commentSchema]
})

blogPostSchema.pre('findOne', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('find', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.pre('findById', function(next) {
  this.populate('author');
  next();
});

blogPostSchema.virtual('fullName').get(function() {
  return nameSorter(this.author)
})

blogPostSchema.methods.serialize = function (complex) {
  let output = {
    id:this._id,
    title: this.title,
    author: this.fullName,
    content: this.content
  }
  if (complex){
    output.comments = this.comments
  }
  return output
}

const Author = mongoose.model('Author', authorSchema, 'authors')
const BlogPost = mongoose.model('BlogPost', blogPostSchema, 'blogPosts')

module.exports = { BlogPost, Author };