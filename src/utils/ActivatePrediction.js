import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View, StyleSheet} from "react-native";
import axios from "axios";

function ActivatePrediction({ticker}) {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handlePredict = async () => {
            try {
                // Replace the URL with the address of your Flask app
                const response = await axios.post('http://172.20.10.2:5000/predict', {
                    features: ticker,
                });
                setPrediction(response.data.prediction);
            } catch (error) {
                console.error('Error predicting stock:', error);
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

    return (
        <View style={styles.PredictContainer}>
            <Text style={styles.PredictText}>The stock will {prediction >= 0 ? "rise" : "drop"} by
                approximately </Text>
            <Text style={[styles.PredictText, {color:prediction >= 0? "green":"red"}]}>{prediction}%</Text>
            <Text style={styles.PredictText}> within a period of two years</Text>
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
        padding:10,
    },
    PredictText: {
        color: '#f8adb3',
        textAlign: 'center',
        fontFamily: 'titleFont',
        fontSize:24,
    }
})
export default ActivatePrediction;