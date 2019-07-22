import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    Image,
    TouchableOpacity,
    Alert,
    PermissionsAndroid,
    Platform
} from "react-native";
const window = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import ScrView from '../screens_view/ScrView';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Actions } from 'react-native-router-flux';
import HTTP from '../services/HTTP';
import Modal from "react-native-modal";
import Permissions from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';
let scanner;
const startScan = () => {
    if (scanner) {
        scanner._setScanning(false);
    }
};
class EventScanTicket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: '',
            isLoading: false,
            isModelNoti: false,
            isSuccess: false,
            content: '',
        };
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.checkCamera()
        } else {
            this.requestCameraPermission();
        }
    }

    checkCamera() {
        Permissions.check('camera').then(response => {
            if (response === 'denied') {
                this._alertForPhotosPermission();
            }
        });
    }

    _alertForPhotosPermission() {
        Alert.alert(
            'Can we access your camera?',
            'We need access so you can scan ticket',
            [
                {
                    text: 'Cancel',
                    onPress: () => Actions.pop(),
                    style: 'cancel',
                },
                { text: 'Open Settings', onPress: Permissions.openSettings },
            ],
        );
    }

    requestCameraPermission() {
        Permissions.request('camera').then(response => {
            if (response === 'restricted') {
                Alert.alert(
                    'Can we access your camera?',
                    'We need access so you can scan ticket',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => Actions.pop(),
                            style: 'cancel',
                        },
                        { text: 'Open Settings', onPress: () => AndroidOpenSettings.appDetailsSettings() },
                    ],
                    { cancelable: false },
                );
            }
        });
    }

    // componentDidMount() {
    //     this.setState({
    //         isLoading: true
    //     })
    //     var { event } = this.props;
    //     var CodeScan = 'KG4ERWRV7L';
    //     var CodeEvent = event.Code;
    //     var body = {
    //         CodeScan,
    //         CodeEvent
    //     }
    // 	return HTTP.callApiWithHeader('scan', 'POST', body).then(response => {
    //         console.log(response)
    //         this.setState({
    //             isLoading: false
    //         })
    //         if (response && response.data.status == 200) {
    // 			this.setState({
    //                 // event: response.data.data,
    //                 isModelNoti: true,
    //                 isSuccess: true,
    //                 content: 'Success!'
    // 			})
    //         } else if(response && response.data.status == -1) {
    //             this.setState({
    //                 // event: response.data.data,
    //                 isModelNoti: true,
    //                 isSuccess: false,
    //                 content: response.data.errors.CodeScan ? response.data.errors.CodeScan : 'Fail!'
    // 			})
    //         } else {
    //             this.setState({
    //                 // event: response.data.data,
    //                 isModelNoti: true,
    //                 isSuccess: false,
    //                 content: 'Fail!'
    // 			})
    //             // Toast.showWithGravity(JSON.stringify(response), Toast.SHORT, Toast.TOP)
    //         }
    //     }).catch(function (error) {
    //         alert(error)
    //     });
    // }

    onSuccess = (e) => {
        this.setState({
            isLoading: true,
        })
        var { event } = this.props;
        var CodeScan = e.data;
        var CodeEvent = event.Code;
        var body = {
            CodeScan,
            CodeEvent
        }
        return HTTP.callApiWithHeader('scan', 'POST', body).then(response => {
            this.setState({
                isLoading: false
            })
            if (response && response.data.status == 200) {
                this.setState({
                    isModelNoti: true,
                    isSuccess: true,
                    content: 'Success!'
                })
            } else if (response && response.data.status == -1) {
                this.setState({
                    isModelNoti: true,
                    isSuccess: false,
                    content: response.data.errors && response.data.errors.CodeScan ? response.data.errors.CodeScan : response.data.errors.CodeEvent ? response.data.errors.CodeEvent : 'Fail!'
                })
            } else if (response && response.data.status == 401) {
                Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.TOP)
                Actions.Login({ type: 'reset' })
            } else {
                this.setState({
                    isModelNoti: true,
                    isSuccess: false,
                    content: 'Fail!'
                })
            }
        }).catch(function (error) {
            this.setState({
                isModelNoti: true,
                isSuccess: false,
                content: 'Fail!'
            })
        });
    }

    continue() {
        this.setState({ isModelNoti: false });
        startScan()
    }

    render() {
        var { event } = this.props;
        var { status, isModelNoti, content, isSuccess } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar
                    style={styles.NavigationBar}
                    leftButton={<TouchableOpacity onPress={() => Actions.pop()} style={styles.leftButton}><Image source={require('../images/ic_back.png')} style={styles.ic_back} /></TouchableOpacity>}
                    title={{
                        title: event.Title,
                        style: {
                            color: '#FFFFFF'
                        }
                    }}
                    statusBar={{
                        style: 'light-content',
                        tintColor: '#03a9f4'
                    }}
                />
                {
                    this.state.isLoading &&
                    <View style={{ position: 'absolute', backgroundColor: 'rgba(0,0,0,0.1)', left: 0, top: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginBottom: 50 }} />
                    </View>
                }
                <ScrView style={styles.container} bounces={false}>
                    <QRCodeScanner
                        ref={(camera) => scanner = camera}
                        onRead={this.onSuccess}
                        topContent={
                            <View style={styles.boxTopContent}><Text style={styles.centerText}>Scan ticket of event</Text><Text style={styles.textBold}>{event.Title}</Text></View>
                        }
                        bottomContent={
                            <TouchableOpacity style={styles.buttonTouchable}>
                                <Text style={styles.buttonText}>{status}</Text>
                            </TouchableOpacity>
                        }
                        // reactivate={this.state.isScan}
                        showMarker={true}
                        cameraStyle={{
                            height: window.width,
                            overflow: 'hidden'
                        }}
                    />
                </ScrView>
                <Modal
                    isVisible={isModelNoti}
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    onBackdropPress={() => this.setState({ isModelNoti: false })}
                    animationInTiming={500}
                    animationOutTiming={0}
                    backdropOpacity={0.3}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
                    style={styles.boxModel}>
                    <View style={styles.boxShowAnswer}>
                        <Image source={isSuccess ? require('../images/success.gif') : require('../images/close-icon.png')} style={isSuccess ? styles.ic_success : styles.ic_fail} />
                        <Text style={isSuccess ? styles.txtSuccess : styles.txtFail}>{content}</Text>
                        <TouchableOpacity style={styles.btnContinue} onPress={() => this.continue()}>
                            <Text style={styles.txtContinue}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
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
    boxImageThumb: {
        marginBottom: 25,
        width: window.width,
        resizeMode: 'cover',
        height: 210,
    },
    content: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    txtNameEvent: {
        fontSize: 20,
        color: '#212121',
        paddingBottom: 15,
        fontWeight: 'bold'
    },
    txtCategory: {
        fontSize: 14,
        color: '#212121',
        paddingBottom: 15,
        fontWeight: '500'
    },
    btnTicket: {
        height: 54,
        backgroundColor: '#03a9f4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxEventMoreLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxTopContent: {
        padding: 32,
    },
    txtFollow: {
        fontSize: 17,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        color: '#777',
        textAlign: 'center'
    },
    textBold: {
        fontWeight: '500',
        color: '#212121',
        fontSize: 22,
        textAlign: 'center'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    boxModel: {
        flex: 1,
    },
    boxShowAnswer: {
        height: 350,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    ic_success: {
        width: 150,
        height: 150 * 261 / 257,
        padding: 20
    },
    ic_fail: {
        width: 150,
        height: 150,
        padding: 20
    },
    txtSuccess: {
        fontSize: 20,
        color: '#78B348',
        padding: 20,
        textAlign: 'center'
    },
    txtFail: {
        fontSize: 20,
        color: 'red',
        padding: 20,
        textAlign: 'center'
    },
    btnContinue: {
        width: 150,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#78B348',
        marginTop: 20,
        marginBottom: 20
    },
    txtContinue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
});

export default EventScanTicket;