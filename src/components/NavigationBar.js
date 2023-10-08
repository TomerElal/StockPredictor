import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GridIcon from '../../assets/icons/GridIcon';

/**
 * The navigation bar component for the application.
 */
const NavigationBar = () => {
    // State to track whether the homepage button is pressed
    const [HomePagePressed, setHomePagePressed] = useState(false);

    /**
     * Handles the button press event.
     * @param {string} key - The key associated with the pressed button.
     */
    function handlePress(key) {
        console.log('Button pressed', key);
    }

    /**
     * Handles the button press in event.
     */
    const handlePressIn = () => {
        setHomePagePressed(true);
    };

    /**
     * Handles the button press out event.
     */
    const handlePressOut = () => {
        setHomePagePressed(false);
    };

    return (
        <View style={styles.container}>
            {/* Homepage Button */}
            <TouchableHighlight
                onPress={() => handlePress('HomePage')}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                underlayColor="transparent"
                style={{padding: 10}}
            >
                <Text style={[styles.appName, {color: HomePagePressed ? '#f8adb3' : 'white'}]}>
                    Stock Predictor
                </Text>
            </TouchableHighlight>

            {/* Icon Buttons */}
            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => handlePress('Search')} style={{padding: 10}}>
                    <Icon name="search" size={22} style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePress('Menu')} style={{padding: 10}}>
                    <GridIcon width={25} height={25}/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styles for the NavigationBar component
const styles = {
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#21262f',
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
