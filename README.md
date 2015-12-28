# opentok-node-samples
Some fully functioning OpenTok samples using Node and Express

## Set up

Make sure you have Node.js installed.

```sh
git clone git@github.com:jeffswartz/opentok-node-samples.git # or clone your own fork
cd opentok-node-samples
npm install
```

Then set the following environment variables to your
[OpenTok API key and secret](https://dashboard.tokbox.com/)
(or add them to your .bash_profile file):

```sh
export API_KEY=12345
export API_SECRET=12345
```
Then build the file:

```sh
npm run build
```

Then run:

```sh
npm start
```

The app runs on [localhost:5000](http://localhost:5000/).

Currently, the log-in user name and password are hardcoded in the index.js file:

```javascript
if (user.name === 'instructor' && user.pass === 'password') {
  instructor = true;
  return next();
} else if (user.name === 'student' && user.pass === 'password') {
  instructor = false;
  return next();
} else {
  return unauthorized(res);
};
```

## Automatic deployment to Heroku

Heroku is a PaaS (Platform as a Service) that can be used to deploy simple and small applications
for free. To easily deploy this repository to Heroku, sign up for a Heroku account and click this
button:

<a href="https://heroku.com/deploy?template=https://github.com/opentok/learning-opentok-php" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.png" alt="Deploy">
</a>

Heroku will prompt you to add your OpenTok API key and OpenTok API secret, which you can
obtain at the [TokBox Dashboard](https://dashboard.tokbox.com/keys).

