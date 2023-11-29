import React from 'react';
import {LineChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {Dimensions, Platform, View} from "react-native";

const dimensions = Dimensions.get('window');

/**
 * CurvedLineChart component that renders a line chart with a curve.
 *
 * @param {object} data - Data points for the chart.
 * @param changePercentage
 * @returns {React.JSX.Element} CurvedLineChart component.
 */
const CurvedLineChart = ({data, changePercentage}) => {
    // Filter data to display every third point
    const _data = data.filter((d, i) => i % 3 === 0);

    return (
        <LineChart
            style={{
                flex: 1,
                elevation: 5,
                shadowColor: '#f89734',
                shadowOpacity: 1,
                height: (dimensions.width + dimensions.height) > 1200 ? 60 : 40,
                width: (dimensions.width + dimensions.height) > 1200 ? 100 : 90
            }}
            data={_data}
            yAccessor={({item}) => item.y}
            xAccessor={({item}) => item.x}
            svg={{stroke: '#eb5779'}}
            contentInset={{top: 0, bottom: 0, left: 10, right: 20}}
            curve={shape.curveBasis}
        />
    );
};

export default CurvedLineChart;
