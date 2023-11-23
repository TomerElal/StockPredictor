function ConvertDataToAreaChartData(data, range) {
    return data.map((item, index) => {
        let time;
        const date = new Date(item.x * 1000);
        if (range === '1d') {
            time = date.getHours() + ':' + (date.getMinutes() === 0 ? date.getMinutes() + '0' : date.getMinutes());
        } else if (range === '5d' || range === '1mo' || range === '6mo' || range === 'ytd') {
            time = date.getDate() + '/' + (date.getMonth() + 1);
        } else {
            time = (date.getMonth() + 1) + '/' + (date.getFullYear() - 2000);
        }
        if (index % 12 === 0) {
            return {
                value: item.y,
                date: time,
                label: time,
                labelTextStyle: {color: 'lightgray', width: 40},
            }
        } else {
            return {value: item.y, date: time}
        }
    })
}

export default ConvertDataToAreaChartData;