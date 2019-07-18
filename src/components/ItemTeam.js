

import React from 'react'
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	Dimensions,
	ImageBackground
} from 'react-native';
import { Actions } from 'react-native-router-flux';
let deviceWidth = Dimensions.get('window').width;
class ItemTeam extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		var { data } = this.props;
		return (
			<TouchableOpacity style={styles.boxItemList} onPress={() => Actions.EventList({team_id: data.Id})}>
                <View style={styles.boxInfo}>
                    <Image source={{uri : data.Logos.Medium}} style={[styles.image_thumb]} />
                    <View style={styles.boxContent}>
                        <Text style={styles.txtName} numberOfLines={2}>{data.Name}</Text>
                        <Text style={styles.txtId}>ID : {data.Code}</Text>
                    </View>
                </View>
            </TouchableOpacity>
		)
	}
}

const styles = StyleSheet.create({
	boxItemList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomColor: '#bdbdbd',
        borderBottomWidth: 1
    },
    boxInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    image_thumb: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15
    },
    boxContent: {
        flex: 1
    },
    txtName: {
        fontSize: 15,
        color: '#212121',
        fontWeight: 'bold',
        marginBottom: 10
    },
    txtId: {
        fontSize: 14,
        color: '#212121',
        fontWeight: 'bold'
    },
})

export default ItemTeam;

