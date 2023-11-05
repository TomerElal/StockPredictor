import React, {forwardRef, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EventEmitter from 'react-native-eventemitter';

// Import a custom component
import CurvedLineChart from "../utils/CurvedLineChart";
import ActivatePrediction from "../utils/ActivatePrediction";
import Icon from "react-native-vector-icons/FontAwesome";

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
const StockContainer = forwardRef(({
                                       stockData,
                                       isEditMode,
                                       onDeleteStock,
                                       index,
                                       userStocks,
                                       drag,
                                       isActive,
                                       showLoadDefaultButton
                                   }, ref) => {
    const {logo, ticker, companyName, percentageChange, graphData, currency, exchDisp, companyDescription} = stockData;
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);


    const openStockDetails = () => {
        navigation.navigate('StockDetailsScreen', {
            ticker: ticker,
            companyName: companyName,
            percentageChange: percentageChange,
            graphData: graphData,
            currency: currency,
            exchDisp: exchDisp,
            companyDescription: companyDescription,
            userStocks: userStocks,
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
                    <Text style={{fontSize: 14, color: percentageChange >= 0 ? '#39FF13' : '#eb5779'}}>
                        {percentageChange + '%'}
                    </Text>
                </View>
            </TouchableOpacity>

            {isEditMode ?
                (<TouchableOpacity onPress={() => onDeleteStock(ticker)} style={{marginRight: 20,}}>
                    <Icon name="minus-circle" size={30} color="#eb5779"/>
                </TouchableOpacity>)
                :
                (<>
                    <TouchableOpacity onPress={openStockDetails}>
                        <View style={styles.middleAndRightContainer}>
                            <CurvedLineChart data={graphData} changePercentage={percentageChange}/>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.middleAndRightContainer}>
                        <TouchableOpacity onPress={toggleModal}>
                            <Text style={styles.buttonText}>Predict</Text>
                        </TouchableOpacity>
                    </View>
                </>)}

            <Modal animationType="fade"
                   transparent={true}
                   visible={isModalVisible}
                   onRequestClose={toggleModal}>
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <ActivatePrediction ticker={ticker}/>
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
        padding: 10,
        borderColor: '#ccc',
        marginBottom: 15,
        backgroundColor: '#21262f',
        marginLeft: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    leftContainer: {
        flexDirection: 'row',
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    details: {
        flex: 1,
        marginLeft: 5,
    },
    stockName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    companyName: {
        fontSize: 14,
        color: '#8a8c90',
    },
    middleAndRightContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#f8adb3',
        fontSize: 20,
        fontFamily: 'titleFont',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    modalContent: {
        width: 300, // Customize the width of the panel
        backgroundColor: 'black', // Customize the background color
        borderRadius: 10, // Add rounded corners for decoration
        padding: 20,
    },
    modalText: {
        color: 'black', // Customize text color
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        color: 'black', // Customize close button text color
        fontSize: 16,
        textAlign: 'center',
    },
    moveStockSign: {
        marginRight: 50,
        marginLeft: 10,
        width: 30, // Adjust the size of the icon as needed
        height: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    line: {
        width: '100%',
        height: 4, // Adjust the height of the lines as needed
        backgroundColor: 'black', // Line color
    },
    deleteIcon: {
        color: 'white',
    },
});

export default StockContainer;
