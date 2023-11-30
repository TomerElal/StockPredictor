import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const dimensions = Dimensions.get('window');

/**
 * StockPredictionDescription component displays the description and fundamental data of a stock prediction.
 *
 * @component
 * @param {object} route - The route parameters passed to the component.
 * @param {object} navigation - The navigation object.
 * @returns {JSX.Element} - Rendered component.
 */
function StockPredictionDescription({ route, navigation }) {
    // Ref for scrollView
    const scrollViewRef = useRef(null);

    // Extracting parameters from route
    const stockFundamentalData = route.params.stockFundamentalData;
    const companyName = route.params.companyName;

    // State variables
    const [isContentNotContained, setIsContentNotContained] = useState(true);
    const [showArrow, setShowArrow] = useState(isContentNotContained);
    const [fundDataHeight, setFundDataHeight] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);

    // Effect to update state variables based on layout sizes
    useEffect(() => {
        const isContentNotContained = scrollHeight < fundDataHeight;
        setIsContentNotContained(isContentNotContained);
        setShowArrow(isContentNotContained);
    }, [scrollHeight, fundDataHeight]);

    // Event handler for scroll
    const handleScroll = (event) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        if (scrollOffset <= 0 && isContentNotContained) {
            setShowArrow(true);
        } else {
            setShowArrow(false);
        }
    };

    // Event handler to scroll to the bottom
    const handleScrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
            setShowArrow(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.descriptionText}>
                The stock prediction is carried out using machine learning with an algorithm known as Random Forest.
                The machine learning model was trained using fundamental information from thousands of stocks over
                the years. The main features on which the fundamental analysis is based are the company's growth
                features from the last calendar year compared to the current time period, among the features you can
                find: growth in profits, growth in revenues, growth in the company's free cash, growth in reducing
                the amount of the company's shares, the company's liabilities against assets, and a profit multiplier P/E.
            </Text>
            <ScrollView
                onLayout={(event) => setScrollHeight(event.nativeEvent.layout.height)}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollViewContainer}
            >
                <View onLayout={(event) => setFundDataHeight(event.nativeEvent.layout.height)}>
                    <Text style={styles.fundamentalDataTitle}>{companyName} - Fundamental Data :</Text>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Revenue Growth: </Text>
                        <Text style={[styles.text, { color: '#eb5779' }]}>{stockFundamentalData[0]}%</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Net Income Growth: </Text>
                        <Text style={[styles.text, {color: '#eb5779'}]}>{stockFundamentalData[1]}%</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Profit Margin Growth: </Text>
                        <Text style={[styles.text, {color: '#eb5779'}]}>{stockFundamentalData[2]}%</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Free Cash Flow Growth: </Text>
                        <Text style={[styles.text, {color: '#eb5779'}]}>{stockFundamentalData[3]}%</Text>
                    </View>

                    <Text style={[styles.text, {paddingLeft: 10, paddingTop: 10,}]}>Common Stock Shares Outstanding </Text>
                    <View style={[styles.textContainer, {padding: 0, paddingLeft: 10, paddingBottom: 10,}]}>
                        <Text style={styles.text}>Growth: </Text>
                        <Text style={[styles.text, {color: '#eb5779'}]}>{stockFundamentalData[4]}%</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>Assets vs Liabilities Growth: </Text>
                        <Text style={[styles.text, {color: '#eb5779'}]}>{stockFundamentalData[5]}%</Text>
                    </View>
                    {showArrow && (
                        <TouchableOpacity style={styles.scrollButton} onPress={handleScrollToBottom}>
                            <Icon name="arrow-down-circle" size={30} color="#eb5779" />
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#21262f',
    },
    descriptionText: {
        color: '#B9BBB6',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 18 : (dimensions.height) < 700 ? 14 : 16,
        padding: 7,
        paddingTop: 20,
        alignSelf: 'center',
        fontFamily: 'descriptionFont',
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    fundamentalDataTitle: {
        textAlign: 'center',
        padding: 10,
        paddingTop: 0,
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 26 : (dimensions.height) < 700 ? 22 : 24,
        color: 'white',
        paddingBottom: 20,
    },
    textContainer: {
        flexDirection: 'row',
        padding: 7,
    },
    text: {
        color: '#f8adb3',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 20 : 18,
        fontFamily: 'titleFont',
    },
    scrollButton: {
        position: 'absolute',
        bottom: 115,
        right: 0,
        padding: 10,
        backgroundColor: '#21262f',
        borderRadius: 30,
    },
});

export default StockPredictionDescription;
