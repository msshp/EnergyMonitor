'use strict';
function getResolution(numberOfRecords) {
    if (numberOfRecords < 2017) { // если кол-во записей меньше недели
        return 7; // 30 мин
    } else if (numberOfRecords >= 2017 && numberOfRecords < 8670) { // больше недели и меньше месяца
        return 61; // 5 часов
    } else { // месяц
        return 289; // день
    }
}

function prepareChartsData(recordsForPeriod, periodData, resolution, idChartP) {
    periodData.reverse();
    let chartDataObj = {
        recordsForPeriod: recordsForPeriod,
        periodData: periodData
    }
    if (recordsForPeriod.length !== periodData.length) {
        return chartDataObj;
    }
    if (idChartP === 46 || idChartP === 47 || idChartP === 48) {
        chartDataObj = {
            recordsForPeriod: [],
            periodData: [],
        }
        let rescnt = 1;
        let v = 0;
        for (let i = 0; i < recordsForPeriod.length; i++) {
            v += periodData[i];
            rescnt++;
            if (rescnt === resolution) {
                chartDataObj.recordsForPeriod.push(recordsForPeriod[i]);
                chartDataObj.periodData.push(v);
                v = 0;
                rescnt = 1;
            }
        }
        if (rescnt !== 5) {
            chartDataObj.recordsForPeriod.push(recordsForPeriod[recordsForPeriod.length - 1]);
            chartDataObj.periodData.push(v);
        }
    }
    return chartDataObj;
}

function drawEnergyChart(recordsForPeriod, periodData, idChartP) {
    let newPeriodData = [];

    for (let i = 0; i < periodData.length; i++) {
        if (i === 0) {
            newPeriodData.push(periodData[i]);
        } else {
            newPeriodData.push(newPeriodData[newPeriodData.length - 1] + periodData[i]);
        }
    }
    canvasChart = document.createElement('canvas');
    chartBlock = document.createElement('div');
    chartBlock.id = `chart-block-${idChartP + 100}`;
    if (periodData != null) {
        chart = new Chart(canvasChart, {
            type: cType,
            data: {
                labels: recordsForPeriod, // массив с параметрами на оси х
                datasets: [{
                    label: 'Общее ' + labelY,
                    data: newPeriodData, // массив с данными y
                    borderColor: cColor,
                    backgroundColor: 'transparent',
                    hoverBackgroundColor: cColor,
                    borderWidth: 2, // ширина полоски
                    pointBorderWidth: 1,
                    pointHitRadius: 1,
                    pointBorderColor: 'transparent',
                    cubicInterpolationMode: 'monotone'
                }]
            },
            options: {
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Время записи',
                            padding: 10
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Общее ' + labelY,
                            padding: 15
                        }
                    },
                }
            }
        });

        canvasChart.textContent = chart;
        chartBlock.appendChild(canvasChart);
        chartBlock.hidden = true;
        for (let m = 0; m < idForCharts[0].length; m++) {
            if (idChartP === idForCharts[0][m]) {
                chartBlock.hidden = false;
            }
        }
        chartsContainer.appendChild(chartBlock);
    }
}