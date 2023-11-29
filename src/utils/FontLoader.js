import React from 'react';
import {useFonts} from '@use-expo/font';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

/**
 * FontLoader component that ensures fonts are loaded before rendering children.
 *
 * @param {object} children - React components to be rendered after font loading.
 * @returns {Object} FontLoader component.
 */
export default function FontLoader({children}) {
    const [fontLoaded] = useFonts({
        'titleFont': require('../../assets/fonts/JosefinSans-SemiBold.ttf'),
        'descriptionFont': require('../../assets/fonts/RobotoSlab-Regular.ttf'),
        'menuFont': require('../../assets/fonts/Raleway-Regular.ttf'),
    });

    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white"/>
                <Text style={{color: 'white'}}>Loading Fonts...</Text>
            </View>
        );
    }

    return children;
}

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
