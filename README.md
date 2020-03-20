# MAD-Chittr (React Native)
This is an assignment about developing a front end mobile application that can interface with a microblogging API using [React Native](https://facebook.github.io/react-native/).

## Setup
Before starting to run the app, you will need to have:
- An android emulator ([Android studio](https://developer.android.com/studio))
- A few Command Prompt windows
- Follow the steps below

### Start up your Android Emulator
For the android emulator, I will suggest using Pixel 3 API28 with PlayStore to access most of the features.

### Installing packages
Open Command Prompt and change the directory to the MyApp directory.This project has several libraries installed, assuming your computer has [node.js](https://nodejs.org/en/) installed, the dependencies will be installed in the local node_modules folder by running `npm install` in the Command Prompt.

### Linking modules
Some modules might require linking to let the library works, they are `react-native-camera`, `react-native-gesture-handler` and `react-native-vector-icons`. Please link them by entering `npx react-native link module_name`.

### Start up the server
1. Open another Command Prompt, change the directory to the server code.
2. Run `npm install` to set up the dependencies in the server.
3. Run `npm start` to start the server. If the server is running you will see the output like:
```
Listening on port: 3333
```
**Side Note:** Remember to change the configuration in config.js located in the config folder.

### Test the server
1. Open yet another Command Prompt and also change the directory to the server code.
2. Run `npm test` to run the tests using [Jest](https://jestjs.io/).
3. There will be 3 errors shown at the result which is fine.
4. Close the Command Prompt and now the database is filled with some dummy data. :smiley:

### Run the app
1. Open the Command Prompt you used to install the dependencies for your app and run `npx react-native run-android` and wait for it to install in emulator and run the app.
2. If everything runs smoothly without any major errors then Voilà! You will be welcomed with the home screen.

**Side Note:** After linking the modules, you will see errors shown below, but usually it doesn't cause any problem.
```
error React Native CLI uses autolinking for native dependencies, but the following modules are linked manually:
  - react-native-camera (to unlink run: "react-native unlink react-native-camera")
  - react-native-gesture-handler (to unlink run: "react-native unlink react-native-gesture-handler")
  - react-native-vector-icons (to unlink run: "react-native unlink react-native-vector-icons")
```
