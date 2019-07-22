import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text
} from "react-native";
import { Actions } from 'react-native-router-flux';
import NavigationBar from 'react-native-navbar';
class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    render() {
        var { profile } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar
                    style={styles.NavigationBar}
                    leftButton={<TouchableOpacity onPress={() => Actions.pop()} style={styles.leftButton}><Image source={require('../images/ic_back.png')} style={styles.ic_back} /></TouchableOpacity>}
					title={{
						title: profile.Name,
						style: {
							color: '#FFFFFF'
						}
					}}
					statusBar={{
						style: 'light-content',
						tintColor: '#03a9f4'
					}}
                />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
                    {
                        profile.Avatars &&
                        <Image source={{ uri : profile.Avatars.Small }} style={styles.avatar} />
                    }
                    <Text style={styles.txtName}>{profile.Name}</Text>
                    <Text style={styles.txtEmail}>({profile.Email})</Text>
                    <TouchableOpacity style={styles.btnLogout} onPress={() => Actions.Login({type: 'reset'})}>
                        <Text style={styles.txtLogout}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    avatar: {
        margin: 20,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    txtName: {
        fontSize: 20,
        color: '#212121',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    txtEmail: {
        fontSize: 16,
        color: '#212121',
        marginBottom: 20
    },
    btnLogout: {
        width: 100,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#03a9f4',
        borderRadius: 4
    },
    txtLogout: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    NavigationBar: {
		height: 44,
		backgroundColor: '#03a9f4',
    },
    leftButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ic_back: {
        width: 20,
        height: 20,
    },
});

export default Splash;