import React from 'react';
import { Text, View } from 'react-native';
import {useSelector} from 'react-redux';


const LineupComponent = () => {
    const players = useSelector(store => store.players);
    return ( 
        <View>
            <Text>{players.toString()}</Text>
        </View>
    );
}

export default LineupComponent;