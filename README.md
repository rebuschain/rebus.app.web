# Rebus Web App

Frontend React app for Rebus.

This project was started from [osmosis](https://github.com/osmosis-labs/osmosis-frontend) and [insync](https://github.com/OmniFlix/insync-juno).

## Install global dependencies

To run or build the app, first, need to install `Node.js` and `Yarn` globally;

First Install Node (recommend 14.x.x LTS version) from;

https://nodejs.org/

Then install Yarn;

```bash
npm install -g yarn
# OR
sudo npm install -g yarn
```

## Install project dependencies

First clone the repo;

```bash
git clone https://github.com/osmosis-labs/osmosis-frontend.git && cd osmosis-frontend
```

Then install project dependencies;

```bash
yarn
```

## Build

To build the static assets;

```bash
yarn build:css && yarn build
```

This should produce `prod` folder with static assets.

Currently, Rebus frontend app is SPA with entry point: `prod/index.html`

## Development

To spin up the local dev server;

```bash
yarn build:css && yarn dev
```

The app should be live at http://localhost:8081

## License

This work is dual-licensed under Apache 2.0 and MIT.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: Apache-2.0 OR MIT`
