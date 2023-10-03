import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-svg-charts';
import * as shape from 'd3-shape';

const CurvedLineChart = ({ data }) => {
    const _data = data.filter((d, i) => i%3 === 0)
    return (
        <View style={{  }}>
            <LineChart
                style={{ flex: 1, height: 200, width: 100 }}
                data={_data}
                yAccessor={({item}) => item.y}
                xAccessor={({index}) => _data[index].x}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 0, bottom: 0, left: 10, right: 10 }}
                curve={shape.curveBasis} // You can change the curve type as needed
            />
        </View>
    );
};

export default CurvedLineChart;