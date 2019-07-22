import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    AsyncStorage,
    ActivityIndicator
} from "react-native";
import ScrView from '../screens_view/ScrView';
import HTTP from '../services/HTTP';
import { Actions } from 'react-native-router-flux';
const base64 = require('base-64');
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin, statusCodes } from 'react-native-google-signin';
GoogleSignin.configure();
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            err_username: '',
            err_password: '',
            isSubmit: true,
            isLoading: false,
        };
        LoginManager.logOut()
        GoogleSignin.signOut()
        AsyncStorage.clear()
    }

    shouldLogin = () => {
        return (this.state.username && this.state.password)
    }

    login(headers) {
        return HTTP.callApi('login', 'post', null, headers).then(response => {
            this.setState({
                isSubmit: true,
                isLoading: false
            })
            response = response.data;
            if (response.status == 200) {
                let arr = []
                arr.push(['auKey', 'Authorization'])
                arr.push(['auValue', 'Bearer '+response.data.token])
                AsyncStorage.multiSet(arr, () => {
                    Actions.TeamList({type: 'reset', profile: response.data})
                })
            } else {
                this.setState({
                    err_username: response.errors.UserId ? response.errors.UserId : '',
                    err_password: response.errors.Password ? response.errors.Password : '',
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    submitLogin() {
        this.setState({
            isSubmit: false,
            isLoading: true,
            err_username: '',
            err_password: '',
        })
        const encode = base64.encode(this.state.username + ":" + this.state.password);
        const auKey = 'Authorization';
        const auValue = 'Basic ' + encode;
        let headers = {};
        headers[auKey] = auValue;
        this.login(headers);
    }

    loginFacebook = () => {
        this.setState({
            isSubmit: false,
            isLoading: true,
            err_username: '',
            err_password: '',
        })
        // Attempt a login using the Facebook login dialog asking for default permissions.
        LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
            (result) => {
                if (result.isCancelled) {
                    this.setState({
                        isSubmit: true,
                        isLoading: false,
                    })
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            console.log(data);
                            const accessToken = data.accessToken.toString()
                            if (accessToken) {
                                const auKey = 'Fbtoken';
                                const auValue = accessToken;
                                let headers = {};
                                headers[auKey] = auValue;
                                this.login(headers);
                            }
                            else {
                                this.setState({
                                    isSubmit: true,
                                    isLoading: false,
                                })
                                alert('Error')
                            }
                        }
                    ).catch(function (e) {
                        console.log(e)
                    })
                }
            },
            (error) => {
                alert("Login fail with error: " + error);
            }
        );
    }

    loginGoogle = async () => {
        this.setState({
            isSubmit: false,
            isLoading: true,
            err_username: '',
            err_password: '',
        })
        try {
            await GoogleSignin.hasPlayServices();
            // GoogleSignin.configure();
            await GoogleSignin.signIn();
            const userInfo = await GoogleSignin.getTokens();
            console.log(userInfo)
            const auKey = 'Ggtoken';
            const auValue = userInfo.accessToken;
            let headers = {};
            headers[auKey] = auValue;
            this.login(headers);
        } catch (error) {
            console.log(error)
            this.setState({
                isSubmit: true,
                isLoading: false,
            })
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (f.e. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
                alert('Error')
            }
        }
    }

    render() {
        var { isLoading } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {
                    this.state.isLoading &&
                    <View style={{position: 'absolute', backgroundColor: 'rgba(0,0,0,0.1)', left: 0, top: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" style={{marginBottom: 50}} />
                    </View>
                }
                <ScrView style={styles.container} bounces={false}>
                    <View style={styles.content}>
                        <View style={styles.boxLogo}>
                            <Text style={styles.txtTitle}>We like to party!</Text>
                            <Image source={require('../images/logo_blue.png')} style={styles.logo} />
                        </View>
                        <View style={styles.boxLoginForm}>
                            <View style={styles.boxInput}>
                                <Text style={styles.txtInput}>ID or Email</Text>
                                <TextInput
                                    style={styles.ipContent}
                                    selectionColor="#bcbcbc"
                                    value={this.state.username}
                                    onChangeText={(username) => this.setState({ username, err_username: '' })}
                                    keyboardType={'email-address'}
                                    autoCapitalize='none'
                                />
                                {
                                    this.state.err_username !== '' &&
                                    <Text style={styles.txtError}>{this.state.err_username}</Text>
                                }
                            </View>
                            <View style={styles.boxInput}>
                                <Text style={styles.txtInput}>Password</Text>
                                <TextInput
                                    style={styles.ipContent}
                                    selectionColor="#bcbcbc"
                                    value={this.state.password}
                                    onChangeText={(password) => this.setState({ password, err_password: '' })}
                                    secureTextEntry={true}
                                />
                                {
                                    this.state.err_password !== '' &&
                                    <Text style={styles.txtError}>{this.state.err_password}</Text>
                                }
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                disabled={!this.shouldLogin() || isLoading}
                                onPress={() => this.submitLogin()}
                                style={[styles.btnLogin, { backgroundColor: this.shouldLogin() ? '#03a9f4' : '#FFFFFF', borderColor: this.shouldLogin() ? '#03a9f4' : '#c9c9c9', }]}>
                                <Text style={[styles.txtLogin, { color: this.shouldLogin() ? '#FFFFFF' : '#c9c9c9' }]}>Log In</Text>
                            </TouchableOpacity>
                            <View style={styles.boxHr}>
                                <View style={styles.hr}></View>
                                <View style={styles.boxText}>
                                    <Text style={styles.text}>OR</Text>
                                </View>
                                <View style={styles.hr}></View>
                            </View>
                            <TouchableOpacity
                                disabled={isLoading}
                                activeOpacity={0.5}
                                onPress={() => this.loginFacebook()}
                                style={styles.btnLoginFacebook}>
                                    <Image style={{ marginLeft: 16 }} source={require('../images/facebook_logo.png')} />
                                    <Text style={styles.txtFacebook}>Continue with Facebook</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={isLoading}
                                activeOpacity={0.5}
                                onPress={() => this.loginGoogle()}
                                style={styles.btnLoginGoogle}>
                                    <View style={{ marginLeft: 16, width: 29, height: 29, borderRadius: 4, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={require('../images/G_icon.png')} style={{width: 29, height: 29}} />
                                    </View>
                                    <Text style={styles.txtFacebook}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    boxLogo: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    txtTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#a8a8a8'
    },
    logo: {
        marginTop: 10
    },
    boxInput: {
        paddingBottom: 24,
        marginTop: 10,
        marginBottom: 10
    },
    txtInput: {
        fontSize: 15,
        color: '#212121',
        fontWeight: 'bold'
    },
    ipContent: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212121',
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#bdbdbd'
    },
    txtError: {
        color: '#ff4081',
        fontSize: 12,
        marginTop: 2
    },
    btnLogin: {
        minHeight: 45,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtLogin: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    boxHr: {
        paddingTop: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    hr: {
        height: 1,
        backgroundColor: 'rgb(194, 197, 208)',
        flex: 1,
        marginLeft: 5,
        marginRight: 5
    },
    text: {
        fontSize: 16,
        color: 'rgb(194, 197, 208)'
    },
    btnLoginFacebook: {
        alignSelf: 'stretch',
        height: 45,
        backgroundColor: '#4065b4',
        justifyContent: 'center',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    txtFacebook: {
        color: 'white',
        fontWeight: '400',
        fontSize: 18,
        flex: 1,
        textAlign: 'center'
    },
    btnLoginGoogle: {
        alignSelf: 'stretch',
        height: 45,
        backgroundColor: '#e74133',
        justifyContent: 'center',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    }
});

export default Login;