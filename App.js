import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

// Import custom components and utilities
import NavigationBar from './src/components/NavigationBar';
import StockList from './src/components/StockList';
import FontLoader from './src/utils/FontLoader';

/**
 * The main application component.
 *
 * This component serves as the entry point of the application and
 * contains the structure of the app, including the font loading logic,
 * safe area view, navigation bar, and stock list.
 */
export default function App() {
    return (
        <FontLoader>
            <SafeAreaView style={styles.container}>
                <NavigationBar/>
                <View style={{flex: 1}}>
                    <StockList/>
                </View>
            </SafeAreaView>
        </FontLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', // Set the background color of the app
    },
});
