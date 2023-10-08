/**
 * Converts data from Yahoo Finance API to graph data format.
 *
 * @param {Object} data - Data received from Yahoo Finance API.
 * @returns {Array} An array of data points suitable for rendering a graph.
 */
function convertDataToGraphData(data) {
    // Check if the data structure is valid, otherwise return an empty array.
    if (!data || !data["chart"] || !data["chart"]["result"] || !data["chart"]["result"][0]) {
        return [];
    }

    // Extract timestamps and closing prices from the data.
    const result = data["chart"]["result"][0];
    const timestamps = result.timestamp;
    const prices = result["indicators"]["quote"][0]["close"];

    // Check if the extracted data is valid, otherwise return an empty array.
    if (!timestamps || !prices || timestamps.length !== prices.length) {
        return [];
    }

    // Create an array of data points with timestamp (x-axis) and price (y-axis).
    return timestamps.map((timestamp, index) => ({
        x: timestamp,
        y: prices[index],
    }));
}

export default convertDataToGraphData;
