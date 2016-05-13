# The M Machine | Glare
Built with React, Redux, and Firebase.

Quick Start
-----------

```shell
$ git clone https://github.com/cannoneyed/tmm-glare
$ cd tmm-glare
$ npm install
$ npm start
```

Learn
-----

- [React](https://facebook.github.io/react/docs/getting-started.html)
- [Redux](http://redux.js.org/index.html)
- [Firebase](https://www.firebase.com/docs/web/guide/)

Commands
--------

|Script|Description|
|---|---|
|`npm start`|Start webpack development server @ `localhost:3000`|
|`npm run build`|Lint, test, and build the application to `./target`|
|`npm run dev`|Same as `npm start`|
|`npm run lint`|Lint `.js` files|
|`npm run server`|Start express server @ `localhost:3000` to serve built artifacts from `./target` (must run `npm run build` first)|
|`npm test`|Run unit tests with Karma and Jasmine|
|`npm run test:watch`|Run unit tests with Karma and Jasmine; watch for changes to re-run tests|
