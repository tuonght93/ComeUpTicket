/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry, YellowBox} from 'react-native';
import Root from './src/Root';
import {name as appName} from './app.json';
YellowBox.ignoreWarnings(['Remote debugger']);
AppRegistry.registerComponent(appName, () => Root);
