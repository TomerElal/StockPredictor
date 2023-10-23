import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";

function Loading() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white"/>
            <Text style={{color: 'white'}}>Loading Fonts and Data...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Loading;