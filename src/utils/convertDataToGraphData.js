
function ConvertDataToGraphData(data) {
    const timeSeries = data["Time Series (5min)"];
    const dates = Object.keys(timeSeries);
    const dataToGraph = dates.map(date => ({
        x: new Date(date).getTime(),
        y: Number(timeSeries[date]["4. close"])
    }))
    return dataToGraph.reverse();
}

export default ConvertDataToGraphData;