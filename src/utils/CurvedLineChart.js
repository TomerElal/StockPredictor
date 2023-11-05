import React from 'react';
import {LineChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';

/**
 * CurvedLineChart component that renders a line chart with a curve.
 *
 * @param {object} data - Data points for the chart.
 * @param changePercentage
 * @returns {React.Component} CurvedLineChart component.
 */
const CurvedLineChart = ({data, changePercentage}) => {
    // Filter data to display every third point
    const _data = data.filter((d, i) => i % 3 === 0);

    return (
        <LineChart
            style={{flex: 1, height: 60, width: 100}}
            data={_data}
            yAccessor={({item}) => item.y}
            xAccessor={({item}) => item.x}
            svg={{stroke: changePercentage>=0?'#eb5779':'#eb5779'}}
            contentInset={{top: 0, bottom: 0, left: 10, right: 20}}
            curve={shape.curveBasis}
        />
    );
};

export default CurvedLineChart;
