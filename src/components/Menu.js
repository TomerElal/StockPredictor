import React, {useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {rgbaColor} from "react-native-reanimated/src";

function Menu({onEditWatchlist, onPriceOrChangeDisplay, onChangeCurrency, isPriceDisplay, closeMenu}) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const currencies = [
        {currency: 'USD', state: 'United States', symbol: '$'}, {currency: 'EUR', state: 'Europe', symbol: '€'},
        {currency: 'ILS', state: 'Israel', symbol: '₪'}, {currency: 'GBP', state: 'United Kingdom', symbol: '£'},
        {currency: 'CAD', state: 'Canada', symbol: 'C$'}, {currency: 'JPY', state: 'Japan', symbol: '¥'},
        {currency: 'CNY', state: 'China', symbol: '元'}, {currency: 'AUD', state: 'Australia', symbol: 'A$'},
        {currency: 'CHF', state: 'Switzerland', symbol: ''}, {currency: 'HKD', state: 'Hong Kong', symbol: 'HK$'},
        {currency: 'SGD', state: 'Singapore', symbol: 'S$'}, {currency: 'SEK', state: 'Sweden', symbol: ''},
        {currency: 'KRW', state: 'South Korea', symbol: '₩'}, {currency: 'NZD', state: 'New Zealand', symbol: 'NZ$'},
        {currency: 'INR', state: 'India', symbol: '₹'}, {currency: 'MXN', state: 'Mexico', symbol: ''},
        {currency: 'TWD', state: 'Taiwan', symbol: 'NT$'}, {currency: 'ZAR', state: 'South Africa', symbol: ''},
        {currency: 'BRL', state: 'Brazil', symbol: 'R$'}, {currency: 'DKK', state: 'Denmark', symbol: ''},
        {currency: 'PLN', state: 'Poland', symbol: 'zł'}, {currency: 'IDR', state: 'Indonesia', symbol: ''},
        {currency: 'THB', state: 'Thailand', symbol: '฿'}, {currency: 'PEN', state: 'Peru', symbol: ''},
        {currency: 'CZK', state: 'Czech Republic', symbol: ''}, {currency: 'TRY', state: 'Turkey', symbol: '₺'},
        {currency: 'AED', state: 'United Arab Emirates', symbol: 'د.إ'},
        {currency: 'COP', state: 'Colombia', symbol: 'COL$'}, {currency: 'BHD', state: 'Bahrain', symbol: '.د.ب'},
        {currency: 'RON', state: 'Romania', symbol: ''}, {currency: 'ARS', state: 'Argentina', symbol: 'ARG$'},
    ]
    const handlePriceOrChangeDisplay = () => {
        onPriceOrChangeDisplay();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    async function handleCurrencyChange(currency, currencySymbol) {
        setLoading(true);
        await onChangeCurrency(currency, currencySymbol);
        setLoading(false);
        closeMenu();
    }

    return (
        <>
            <TouchableOpacity onPress={() => onEditWatchlist()} style={styles.menuItem}>
                <Text style={styles.menuItemText}>Edit your watchlist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePriceOrChangeDisplay} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{isPriceDisplay ? "Switch to change display"
                    : "Switch to Price display"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}
                              style={[styles.menuItem, {borderBottomWidth: 0,}]}>
                <Text style={styles.menuItemText}>Change displayed currency</Text>
            </TouchableOpacity>
            <Modal animationType="fade"
                   transparent={true}
                   visible={isModalVisible}
                   onRequestClose={toggleModal}>
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            {loading ? <View style={styles.LoadingContainer}>
                                <ActivityIndicator size="large" color="#f8adb3"/>
                                <Text style={styles.LoadingText}>
                                    Calculating New Prices...
                                </Text>
                            </View> : <View style={styles.modalContent}>
                                <Text style={styles.modalText}>Choose the desired currency:</Text>
                                <FlatList
                                    data={currencies}
                                    keyExtractor={(item) => item.currency}
                                    renderItem={({item}) => (
                                        <>
                                            <TouchableOpacity style={{
                                                backgroundColor: rgbaColor(0, 0, 0, 0.3),
                                                marginBottom: 5,
                                                width: 320,
                                                justifyContent: 'center',
                                                padding: 5,
                                                flexDirection: 'row',
                                            }}
                                                              onPress={() => handleCurrencyChange(item.currency, item.symbol)}>
                                                <Text style={{
                                                    color: '#f8adb3',
                                                    textAlign: 'center',
                                                    fontSize: 20
                                                }}>{item.currency}</Text>
                                                <Text style={{
                                                    color: '#f8adb3',
                                                    fontSize: 13,
                                                    textAlign: 'center',
                                                    paddingTop: 4,
                                                }}> ({item.state})</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                />
                            </View>}
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        height: 40,
        borderBottomColor: '#f8adb3',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 320, // Customize the width of the panel
        backgroundColor: '#21262f', // Customize the background color
        borderRadius: 10, // Add rounded corners for decoration
        height: 285,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: 'white',
    },
    modalText: {
        color: 'white', // Customize text color
        fontSize: 24,
        padding: 5,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'titleFont',
    },
    LoadingContainer: {
        backgroundColor: '#21262f',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        width: 300,
        height: 180,
        borderRadius: 10,
        borderColor: 'white',
    },
    LoadingText: {
        fontSize: 18, color: '#f8adb3',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'titleFont',
    },
});
export default Menu;