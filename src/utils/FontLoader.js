import React from 'react';
import { useFonts } from '@use-expo/font';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/**
 * FontLoader component that ensures fonts are loaded before rendering children.
 *
 * @component
 * @param {Object} children - React components to be rendered after font loading.
 * @returns {JSX.Element} - FontLoader component.
 */
export default function FontLoader({ children }) {
    // Load custom fonts
    const [fontLoaded] = useFonts({
        'titleFont': require('../../assets/fonts/JosefinSans-SemiBold.ttf'),
        'descriptionFont': require('../../assets/fonts/RobotoSlab-Regular.ttf'),
        'menuFont': require('../../assets/fonts/Raleway-Regular.ttf'),
    });

    // If fonts are not loaded, display a loading indicator
    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.text}>Loading Fonts...</Text>
            </View>
        );
    }

    // Fonts are loaded, render children
    return children;
}

// Styles for the component
const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
    },
});
