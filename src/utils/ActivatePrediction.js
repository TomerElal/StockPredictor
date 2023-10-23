import React, {useState} from 'react';
import {Text, View} from "react-native";
import axios from "axios";

function ActivatePrediction({ticker}) {
    const [prediction, setPrediction] = useState(null);

    const handlePredict = async () => {
        try {
            // Replace the URL with the address of your Flask app
            const response = await axios.post('http://172.20.10.2:5000/predict', {
                features: ticker,
            });
            setPrediction(response.data.prediction);
        } catch (error) {
            console.error('Error predicting stock:', error);
        }
    };
    handlePredict();
    return (
        <View style={{alignContent:'center'}}>
            <Text style={{color:'white', padding:10}}>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
                sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec,
                vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
            </Text>
            <View style={{justifyContent:'center', flexDirection:'row', paddingTop: 10}}>
                <Text style={{fontSize:24, color:'white',}}>Prediction: </Text>
                <Text style={{fontSize:24, color:'#f8adb3',}}>{prediction}% of stock increase.</Text>
            </View>
        </View>

    );
}

export default ActivatePrediction;