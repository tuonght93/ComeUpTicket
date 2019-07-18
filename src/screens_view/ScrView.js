import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import AvoidView from './AvoidView'

export default class SrcView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <AvoidView style={[this.props.style, { flex: 1, alignSelf: 'stretch' }]}>
                <ScrollView
                    style={{ flex: 1, alignSelf: 'stretch' }}
                    refreshControl={this.props.refreshControl}
                    keyboardShouldPersistTaps='always'
                    {...this.props}
                >
                    <View style={{ alignSelf: 'stretch' }}>
                        {this.props.children}
                    </View>
                </ScrollView>
            </AvoidView>
        );
    }
}
