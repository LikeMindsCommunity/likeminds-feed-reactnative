/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {initMyClient} from 'likeminds-feed-reactnative-integration';

const myClient = initMyClient('071f9d47-9905-44fc-a4ef-612cb75ce45a');

AppRegistry.registerComponent(appName, () => App);

export {myClient};
