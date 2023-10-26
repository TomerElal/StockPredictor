import React from 'react';
import StockContainer from "../components/StockContainer";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

function SearchedStock(props) {
    return (
        <>
            <StockContainer stockData={props.searchedStockData}/>
            <TouchableOpacity onPress={props.handleHomeReturnPress} style={styles.HomeButton}>
                <Text style={styles.Text}>Home</Text>
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({

    HomeButton:{
        marginTop: 50,
        alignItems: 'center',
    },
    Text:{
        color: "#f8adb3",
        fontSize: 20,
    }
});
export default SearchedStock;