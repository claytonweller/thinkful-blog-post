#Useful CL code

mongoimport --db blogdb --collection blogPosts --drop --file .\seed-data.json
mongoimport -h ds117848.mlab.com:17848 -d blogdb -c blogPosts -u clayton -p 1two34five! --file .\seed-data.json

mongoimport --db blogdb-test --collection authors --file .\authors-seed-data.json --drop
mongoimport -h ds117848.mlab.com:17848 -d blogdb -c authors -u clayton -p 1two34five! --file .\authors-seed-data.json

mongoimport --db blogdb-test --collection blogPosts --file .\blogposts-seed-data.json --drop
mongoimport -h ds117848.mlab.com:17848 -d blogdb -c blogPosts -u clayton -p 1two34five! --file .\blogposts-seed-data.json

---
_Update the following endpoints in your blog app API from the previous challenge:_

## GET /posts

<!-- use a pre hook with the populate() method to make the output of all blog posts look the same as it did previously:
  {
      "title": "some title",
      "content": "a bunch of amazing words",
      "author": "Sarah Clarke",
      "created": "1481322758429"
  } -->

##GET /posts/:id

<!-- add an array of comments to the output of a single blog post so it looks like this:
  {
      "title": "some title",
      "content": "a bunch of amazing words",
      "author": "Sarah Clarke",
      "created": "1481322758429",
      "comments": [
          { "content": "Here is a first comment." },
          { "content": "Here is a second comment." },
          { "content": "Here is a third comment." }
      ]
  } -->

##POST /posts

<!-- request body should now contain a JSON object like this:

  {
      "title": "some title",
      "content": "a bunch of amazing words",
      "author_id": "ObjectId(ajf9292kjf0)"
  }
in addition to validating that the request body includes title, content, and author_id, should check whether author_id exists as an _id in the authors collection and if not return a 400 status with a helpful error message.
it should return the new post (using the same key/value pairs returned by GET /posts/:id). -->

##PUT /posts/:id
<!-- should only allow you to update the title and content.
it should return a 200 status code with the updated object as follows:
  {
      "title": "some title",
      "content": "a bunch of amazing words",
      "author": "Sarah Clarke",
      "created": "1481322758429"
  } -->

--
Next, add endpoints to create, update, and delete authors:

##POST /authors

<!-- create an author
expects request body to contain a JSON object like this:

  {
      "firstName": "Sarah",
      "lastName": "Clarke",
      "userName": "sarah.clarke"
  }
validates that the request body includes firstName, lastName, and userName, and that the userName is not already taken by another author, then returns a 400 status and helpful error message in case of a problem.
it should return the new author with the following key/value pairs:
  {
      "_id": "ajf9292kjf0"
      "name": "Sarah Clarke"
      "userName": "sarah.clarke"
  } -->

##PUT /authors/:id

<!-- endpoint that allows you to update the firstName, lastName, and userName fields.
expects request body to contain a JSON object like this (note that this would only update the userName — if you wanted to update firstName or lastName, you'd have to send those over too):

  {
      "id": "ajf9292kjf0",
      "userName": "s.clarke"
  }
the id property in the request body must be there.

if the id in the URL path (/posts/:id) and the one in the request body don't match, it should return a 400 status code with a helpful error message.
if the new username is already taken by another author, it should return a 400 status code with a helpful error message.
it should return a 200 status code with the updated object as follows:
  {
      "_id": "ajf9292kjf0"
      "name": "Sarah Clarke"
      "userName": "s.clarke"
  } -->

##DELETE /authors/:id

allows you to delete an author with a given id.
deletes any blog posts by that author.
responds with a 204 status code, but no content.
Note that when you delete an author, you must also delete their blog posts, otherwise their blog posts would reference an author that no longer exists.

##Additional requirements:

Deploy to Heroku: Once these updates to your app are working, deploy it to Heroku.
