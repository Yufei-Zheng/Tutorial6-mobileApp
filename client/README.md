## Commands

### In the server side

```
cd api
```

Install dependencies:

```
npm install
npm install graphql@^14.2.1 || ^15.0.0
```

Run mongod:

```
screen mongod
```

\# Press ctrl+a+d to return to terminal

Initiate mongodb:

```
mongo issuetracker scripts/init.mongo.js
```

Run API server using port 5000:

```
screen npm start
```

\# Press ctrl+a+d to return to terminal

### In the client side

```
cd client
npm install
npm audit fix
npx react-native run-android
```

