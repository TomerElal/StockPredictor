import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const dimensions = Dimensions.get('window');

/**
 * ActivatePrediction component displays the stock prediction information.
 *
 * @component
 * @param {string} ticker - The stock ticker symbol.
 * @param {function} toggleModal - The function to toggle the modal.
 * @param {string} companyName - The name of the company.
 * @returns {JSX.Element} - Rendered component.
 */
function ActivatePrediction({ ticker, toggleModal, companyName }) {
    const [prediction, setPrediction] = useState(null);
    const [stockFundamentalData, setStockFundamentalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        /**
         * Fetch stock prediction data using the provided ticker.
         */
        const handlePredict = async () => {
            try {
                const response = await axios.post('http://51.20.124.155:5000/predict', {
                    features: ticker,
                });
                setStockFundamentalData(response.data["stockFundamentalData"]);
                setPrediction(response.data["prediction"]);
            } catch (error) {
                setPrediction('');
            } finally {
                setLoading(false);
            }
        };

        handlePredict();
    }, []);

    if (loading) {
        // Show a loading indicator while fetching data
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#f8adb3" />
                <Text style={styles.loadingText}>
                    Calculating Stock Prediction...
                </Text>
            </View>
        );
    }

    /**
     * Show detailed description modal.
     */
    function showDescription() {
        toggleModal();
        navigation.navigate('PredictionDetailsScreen', {
            stockFundamentalData: stockFundamentalData,
            companyName: companyName,
        });
    }

    return (
        <View style={styles.predictContainer}>
            {prediction !== '' ?
                <>
                    <Text style={styles.predictText}>The stock will {prediction >= 0 ? "rise" : "drop"} by
                        approximately </Text>
                    <Text style={[styles.predictText, { color: prediction >= 0 ? "green" : "red" }]}>{prediction}%</Text>
                    <Text style={styles.predictText}> within a time period of a year</Text>
                    <TouchableOpacity onPress={showDescription} style={{ alignItems: 'center', paddingTop: 10 }}>
                        <Text style={styles.buttonText}>Press for Description</Text>
                    </TouchableOpacity>
                </>
                :
                <Text style={styles.predictText}>Couldn't fetch enough data for this specific prediction..</Text>
            }
        </View>
    );
}

// Styles for the component
const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    loadingText: {
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 18 : 16,
        color: '#f8adb3',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'titleFont',
    },
    predictContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10,
    },
    predictText: {
        color: '#f8adb3',
        textAlign: 'center',
        fontFamily: 'titleFont',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 24 : 22,
    },
    buttonText: {
        color: '#eb5779',
        fontSize: (dimensions.width + dimensions.height) > 1200 ? 20 : 18,
    }
});

export default ActivatePrediction;
