import React from 'react';

function ConvertDataToAreaChartData(data) {
    return data.map((item, index) => {
        const date = new Date(item.x * 1000);
        const hour = date.getHours() + ':' + (date.getMinutes() === 0 ? date.getMinutes() + '0':date.getMinutes());
        if(index % 12 === 0){
            return {
                value: item.y,
                date: hour,
                label: hour,
                labelTextStyle: {color: 'lightgray', width: 40},
            }
        }else{
            return {value: item.y, date: hour}
        }
    })
}

export default ConvertDataToAreaChartData;