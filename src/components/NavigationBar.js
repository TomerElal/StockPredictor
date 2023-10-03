import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridIcon from "./GridIcon";

const NavigationBar = () => {
    function handlePress(key) {
        console.log('key pressed', key);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Stock Predictor</Text>
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => handlePress('Search')} style={{padding:10}}>
                    <Icon name="search" size={22} style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('Menu')} style={{padding:10}}>
                    <GridIcon width={25} height={25}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#262d3b',
        paddingHorizontal: 16,
        height: 70,

    },
    appName: {
        fontSize: 30,
        color: 'white',
        fontFamily: 'titleFont',
        marginTop: 5,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    icon: {
        color: 'white',
        marginRight: 15,
    },
};

export default NavigationBar;
