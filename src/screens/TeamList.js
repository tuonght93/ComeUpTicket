import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Image
} from "react-native";
const window = Dimensions.get('window');
import NavigationBar from 'react-native-navbar';
import ItemTeam from '../components/ItemTeam';
import HTTP from '../services/HTTP';
import Toast from 'react-native-simple-toast';
import { Actions } from 'react-native-router-flux';
class TeamList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			isLoadMore: false,
			datas: [],
			page: 1,
            isLoadFirst: true,
            profile: {

            }
		};
    }

    componentDidMount() {
		this.setState({
			isLoadMore: true
		})
		this.loadDataItems();
	}

	loadDataItems(page = 1) {
		return HTTP.callApiWithHeader('users/show/team-scan?page='+page+'&per_page=12', 'GET', null).then(response => {
            if (response && response.data.status == 200) {
				this.setState({
					datas: page === 1 ? response.data.data : this.state.datas.concat(response.data.data),
					isLoadMore: response.data.last_page > response.data.current_page ? true : false,
					page: response.data.current_page,
					isLoadFirst: false
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
        var { profile } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <NavigationBar
                    style={styles.NavigationBar}
					title={{
						title: 'Team List',
						style: {
							color: '#FFFFFF'
						}
					}}
					statusBar={{
						style: 'light-content',
						tintColor: '#03a9f4'
                    }}
                    rightButton={<TouchableOpacity onPress={() => Actions.Profile({profile})} style={styles.rightButton}>{profile.Avatars && <Image source={{ uri : profile.Avatars.Small }} style={styles.avatar} />}</TouchableOpacity>}
                />
                <FlatList
                    contentContainerStyle={{backgroundColor: '#FFFFFF', paddingBottom: 15}}
                    // ListHeaderComponent={() => this.renderHeader()}
                    data = {this.state.datas}
                    renderItem = {(data) => <ItemTeam data={data.item}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => { this.loadMore() }}
					ListFooterComponent={() => this._renderFooter()}
					onEndReachedThreshold={0.5}
                    refreshing={false}
                    onRefresh={() => {this.refresh()}}
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
    rightButton: {
		height: 44,
        alignItems: 'center',
		justifyContent: 'center',
		width: 60
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15
    }
});

export default TeamList;