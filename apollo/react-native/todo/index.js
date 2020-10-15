import { AppRegistry } from "react-native";
import App from "./src/App";
import { name } from "./app.json";

console.log("register");

/**
 * Initialise the javascript application.
 */
AppRegistry.registerComponent(name, () => App);
