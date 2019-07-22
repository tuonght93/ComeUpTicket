import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";
const window = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import ScrView from '../screens_view/ScrView';
import { Actions } from 'react-native-router-flux';
import HTTP from '../services/HTTP';
import Toast from 'react-native-simple-toast';
class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            event: {
                
            },
            isLoading: true,
            isEvent: true,
            isAllowScan: false,
        };
    }

    componentDidMount() {
        var { event_id } = this.props;
		return HTTP.callApiWithHeader('events-scan/'+event_id, 'GET', null).then(response => {
            this.setState({
                isLoading: false
            })
            if (response && response.data.status == 200) {
				this.setState({
					event: response.data.data,
				})
            } else if(response.data.status == 404) {
                this.setState({
					isEvent: false,
				})
            } else if(response && response.data.status == 401) {
                Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.TOP)
                Actions.Login({type: 'reset'})
            } else {
                Toast.showWithGravity(JSON.stringify(response), Toast.SHORT, Toast.TOP)
            }
        }).catch(function (error) {
            
        });
    }
    
    allowScan() {
        var { event } = this.state;
        Alert.alert(
            'Allow Ticket scaning!',
            'Are you sure you want to start opening tickets scanning?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => {
                    this.setState({ isAllowScan: true });
                    var body = {
                        AllowScan: 1
                    }
                    return HTTP.callApiWithHeader('events-scan/'+event.Id+'/allow-scan', 'POST', body).then(response => {
                        this.setState({
                            isAllowScan: false
                        })
                        if (response && response.data.status == 200) {
                            event.AllowScan = 1;
                            this.setState({
                                event
                            })
                        } else if(response && response.data.status == -1) {
                            Toast.showWithGravity(response.data.errors ? response.data.errors.Id : 'Error!', Toast.SHORT, Toast.BOTTOM)
                        } else if(response && response.data.status == 401) {
                            Toast.showWithGravity(response.data.message, Toast.SHORT, Toast.TOP)
                            Actions.Login({type: 'reset'})
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
                }},
            ],
            { cancelable: false },
        );
    }

    render() {
        var { event, isLoading, isEvent, isAllowScan } = this.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar
                    style={styles.NavigationBar}
                    leftButton={<TouchableOpacity onPress={() => Actions.pop()} style={styles.leftButton}><Image source={require('../images/ic_back.png')} style={styles.ic_back} /></TouchableOpacity>}
                    title={{
                        title: event.Title ? event.Title : 'Event Detail',
                        style: {
                            color: '#FFFFFF',
                            paddingLeft: 65,
                            paddingRight: 65,
                        },
                        numberOfLines: 1
                    }}
                    statusBar={{
                        style: 'light-content',
                        tintColor: '#03a9f4'
                    }}
                />
                {
                    isLoading ?
                    <ActivityIndicator size="large" color="#000000" style={{ padding: 20, flex: 1 }} />
                    :
                    isEvent
                    ?
                    <React.Fragment>
                        {
                            isAllowScan
                            &&
                            <View style={{ flex: 1, top: window.height/2 - 30, width: window.width, position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                        }
                        <View style={{ opacity: isAllowScan ? 0.2 : 1, flex: 1 }}>
                            <ScrView style={styles.container} bounces={false}>
                                <Image style={styles.boxImageThumb} source={{ uri: event.Posters ? event.Posters.Medium : event.Poster }} />
                                <View style={styles.content}>
                                    <Text style={styles.txtNameEvent}>{event.Title}</Text>
                                    <Text style={[styles.txtCategory, { fontWeight: 'normal' }]}>{event.EventCode}</Text>
                                    <Text style={[styles.txtCategory, { fontWeight: 'normal' }]}>{event.TimeStart + ' ~ ' + event.TimeFinish}</Text>
                                    <Text style={[styles.txtCategory, { fontWeight: 'normal' }]}>{event.Address}</Text>
                                </View>
                            </ScrView>
                            <TouchableOpacity style={styles.btnTicket} onPress={() => isAllowScan ? null : event.AllowScan == 0 ? this.allowScan() : Actions.EventScanTicket({event})}>
                                {
                                    event.AllowScan == 0
                                    ?
                                    <Text style={styles.txtFollow}>Start Ticket Scanning! </Text>
                                    :
                                    <View style={styles.boxEventMoreLeft}>
                                        <Image source={require('../images/qr_scanner.png')} style={{ marginRight: 10, width: 20, height: 20 }} />
                                        <Text style={styles.txtFollow}>Scan Ticket</Text>
                                    </View>
                                }
                            </TouchableOpacity>
                        </View>
                    </React.Fragment>
                    :
                    <Text style={{ textAlign: 'center', paddingTop: 20 }}>Event is not exists.</Text>
                }
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
        backgroundColor: '#bdbdbd'
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
});

export default EventDetail;