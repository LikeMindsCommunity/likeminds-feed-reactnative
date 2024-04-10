/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.tsx';
import {name as appName} from './app.json';
import {initMyClient} from '@likeminds.community/feed-rn-core';

const myClient = initMyClient('');

AppRegistry.registerComponent(appName, () => App);

export {myClient};
