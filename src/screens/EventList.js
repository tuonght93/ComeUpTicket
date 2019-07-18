import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image
} from "react-native";
const window = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import ItemEvent from '../components/ItemEvent';
import { Actions } from 'react-native-router-flux';
import HTTP from '../services/HTTP';
import Toast from 'react-native-simple-toast';
class EventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			isLoadMore: false,
			datas: [],
			page: 1,
			isLoadFirst: true,
		};
    }

    componentDidMount() {
		this.setState({
			isLoadMore: true
		})
		this.loadDataItems();
	}

	loadDataItems(page = 1) {
        var { team_id } = this.props;
		return HTTP.callApiWithHeader('teams/'+team_id+'/events-scan?page='+page+'&per_page=12', 'GET', null).then(response => {
            if (response && response.data.status == 200) {
				this.setState({
					datas: page === 1 ? response.data.data : this.state.datas.concat(response.data.data),
					isLoadMore: response.data.last_page > response.data.current_page ? true : false,
					page: response.data.current_page,
					isLoadFirst: false
				})
            } else {
                Toast.showWithGravity(JSON.stringify(response), Toast.SHORT, Toast.TOP)
            }
        }).catch(function (error) {
            
        });
	}

	refresh() {
		this.loadDataItems(1);
	}

	loadMore() {
		var { isLoadMore, page, isLoadFirst } = this.state;
		if(isLoadMore && !isLoadFirst) {
			this.loadDataItems(page+1)
		}
	}

	_renderFooter() {
		var { isLoadMore, datas } = this.state;
        if (isLoadMore) {
            return <ActivityIndicator size="large" color="#000000" style={{ padding: 20, flex: 1 }} />
        } else {
            if (datas.length === 0) {
                return <Text style={{ textAlign: 'center', paddingTop: 20 }}>Không có dữ liệu để hiển thị.</Text>
            } else {
                return null;
            }
        }
	}

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar
                    style={styles.NavigationBar}
                    leftButton={<TouchableOpacity onPress={() => Actions.pop()} style={styles.leftButton}><Image source={require('../images/ic_back.png')} style={styles.ic_back} /></TouchableOpacity>}
					title={{
						title: 'Event List',
						style: {
							color: '#FFFFFF'
						}
					}}
					statusBar={{
						style: 'light-content',
						tintColor: '#03a9f4'
					}}
                />
                <FlatList
                    contentContainerStyle={{backgroundColor: '#FFFFFF', paddingBottom: 15}}
                    // ListHeaderComponent={() => this.renderHeader()}
                    data = {this.state.datas}
                    renderItem = {(data) => <ItemEvent data={data.item}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => { this.loadMore() }}
                    ListFooterComponent={() => this._renderFooter()}
                    refreshing={false}
                    onRefresh={() => {this.refresh()}}
                    onEndReachedThreshold={0.5}
                />
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
});

export default EventList;