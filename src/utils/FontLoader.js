import { useFonts } from '@use-expo/font';
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import React from "react";

export const loadFonts = () => {
    const [fontLoaded] = useFonts({
        'titleFont': require('../../assets/fonts/JosefinSans-SemiBold.ttf'),
    });
    if (!fontLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="black"/>
                <Text style={{color: 'white'}}>Loading Fonts...</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    loadingContainer: {
        backgroundColor: 'black',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
