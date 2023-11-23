import React, {useState} from 'react';
import StockContainer from "../components/StockContainer";
import {FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FetchStockData} from "../utils/FetchStockData";

function SearchedStock(props) {
    const [refreshing, setRefreshing] = useState(false);
    const [stocksData, setStocksData] = useState(props.searchedStockData);
    const matchedStocks = props.searchedStockData.map((stock) => stock.ticker);

    const handleRefresh = async () => {
        setRefreshing(true);
        const stockPromises = matchedStocks.map((ticker) => FetchStockData(ticker, '5m'));
        const stocksData = await Promise.all(stockPromises);
        const filteredStockData = stocksData.filter((data) => data !== null);
        setStocksData(filteredStockData);
        setRefreshing(false);
    };


    return (
        <View>
            {matchedStocks.length > 0? (<FlatList
                data={stocksData}
                keyExtractor={(item) => item.ticker}
                renderItem={({item, index}) => <StockContainer
                                                stockData={item}
                                                isEditMode={false}
                                                index={()=>{if (index===0) return 0}}
                                                userStocks={props.userStocks}
                                                showLoadDefaultButton={false}
                                                isPriceDisplay={props.isPriceDisplay}
                                                currency={props.currency}
                                                currencySymbol={props.currencySymbol}
                                                onUserClickedStock = {props.onUserClickedStock}
                                                exchangeRate={props.exchangeRate}/>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#f8adb3"
                    />}
            />):(<View style={{alignItems:'center', padding:10, marginTop:50,}}>
                    <Text style={{fontSize:18 ,color:'lightgray'}}>No matches for your stock search</Text>
                 </View>)}
            <TouchableOpacity onPress={props.handleHomeReturnPress} style={styles.HomeButton}>
                <Text style={styles.Text}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    HomeButton:{
        marginTop: 15,
        alignItems: 'center',
    },
    Text:{
        color: "#f8adb3",
        fontSize: 26,
        fontFamily:'titleFont',
    }
});
export default SearchedStock;