import React from 'react';
import {View} from "react-native";
import { LineChart } from "react-native-gifted-charts"
import {Text} from 'react-native';
import ConvertDataToAreaChartData from "../utils/ConvertDataToAreaChartData";
import * as Haptics from "expo-haptics";

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
    const {dailyData, changePercentage, maxVal, minVal, range} = props;
    return (
        <View
            style={{
                paddingBottom: 55,
                paddingLeft: 5,
            }}>
            <LineChart
                areaChart
                data={ConvertDataToAreaChartData(dailyData, range)}
                onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                showScrollIndicator
                rotateLabel
                width={355}
                yAxisOffset={Number(minVal)}
                showFractionalValues={true}
                roundToDigits={2}
                maxValue={maxVal - minVal}
                isAnimated={true}
                animationDuration={1000}
                hideDataPoints
                adjustToWidth={true}
                spacing={5}
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
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition:true,
                    showPointerStrip:true,
                    stripOverPointer:true,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 0,
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
                                <Text style={{color: 'white', fontSize: 16,textAlign:'center'}}>
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