import React, { useState } from 'react';
import StockContainer from '../components/StockContainer';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FetchStockData } from '../utils/FetchStockData';

/**
 * SearchedStock component displays the stock data for the searched stocks.
 *
 * @component
 * @param {object} props - The properties of the component.
 * @param {Array} props.searchedStockData - The data for the searched stocks.
 * @param {Array} props.userStocks - The user's stocks.
 * @param {boolean} props.isPriceDisplay - Flag indicating whether to display prices.
 * @param {string} props.currency - The currency for displaying stock prices.
 * @param {string} props.currencySymbol - The symbol of the currency.
 * @param {function} props.onUserClickedStock - Callback when a stock is clicked.
 * @param {function} props.handleHomeReturnPress - Callback to handle the return to home.
 * @param {number} props.exchangeRate - The exchange rate for currency conversion.
 * @returns {JSX.Element} - Rendered component.
 */
function SearchedStock(props) {
    const [refreshing, setRefreshing] = useState(false);
    const [stocksData, setStocksData] = useState(props.searchedStockData);
    const matchedStocks = props.searchedStockData.map((stock) => stock.ticker);

    /**
     * Handles the refresh action to fetch the latest stock data.
     */
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
            {matchedStocks.length > 0 ? (
                <FlatList
                    data={stocksData}
                    keyExtractor={(item) => item.ticker}
                    renderItem={({ item, index }) => (
                        <StockContainer
                            stockData={item}
                            isEditMode={false}
                            index={() => {
                                if (index === 0) return 0;
                            }}
                            userStocks={props.userStocks}
                            showLoadDefaultButton={false}
                            isPriceDisplay={props.isPriceDisplay}
                            currency={props.currency}
                            currencySymbol={props.currencySymbol}
                            onUserClickedStock={props.onUserClickedStock}
                            exchangeRate={props.exchangeRate}
                        />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#f8adb3" />
                    }
                />
            ) : (
                <View style={{ alignItems: 'center', padding: 10, marginTop: 50 }}>
                    <Text style={{ fontSize: 18, color: 'lightgray' }}>No matches for your stock search</Text>
                </View>
            )}
            <TouchableOpacity onPress={props.handleHomeReturnPress} style={styles.HomeButton}>
                <Text style={styles.Text}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    HomeButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    Text: {
        color: '#f8adb3',
        fontSize: 26,
        fontFamily: 'titleFont',
    },
});

export default SearchedStock;
