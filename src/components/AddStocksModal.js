import React, { useState } from 'react';
import {
    TextInput,
    StyleSheet,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    LayoutAnimation,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {FetchStockData} from "../utils/FetchStockData";

/**
 * Component for adding stocks to the user's list.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onAddStocks - Function to handle adding stocks.
 * @param {Array} props.userStocks - List of user's existing stocks.
 * @returns {JSX.Element} - Rendered component.
 */
function AddStocksModal({ onAddStocks, userStocks }) {
    // State variables for managing input and stocks to add
    const [searchText, setSearchText] = useState('');
    const [stocksToAdd, setStocksToAdd] = useState([]);
    const [stocksToAddSize, setStocksToAddSize] = useState(0);

    // Loading state for search operation
    const [loading, setLoading] = useState(false);

    // State for displaying invalid input message
    const [displayInvalidInput, setDisplayInvalidInput] = useState('');

    /**
     * Check if the entered stock is valid.
     * @param {string} stock - Stock symbol or company name.
     * @returns {Object} - Object containing result and validity.
     */
    async function checkStockInput(stock) {
        // Check for empty input
        if (stock === '') {
            return { result: 'Empty input', isValid: false };
        }

        // Fetch stock information from Yahoo Finance API
        const matchStocksUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${stock}`;
        const [matchStocksResponse] = await Promise.all([
            fetch(matchStocksUrl).then((response) => response.json()),
        ]);

        // Extract stock information from the API response
        let stockName = '';
        let stockCompany = '';
        if (matchStocksResponse['quotes'].length > 0) {
            stockName = matchStocksResponse['quotes'][0]['symbol'];
            if (matchStocksResponse['quotes'][0]['shortname']) {
                stockCompany = matchStocksResponse['quotes'][0]['shortname'].split(/[ ,]+/)[0].toUpperCase();
            }
        }

        // Check if the entered stock is valid
        if (stockName !== stock && stockCompany !== stock) {
            return { result: 'Stock does not exist', isValid: false };
        }
        if (stocksToAdd.includes(stockName)) {
            return { result: 'Stock already added', isValid: false };
        }
        if (userStocks.includes(stockName)) {
            return { result: 'Stock already listed', isValid: false };
        }
        if (FetchStockData(stockName, '5m') === null) {
            return { result: 'Stock has a missing data', isValid: false };
        }

        return { result: stockName, isValid: true };
    }

    /**
     * Handle the submission of stock search.
     */
    async function handleSearchSubmit() {
        setDisplayInvalidInput('');
        setLoading(true);

        // Convert the entered stock text to uppercase
        const searchedStock = searchText.toUpperCase();

        // Check if the entered stock is valid
        const inputResult = await checkStockInput(searchedStock);

        if (inputResult.isValid === true) {
            // Update the stocks to add and trigger layout animation
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            const tmp = [...stocksToAdd];
            tmp.unshift(inputResult.result);
            setStocksToAdd(tmp);
            setStocksToAddSize(stocksToAddSize + 1);
        } else {
            setDisplayInvalidInput(inputResult.result);
        }

        setLoading(false);
        setSearchText('');
    }

    /**
     * Delete a stock symbol from the list of stocks to add.
     * @param {string} symbol - Stock symbol to delete.
     */
    function deleteSymbol(symbol) {
        const updatedStocks = stocksToAdd.filter((stock) => stock !== symbol);
        setStocksToAdd(updatedStocks);
        setStocksToAddSize(stocksToAddSize - 1);
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                {/* Search input */}
                <TextInput
                    style={styles.searchBar}
                    placeholder="Insert stock symbol/company"
                    placeholderTextColor="lightgray"
                    value={searchText}
                    onChangeText={(text) => {
                        setDisplayInvalidInput('');
                        setSearchText(text);
                    }}
                    onSubmitEditing={handleSearchSubmit}
                    blurOnSubmit={false}
                    autoFocus={true}
                    keyboardAppearance="dark"
                    autoCapitalize="none"
                    returnKeyType="join"
                />
                {/* Search button or loading indicator */}
                {loading ? (
                    <View>
                        <ActivityIndicator size="small" color="#f8adb3" />
                    </View>
                ) : (
                    <TouchableOpacity onPress={handleSearchSubmit}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* List of stocks to add */}
            <FlatList
                data={stocksToAdd}
                horizontal={true}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.stockItem}>
                        {/* Individual stock item */}
                        <View style={styles.stockItemContainer}>
                            <Text style={styles.stockItemText}>{item}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={() => deleteSymbol(item)}>
                                {/* Close button */}
                                <Icon name={'close-circle-outline'} color={'white'} size={13} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            {/* Display invalid input message */}
            {displayInvalidInput ? (
                <Text style={styles.invalidInputText}>{displayInvalidInput}</Text>
            ) : (
                <></>
            )}

            {/* Add button if stocks are present */}
            {stocksToAddSize > 0 ? (
                <TouchableOpacity onPress={() => onAddStocks(stocksToAdd)}>
                    <Text style={styles.addButton}>Add</Text>
                </TouchableOpacity>
            ) : (
                <></>
            )}
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    searchBar: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 35,
        paddingHorizontal: 10,
        marginRight: 15,
        flex: 2,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
    },
    stockItem: {
        height: 50,
        padding: 5,
    },
    stockItemContainer: {
        backgroundColor: 'rgba(250, 250, 250, 0.3)',
        borderRadius: 5,
        paddingLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockItemText: {
        color: '#f8adb3',
        fontSize: 14,
    },
    closeButton: {
        marginBottom: 7,
        padding: 5,
    },
    invalidInputText: {
        color: '#eb5779',
        padding: 10,
        paddingBottom: 15,
    },
    addButton: {
        color: '#f8adb3',
        fontFamily: 'titleFont',
        fontSize: 22,
    },
});

// Export the component
export default AddStocksModal;
