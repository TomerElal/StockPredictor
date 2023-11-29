import {StyleSheet} from "react-native";

/**
 * Convert data to the format suitable for rendering area chart.
 *
 * @param {Array} data - The input data array.
 * @param {string} range - The time range for the data.
 * @returns {Array} - Formatted data for the area chart.
 */
function ConvertDataToAreaChartData(data, range) {
    return data.map((item, index) => {
        let time;
        const date = new Date(item.x * 1000);

        // Determine the time format based on the specified range
        if (range === '1d') {
            time = date.getHours() + ':' + (date.getMinutes() === 0 ? date.getMinutes() + '0' : date.getMinutes());
        } else if (range === '5d' || range === '1mo' || range === '6mo' || range === 'ytd') {
            time = date.getDate() + '/' + (date.getMonth() + 1);
        } else {
            time = (date.getMonth() + 1) + '/' + (date.getFullYear() - 2000);
        }

        // Format data based on index
        if (index % 12 === 0) {
            return {
                value: item.y,
                date: time,
                label: time,
                labelTextStyle: styles.labelTextStyle,
            };
        } else {
            return { value: item.y, date: time };
        }
    });
}

// Styles for the component
const styles = StyleSheet.create({
    labelTextStyle: {
        color: 'lightgray',
        width: 40,
    },
});

export default ConvertDataToAreaChartData;
