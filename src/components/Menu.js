import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { rgbaColor } from 'react-native-reanimated/src';

const dimensions = Dimensions.get('window');

/**
 * Menu component for handling various actions.
 *
 * @param {Object} props - Component properties.
 * @param {Function} props.onEditWatchlist - Function to handle editing watchlist.
 * @param {Function} props.onPriceOrChangeDisplay - Function to handle changing price display.
 * @param {Function} props.onChangeCurrency - Function to handle changing displayed currency.
 * @param {boolean} props.isPriceDisplay - Flag indicating whether to display prices or changes.
 * @param {Function} props.closeMenu - Function to close the menu.
 * @returns {React.JSX.Element} - Menu component.
 */
function Menu({ onEditWatchlist, onPriceOrChangeDisplay, onChangeCurrency, isPriceDisplay, closeMenu }) {
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
    ];

    const handlePriceOrChangeDisplay = () => {
        onPriceOrChangeDisplay();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    /**
     * Handle currency change.
     *
     * @param {string} currency - The selected currency code.
     * @param {string} currencySymbol - The currency symbol.
     */
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
                <Text style={styles.menuItemText}>
                    {isPriceDisplay ? 'Switch to change display' : 'Switch to Price display'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal} style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                <Text style={styles.menuItemText}>Change displayed currency</Text>
            </TouchableOpacity>
            <Modal animationType="fade" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator
                                        size={dimensions.width + dimensions.height > 1200 ? 'large' : 'small'}
                                        color="#f8adb3"
                                    />
                                    <Text style={styles.loadingText}>Calculating New Prices...</Text>
                                </View>
                            ) : (
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalText}>Choose the desired currency:</Text>
                                    <FlatList
                                        data={currencies}
                                        keyExtractor={(item) => item.currency}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.currencyItem}
                                                onPress={() => handleCurrencyChange(item.currency, item.symbol)}
                                            >
                                                <Text style={styles.currencyText}>{item.currency}</Text>
                                                <Text style={styles.currencyStateText}> ({item.state})</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        height: dimensions.width + dimensions.height > 1200 ? 40 : 35,
        borderBottomColor: '#f8adb3',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemText: {
        color: 'white',
        fontSize: dimensions.width + dimensions.height > 1200 ? 16 : 14,
        fontFamily: 'menuFont',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: dimensions.width + dimensions.height > 1200 ? 320 : 280,
        backgroundColor: '#21262f',
        borderRadius: 10,
        height: dimensions.width + dimensions.height > 1200 ? 285 : 265,
        paddingTop: 20,
        paddingBottom: 20,
        borderColor: 'white',
    },
    modalText: {
        color: 'white',
        fontSize: dimensions.width + dimensions.height > 1200 ? 24 : 22,
        padding: 5,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'titleFont',
    },
    loadingContainer: {
        backgroundColor: '#21262f',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        width: dimensions.width + dimensions.height > 1200 ? 300 : 250,
        height: dimensions.width + dimensions.height > 1200 ? 180 : 160,
        borderRadius: 10,
        borderColor: 'white',
    },
    loadingText: {
        fontSize: dimensions.width + dimensions.height > 1200 ? 18 : 16,
        color: '#f8adb3',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'titleFont',
    },
    currencyItem: {
        backgroundColor: rgbaColor(0, 0, 0, 0.3),
        marginBottom: 5,
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        paddingRight: dimensions.width + dimensions.height > 1200 ? 0 : 40,
        flexDirection: 'row',
    },
    currencyText: {
        color: '#f8adb3',
        textAlign: 'center',
        fontSize: dimensions.width + dimensions.height > 1200 ? 20 : 18,
    },
    currencyStateText: {
        color: '#f8adb3',
        fontSize: dimensions.width + dimensions.height > 1200 ? 13 : 11,
        textAlign: 'center',
        paddingTop: 4,
    },
});

export default Menu;
