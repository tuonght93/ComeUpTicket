import React from 'react';
import {Scene, Stack, Router} from 'react-native-router-flux';

import Login from './screens/Login';
import TeamList from './screens/TeamList';
import EventList from './screens/EventList';
import EventDetail from './screens/EventDetail';
import EventScanTicket from './screens/EventScanTicket';

function getInitialState() {
  const _initState = {
    //login: new loginInitialState,
  };
  return _initState;
}

export default class Root extends React.Component {
    render() {
        return (
            <Router>
                <Stack key="root">
                    <Scene key="Login" initial={true} component={Login} title="Login" hideNavBar={true}/>
                    <Scene key="TeamList" component={TeamList} title="TeamList" hideNavBar={true}/>
                    <Scene key="EventList" component={EventList} title="EventList" hideNavBar={true}/>
                    <Scene key="EventDetail" component={EventDetail} title="EventDetail" hideNavBar={true}/>
                    <Scene key="EventScanTicket" component={EventScanTicket} title="EventScanTicket" hideNavBar={true}/>
                </Stack>
            </Router>
        );
    }
}
