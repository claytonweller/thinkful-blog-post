<!-- You should add runServer and closeServer functions to your app as demonstrated in the "Test setup" section of previous assignment, and you'll want to use the if (require.main === module) ... approach outlined there. Be sure to export app, runServer, and closeServer from server.js. -->

On the flip side, you'll need to import app, runServer and closeServer into your test file. You'll need to use runServer and closeServer to start and stop your server in the before and after blocks for your tests.

Modify your package.json file so the test command will cause mocha to run your tests.

Remember that each test needs to either return a promise or else call a done callback at the end of the test. We prefer the first option, and that's what you'll find in our sample solution.

You're not required to serve an index.html file for this app, but know that if you do not, you'll get an error if you try to open the Heroku app URL (for instance, mygreatapp.heroku.com).