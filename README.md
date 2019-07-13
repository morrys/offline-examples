# Offline Examples

A collection of example applications using [react-relay-offline](https://github.com/morrys/react-relay-offline).

and 

A collection of example applications using [@wora/apollo-offline](https://github.com/morrys/wora/tree/master/packages/apollo-offline).


### Relay

## React


```
cd relay/todo-updater
yarn
yarn build
yarn start
```

## React Native

* change local ip address


```
cd relay/react-native/todo-updater/src/relay
modify file: index.ts

const localIP = "SETLOCALIP"

with your local ip
```

* start server relay

```
cd relay/react-native/todo-updater/server
npm install
npm run start
```

* Starts the server that communicates with connected devices

```
cd relay/react-native/todo-updater
npm install
npm run start
```

* Run android

```
cd relay/react-native/todo-updater
npm run run-android
```

### Apollo

## React

```
cd apollo/todo/client
npm install
npm run start
```

```
cd apollo/todo/server
npm install
npm run start
```

## React Native

todo