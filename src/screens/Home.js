import React from 'react';
import {SafeAreaView, StyleSheet, View} from "react-native";
import NavigationBar from "../components/NavigationBar";
import StockList from "../components/StockList";
import FontLoader from "../utils/FontLoader";

function Home() {

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
export default Home;