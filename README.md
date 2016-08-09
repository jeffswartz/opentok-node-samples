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

The app runs on [localhost:5000](http://localhost:5000/).

## Testing the broadcast layout class sample

1. Open one (and only one) browser client on
   [localhost:5000/main](http://localhost:5000/main).

2. Open a few other browser clients on
  [localhost:5000](http://localhost:5000).

3. In the "main" client, open the console and copy the broadcast URL into
   the Clipboard. Wait 20 seconds, then open the URL in Safari

4. In the "main" client, click a radio button in the top of the page to change
   the layout class.

Before starting the app, you can configure the layout to be used by setting
the `LAYOUT_TYPE` property in the index.js file.