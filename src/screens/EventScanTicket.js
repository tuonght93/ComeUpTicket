import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    Image,
    TouchableOpacity
} from "react-native";
const window = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import ScrView from '../screens_view/ScrView';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Actions } from 'react-native-router-flux';
import HTTP from '../services/HTTP';
import Modal from "react-native-modal";
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
            } else if(response && response.data.status == -1) {
                this.setState({
                    isModelNoti: true,
                    isSuccess: false,
                    content: response.data.errors && response.data.errors.CodeScan ? response.data.errors.CodeScan : 'Fail!'
				})
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
        this.setState({isModelNoti: false});
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
                
                <ScrView style={styles.container} bounces={false}>
                    <QRCodeScanner
                        ref={(camera) => scanner = camera}
                        onRead={this.onSuccess}
                        topContent={
                            <Text style={styles.centerText}>
                                Scan ticket of event <Text style={styles.textBold}>{event.Title}</Text>
                            </Text>
                        }
                        bottomContent={
                            <TouchableOpacity style={styles.buttonTouchable}>
                                <Text style={styles.buttonText}>{status}</Text>
                            </TouchableOpacity>
                        }
                        // reactivate={this.state.isScan}
                        showMarker={true}
                    />
                </ScrView>
                <Modal
					isVisible={isModelNoti}
					animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    onBackdropPress={() => this.setState({isModelNoti: false})}
                    animationInTiming={500}
                    animationOutTiming={0}
                    backdropOpacity={0.3}
                    backdropTransitionInTiming={1000}
                    backdropTransitionOutTiming={1000}
					style={styles.boxModel}>
					<View style={styles.boxShowAnswer}>
                        <Image source={isSuccess ? require('../images/success.gif') : require('../images/close-icon.png')} style={styles.ic_success} />
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
    txtFollow: {
        fontSize: 17,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
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
        height: 150*261/257,
        padding: 20
    },
    txtSuccess: {
        fontSize: 20,
        color: '#78B348',
        paddingTop: 20,
        paddingBottom: 20
    },
    txtFail: {
        fontSize: 20,
        color: 'red',
        paddingTop: 20,
        paddingBottom: 20
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