# React Relay Offline Example

A collection of example applications using [React Relay Offline](https://github.com/morrys/react-relay-offline).

* react-relay-version version 0.3.0


## React

```
cd todo
yarn
yarn build
yarn start
```


```
cd todo-updater
yarn
yarn build
yarn start
```

## React Native

modify src/relay/index.ts

`const localIP = "SETLOCALIP"`

with local ip

* start server relay

```
cd react-native/todo-updater/server
npm install
npm run start

* Starts the server that communicates with connected devices

```
cd react-native/todo-updater
npm install
npm run start
```

* Run android

```
cd react-native/todo-updater
npm run run-android
```

## TODO

* improve the IP configuration