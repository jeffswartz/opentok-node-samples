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