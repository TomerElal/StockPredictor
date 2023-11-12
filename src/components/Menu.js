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
    const currencies = [{currency: 'USD', state: 'United States'}, {currency: 'EUR', state: 'Europe'},
        {currency: 'GBP', state: 'United Kingdom'}, {currency: 'CAD', state: 'Canada'},
        {currency: 'JPY', state: 'Japan'},]
    const handlePriceOrChangeDisplay = () => {
        onPriceOrChangeDisplay();
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    async function handleCurrencyChange(currency){
        setLoading(true);
        await onChangeCurrency(currency);
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
                            {loading? <View style={styles.LoadingContainer}>
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
                                                width: 300,
                                                justifyContent: 'center',
                                                padding: 5,
                                                flexDirection: 'row',
                                            }}
                                                              onPress={()=>handleCurrencyChange(item.currency)}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: 300, // Customize the width of the panel
        backgroundColor: '#21262f', // Customize the background color
        borderRadius: 10, // Add rounded corners for decoration
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:20,
        paddingBottom:10,
        borderColor:'white',
    },
    modalText: {
        color: 'white', // Customize text color
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'titleFont',
    },
    LoadingContainer: {
        backgroundColor:'#21262f',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        width: 300,
        height: 180,
        borderRadius: 10,
        borderColor:'white',
    },
    LoadingText: {
        fontSize: 18, color: '#f8adb3',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'titleFont',
    },
});
export default Menu;