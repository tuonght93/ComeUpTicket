import React, { Component } from 'react';
import { Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window')

class ItemEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        var {data} = this.props;
        return (
            <TouchableOpacity onPress={() => Actions.EventDetail({event_id: data.Id})} style={styles.boxSlide}>
                <Image style={styles.boxThumb} source={{uri: data.Posters.Medium}} />
                <Text style={styles.txtName}>{ data.Title }</Text>
                <Text style={styles.txtTime}>{ data.TimeStart + ' ~ ' + data.TimeFinish }</Text>
                <Text style={styles.txtTime}>{ data.VenueName }</Text>
                <Text style={styles.txtCategory}>
                    {
                        data.HashTag &&
                        data.HashTag.map((Tag, index) => {
                            return <React.Fragment key={index}>
                                #{Tag.HashTagName + ' '}
                            </React.Fragment>
                        })
                    }
                </Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    boxSlide: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15
    },
    boxThumb: {
        width: width - 30,
        height: 170,
        marginBottom: 10
    },
    txtName: {
        fontSize: 17,
        color: '#212121',
        fontWeight: 'bold',
        marginBottom: 10
    },
    txtTime: {
        fontSize: 14,
        color: '#757575'
    },
    txtCategory: {
        fontSize: 14,
        color: '#212121',
        marginTop: 10
    },
});
export default ItemEvent;
