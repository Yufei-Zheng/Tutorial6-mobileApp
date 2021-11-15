## Commands

### In the server side

```
cd api
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

Run API server using <u>port 5000</u>:

```
screen npm start
```

\# Press ctrl+a+d to return to terminal

### In the client side

```
cd client
```
Please <u>don't execute npm install</u>, all dependencies are here in files. Thanks :)

There are two places that need to be changed to your ip address ("http:// your ip address :5000/graphql"). One is in <u>App.js</u> and the other is in <u>AppSystem.js</u>.

```
source ~/.bash_profile
npx react-native run-android
```

## Github link

https://github.com/Yufei-Zheng/IT5007-Tutorial6.git

Collaborator inivitations have been sent to both TAs.  Please feel free to contact me if there are any problems. Thank you!
