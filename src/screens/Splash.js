import React from 'react';
import {
    View,
    ActivityIndicator,
    AsyncStorage
} from "react-native";
import { Actions } from 'react-native-router-flux';
import HTTP from '../services/HTTP';
class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.init()
    }

    async init() {
        const auValue = await AsyncStorage.getItem('auValue')
        if (auValue) {
            return HTTP.callApiWithHeader('users/profile', 'GET', null).then(response => {
                if (response && response.data.status == 200) {
                    Actions.TeamList({type: 'reset', profile: response.data.data})
                } else if(response && response.data.status == 401) {
                    Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.TOP)
                    Actions.Login({type: 'reset'})
                } else {
                    Actions.Login({type: 'reset'})
                    Toast.showWithGravity(JSON.stringify(response), Toast.SHORT, Toast.TOP)
                }
            }).catch(function (error) {
                Actions.Login({type: 'reset'})
            });
        } else {
            Actions.Login({type: 'reset'})
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#03a9f4', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" style={{marginBottom: 50}} />
            </View>
        );
    }
}

export default Splash;