# The M Machine | Glare
The prerelease app for The M Machine's Glare album.
Built with React, Redux, and Firebase.<br/>

<video src="./glare_interaction_basic.webm" width="50%" autoplay loop class="glare-thumbnail"></video>

<video src="./glare_fm_share_mechanic.webm" width="50%" autoplay loop class="glare-thumbnail"></video>

Quick Start
-----------

```shell
# Clone the Repo
$ git clone https://github.com/cannoneyed/tmm-glare
$ cd tmm-glare

# Install dependencies - Make sure you're using npm@3 and node>4
$ npm install

# Decrypt the firebase credentials using the secret key (ask Andy)
$ brew install git-crypt
$ git-crypt <path to the secret key>

# Start the app
$ npm start

```

glare.fm is built with
-----

- [React](https://facebook.github.io/react/docs/getting-started.html)
- [Redux](http://redux.js.org/index.html)
- [Firebase](https://www.firebase.com/docs/web/guide/)
- [three.js](https://threejs.org/)
- [d3.js](https://d3js.org/)

Commands
--------

|Script|Description|
|---|---|
|`npm start`|Start webpack development server @ `localhost:3000`|
|`npm run build`|Lint, test, and build the application to `./target`|
|`npm run dev`|Same as `npm start`|
|`npm run lint`|Lint `.js` files|
|`npm run server`|Start express server @ `localhost:3000` to serve built artifacts from `./target` (must run `npm run build` first)|
