import React, { Component } from 'react';
import { Platform, View, KeyboardAvoidingView } from 'react-native';

export default class AvoidView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            Platform.OS === 'android' ?
                <View style={this.props.style}>
                    {this.props.children}
                </View>
                :
                <KeyboardAvoidingView
                    behavior='padding'
                    style={this.props.style}>
                    {this.props.children}
                </KeyboardAvoidingView>
        )
    }
}
