import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView} from "react-native";
import NavigationBar from "../components/NavigationBar";
import StockContainer from "../components/StockContainer";
import FontLoader from "../utils/FontLoader";
import {FetchStockData} from "../utils/FetchStockData";
import Loading from "./Loading";

function StockSearch({route, navigation}) {
    const {ticker} = route.params;
    const [searchedStockData, setSearchedStockData] = useState({})
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleSearchSubmit = async (searchedStock) => {
            if(searchedStock){
                setLoading(true);
                const stockPromises = FetchStockData(searchedStock.toUpperCase(), '5m')
                const stocksData = await stockPromises;
                setLoading(false);
                setSearchedStockData(stocksData)
            }
        };
        handleSearchSubmit(ticker)
    }, []);

    if (loading) {return (<Loading/>);}

    return (
        <FontLoader>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: '#121212',
            }}>
                <NavigationBar/>
                <StockContainer stockData={searchedStockData}/>
                <Button title="Home" onPress={() => navigation.goBack()} color={'#f8adb3'}/>
            </SafeAreaView>
        </FontLoader>
    );
}

export default StockSearch;