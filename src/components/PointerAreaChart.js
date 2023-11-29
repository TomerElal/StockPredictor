import React from 'react';
import { Dimensions, Platform, View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { Text } from 'react-native';
import ConvertDataToAreaChartData from '../utils/ConvertDataToAreaChartData';
import * as Haptics from 'expo-haptics';

/**
 * Decide color based on change percentage and object type.
 *
 * @param {number} changePercentage - The change percentage.
 * @param {string} obj - Object type ('line', 'startFillColor', or 'endFillColor').
 * @returns {string} Color code based on change percentage and object type.
 */
function decideColor(changePercentage, obj) {
    if (changePercentage >= 0) {
        switch (obj) {
            case 'line':
                return '#00ff83';
            case 'startFillColor':
                return '#4EE62E';
            case 'endFillColor':
                return 'rgba(20,85,81,10)';
        }
    } else {
        switch (obj) {
            case 'line':
                return '#D10C09';
            case 'startFillColor':
                return '#D60F01';
            case 'endFillColor':
                return '#ef233c';
        }
    }
}

/**
 * PointerAreaChart component for displaying a line chart with pointers.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.props - Additional properties.
 * @param {Array} props.props.dailyData - Daily data for the chart.
 * @param {number} props.props.changePercentage - Change percentage.
 * @param {number} props.props.maxVal - Maximum value.
 * @param {number} props.props.minVal - Minimum value.
 * @param {number} props.props.range - Range of the data.
 * @param {string} props.props.currencySymbol - Currency symbol.
 * @returns {React.JSX.Element} PointerAreaChart component.
 */
function PointerAreaChart({ props }) {
    const { dailyData, changePercentage, maxVal, minVal, range, currencySymbol } = props;
    const dimensions = Dimensions.get('window');

    return (
        <View style={styles.container}>
            <LineChart
                areaChart
                data={ConvertDataToAreaChartData(dailyData, range)}
                onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                showScrollIndicator
                rotateLabel
                width={dimensions.width - 50}
                height={dimensions.height / 4.5}
                yAxisOffset={Number(minVal)}
                showFractionalValues={true}
                roundToDigits={2}
                maxValue={maxVal - minVal}
                isAnimated={true}
                animationDuration={1000}
                hideDataPoints
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
                yAxisTextStyle={{ color: 'gray' }}
                yAxisSide="right"
                xAxisColor="lightgray"
                pointerConfig={{
                    pointerStripHeight: 200,
                    activatePointersOnLongPress: true,
                    autoAdjustPointerLabelPosition: true,
                    showPointerStrip: true,
                    stripOverPointer: true,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    pointerColor: 'lightgray',
                    radius: 6,
                    pointerLabelWidth: 0,
                    pointerLabelComponent: (items) => {
                        const price = (Number(items[0].value) + minVal).toFixed(2);
                        return (
                            <View
                                style={styles.pointerLabelContainer}
                            >
                                <View style={styles.pointerLabel}>
                                    <Text style={styles.pointerLabelText}>{price + currencySymbol}</Text>
                                </View>
                                <Text style={styles.pointerDateText}>{items[0].date}</Text>
                            </View>
                        );
                    },
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 50,
        paddingLeft: 5,
    },
    pointerLabelContainer: {
        height: 90,
        width: 130,
        justifyContent: 'center',
        marginLeft: -50,
        marginTop: Platform.OS === 'ios' ? 0 : 40,
    },
    pointerLabel: {
        marginTop: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'white',
    },
    pointerLabelText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pointerDateText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default PointerAreaChart;
