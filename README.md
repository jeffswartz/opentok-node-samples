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
Then run:

```sh
npm start
```

The app runs on [localhost:5000](http://localhost:8080/).

## Heroku

<a href="https://heroku.com/deploy?template=https://github.com/jeffswartz/opentok-node-samples/tree/screensharing" target="_blank">
  <img src="https://www.herokucdn.com/deploy/button.png" alt="Deploy">
</a>