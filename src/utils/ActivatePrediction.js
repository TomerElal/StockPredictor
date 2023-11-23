import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import axios from "axios";
import {useNavigation} from "@react-navigation/native";

function ActivatePrediction({ticker, toggleModal, companyName}) {
    const [prediction, setPrediction] = useState(null);
    const [stockFundamentalData, setStockFundamentalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const handlePredict = async () => {
            try {
                const response = await axios.post('http://51.20.124.155:5000/predict', {
                    features: ticker,
                });
                setStockFundamentalData(response.data["stockFundamentalData"])
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
            <View style={styles.LoadingContainer}>
                <ActivityIndicator size="large" color="#f8adb3"/>
                <Text style={styles.LoadingText}>
                    Calculating Stock Prediction...
                </Text>
            </View>
        );
    }

    function showDescription() {
        toggleModal();
        navigation.navigate('PredictionDetailsScreen', {
            stockFundamentalData: stockFundamentalData,
            companyName: companyName,
        });
    }

    return (
        <View style={styles.PredictContainer}>
            {prediction !== '' ?
                <>
                    <Text style={styles.PredictText}>The stock will {prediction >= 0 ? "rise" : "drop"} by
                        approximately </Text>
                    <Text style={[styles.PredictText, {color: prediction >= 0 ? "green" : "red"}]}>{prediction}%</Text>
                    <Text style={styles.PredictText}> within time period of a year</Text>
                    <TouchableOpacity onPress={showDescription} style={{alignItems: 'center', paddingTop: 10}}>
                        <Text style={{color: '#eb5779', fontSize: 20}}>Press for Description</Text>
                    </TouchableOpacity>
                </>
                :
                <Text style={styles.PredictText}>Couldn't fetch enough data for this specific prediction..</Text>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    LoadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    LoadingText: {
        fontSize: 18, color: '#f8adb3',
        textAlign: 'center',
        marginTop: 10,
        fontFamily: 'titleFont',
    },
    PredictContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 10,
    },
    PredictText: {
        color: '#f8adb3',
        textAlign: 'center',
        fontFamily: 'titleFont',
        fontSize: 24,
    }
})
export default ActivatePrediction;