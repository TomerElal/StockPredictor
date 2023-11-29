import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Import a custom component
import CurvedLineChart from "./CurvedLineChart";
import ActivatePrediction from "../utils/ActivatePrediction";
import Icon from "react-native-vector-icons/FontAwesome";

const dimensions = Dimensions.get('window');

/**
 * A component representing a stock container.
 *
 * @param {Object} stockData - Data for the stock.
 * @param {string} stockData.logo - URL of the stock's logo.
 * @param {string} stockData.ticker - Stock ticker symbol.
 * @param {string} stockData.companyName - Company name.
 * @param {number} stockData.percentageChange - Percentage change in stock value.
 * @param {Array} stockData.graphData - Data for the stock's price graph.
 * @returns {JSX.Element} - Rendered component.
 */
const StockContainer = React.memo(({
                                       stockData,
                                       isEditMode,
                                       onDeleteStock,
                                       index,
                                       userStocks,
                                       drag,
                                       isActive,
                                       showLoadDefaultButton,
                                       isPriceDisplay,
                                       currency,
                                       currencySymbol,
                                       exchangeRate,
                                       onUserClickedStock,
                                   }) => {
    const {logo, ticker, companyName, percentageChange, graphData, exchDisp, companyDescription, lastPrice} = stockData;
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);

    const openStockDetails = () => {
        onUserClickedStock();
        navigation.navigate('StockDetailsScreen', {
            ticker: ticker,
            companyName: companyName,
            percentageChange: percentageChange,
            graphData: graphData,
            currency: currency,
            currencySymbol: currencySymbol,
            exchDisp: exchDisp,
            companyDescription: companyDescription,
            userStocks: userStocks,
            exchangeRate: exchangeRate,
        });
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View style={[styles.StockContainer, {marginTop: (index() === 0 && !isEditMode) ? 15 : 0,},
            {marginBottom: (index() === userStocks.length - 1 && isEditMode && !showLoadDefaultButton) ? 75 : 15,}]}>
            {isEditMode ?
                (<TouchableOpacity onPressIn={drag}
                                   disabled={isActive} style={styles.moveStockSign}>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                    <View style={styles.line}/>
                </TouchableOpacity>)
                :
                (<></>)
            }
            <TouchableOpacity onPress={openStockDetails} style={styles.leftContainer}>
                <Image source={{uri: logo}} style={styles.logo}/>
                <View style={styles.details}>
                    <Text style={styles.stockName}>{ticker}</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                    <Text style={{
                        fontSize: (dimensions.width + dimensions.height) > 1200 ? 14 : 12,
                        color: percentageChange >= 0 ? '#39FF13' : '#eb5779'
                    }}>
                        {isPriceDisplay ? (lastPrice * exchangeRate).toFixed(2) + currencySymbol : percentageChange + '%'}
                    </Text>
                </View>
            </TouchableOpacity>

            {isEditMode ?
                (<TouchableOpacity onPress={() => onDeleteStock(ticker)} style={{marginRight: 20,}}>
                    <Icon name="minus-circle" size={(dimensions.width + dimensions.height) > 1200 ? 30 : 27}
                          color="#eb5779"/>
                </TouchableOpacity>)
                :
                (<View style={{flex: 0.8, flexDirection: 'row', alignItems: 'center',}}>
                    <TouchableOpacity onPress={openStockDetails} style={{flex: 1, paddingRight: 10, paddingLeft: 10}}>
                        <CurvedLineChart data={graphData} changePercentage={percentageChange}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal} style={{flex: 1, padding: 10}}>
                        <Text style={styles.buttonText}>Predict</Text>
                    </TouchableOpacity>
                </View>)}

            <Modal animationType="fade"
                   transparent={true}
                   visible={isModalVisible}
                   onRequestClose={toggleModal}>
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <ActivatePrediction ticker={ticker} toggleModal={toggleModal}
                                                    companyName={companyName}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
})

const styles = StyleSheet.create({
    StockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderColor: '#ccc',
        marginBottom: 15,
        backgroundColor: '#21262f',
        marginLeft: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    leftContainer: {
        flex: 0.7,
        flexDirection: 'row',
        alignItems: 'center',
        height: (dimensions.width + dimensions.height) > 1200 ? 60 : 50,
    },
    logo: {
        width: (dimensions.width + dimensions.height) > 1200 ? 50 : 40,
        height: (dimensions.width + dimensions.height) > 1200 ? 50 : 40,
        marginRight: 10,
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
        paddingLeft: 5,
    },
    stockName: {
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 16 : 14,
        fontWeight: 'bold',
        color: 'white',
        shadowRadius: 5,
        shadowOpacity: 1,
        shadowColor: "#eb5779",
        fontStyle: "italic",
        shadowOffset: {
            width: 5,
            height: 0.5,
        },
        elevation: 50,
    },
    companyName: {
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 14 : 12,
        color: '#8a8c90',
        maxHeight: (dimensions.width + dimensions.height) > 1200 ? 35 : 25,
    },
    middleAndRightContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#f8adb3',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 20 : 18,
        fontFamily: 'titleFont',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: (dimensions.width + dimensions.height) > 1200 ? 300 : 250,
        backgroundColor: '#21262f',
        borderRadius: 10,
        padding: 20,
    },
    moveStockSign: {
        marginLeft: 10,
        width: (dimensions.width + dimensions.height) > 1200 ? 50 : 40,
        height: (dimensions.width + dimensions.height) > 1200 ? 50 : 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    line: {
        width: 40,
        marginTop: 5,
        height: (dimensions.width + dimensions.height) > 1200 ? 4 : 3.5,
        backgroundColor: 'black', // Line color
    },
});

export default StockContainer;
