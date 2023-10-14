import React from 'react';
import {View} from "react-native";
import { LineChart } from "react-native-gifted-charts"
import {Text} from 'react-native';
import ConvertDataToAreaChartData from "./ConvertDataToAreaChartData";

function decideColor(changePercentage, obj) {
    if (changePercentage >= 0) {
        switch (obj) {
            case "line":
                return "#00ff83";
            case "startFillColor":
                return "#4EE62E";
            case "endFillColor":
                return "rgba(20,85,81,10)";
        }
    } else {
        switch (obj) {
            case "line":
                return "#D10C09";
            case "startFillColor":
                return "#D60F01";
            case "endFillColor":
                return "#ef233c";
        }
    }
}
function PointerAreaChart({props}) {
    const {dailyData, changePercentage} = props;
    const yValues = dailyData.map(item => item.y);
    const minVal = Math.min(...yValues);
    const maxVal = Math.max(...yValues);
    return (
        <View
            style={{
                paddingVertical: 100,
                paddingLeft: 20,
            }}>
            <LineChart
                areaChart
                data={ConvertDataToAreaChartData(dailyData)}
                showScrollIndicator
                rotateLabel
                width={300}
                yAxisOffset={Number(minVal)}
                showFractionalValues={true}
                roundToDigits={2}
                maxValue={maxVal - minVal}
                isAnimated={true}
                animationDuration={1500}
                hideDataPoints
                adjustToWidth={true}
                spacing={3.5}
                color={decideColor(changePercentage, 'line')}
                yAxisLabelWidth={48}
                thickness={2}
                startFillColor={decideColor(changePercentage, 'startFillColor')}
                endFillColor={decideColor(changePercentage, 'endFillColor')}
                startOpacity={0.5}
                endOpacity={0.06}
                initialSpacing={0}
                noOfSections={6}
                yAxisColor="white"
                yAxisThickness={0}
                rulesType="solid"
                rulesColor="gray"
                yAxisTextStyle={{color: 'gray'}}
                yAxisSide='right'
                xAxisColor="lightgray"
                pointerConfig={{
                    pointerStripHeight: 200,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 0,
                    stripOverPointer:true,
                    pointerLabelComponent: items => {
                        const price = (Number(items[0].value) + minVal).toFixed(2)
                        return (
                            <View
                                style={{
                                    height: 90,
                                    width: 100,
                                    justifyContent: 'center',
                                    marginTop: -30,
                                    marginLeft: -40,
                                }}>
                                <View style={{marginTop:20,paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                                    <Text style={{fontWeight: 'bold',textAlign:'center'}}>
                                        {'$' + price}
                                    </Text>
                                </View>
                                <Text style={{color: 'white', fontSize: 16, marginBottom:0,textAlign:'center'}}>
                                    {items[0].date}
                                </Text>


                            </View>
                        );
                    },
                }}
            />
            </View>
    );
}

export default PointerAreaChart;