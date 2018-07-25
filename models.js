const mongoose = require('mongoose')

const blogPostSchema = mongoose.Schema({
  title:{type: String, required:true},
  author: {
    firstName:{type:String, required:true},
    lastName:String
  },
  content:{type:String, required:true},
  // publishDate: Date
})

blogPostSchema.virtual('fullName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`
})

blogPostSchema.methods.serialize = function () {
  return {
    id:this._id,
    title: this.title,
    author: this.fullName,
    content: this.content
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema, 'blogPosts')

module.exports = { BlogPost };