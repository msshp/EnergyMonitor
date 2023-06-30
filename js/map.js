'use strict';

let blockWidgetDevInfo = document.querySelector('.widget__dev-info');
let currentReadings = document.querySelector('.current-readings');
let mapChartWidget = document.querySelector('.map-chart');
let notChosen = document.querySelector('.not-chosen');

let widgetDevInfo;
let widgetCurrentReadings;
let widgetChart;
let contentWidgetDevInfo;

let idObjc;
let counterm;
let counterChart;

let widgetLoading;
let widgetLoader;

// массивы
let parameterNameInfo; // заголовки
let parameterInfo; // значения
let parameterInfoLine; // заголовок + значение
let allWidgetData;

let parameterNameCurrentReadings;
let wCR;
let latestDeviceData;
let numberOfRecordsForEG;

let getwidgetDevInfoR = new XMLHttpRequest();
let getWCR = new XMLHttpRequest();
let getChartValues = new XMLHttpRequest();
let postNewCoord = new XMLHttpRequest();

let countr;
const viewWidgetIdParameters = [17, 23, 46, 18, 24, 47, 19, 35, 48, 56];
const idParForWidgetChart = [46, 47, 48];

let mapChartContainer = document.getElementById('widget-chart');
let massivForEG;
let recordsForPeriodForEG;
let chartMapBlock = null;

function prepareWidgetTitles() {

    currentReadings.hidden = true;
    mapChartWidget.hidden = true;

    // loader
    if (blockWidgetDevInfo.contains(notChosen)) {
        blockWidgetDevInfo.removeChild(notChosen);
    } else if (blockWidgetDevInfo.contains(contentWidgetDevInfo)) {
        blockWidgetDevInfo.removeChild(contentWidgetDevInfo); // удаление информации
    }
    // chart
    if (chartMapBlock != null) {
        mapChartContainer.removeChild(chartMapBlock);
    }

    widgetLoading = document.createElement('div');
    widgetLoading.classList.add('widget-loading');
    widgetLoader = document.createElement('div');
    widgetLoader.classList.add('widget-loader');
    widgetLoading.appendChild(widgetLoader);
    blockWidgetDevInfo.appendChild(widgetLoading);

    parameterNameInfo = [];
    for (let i = 0; i < viewDevicePageTitle.length; i++) {
        for (let p = 0; p < parametersDesc.length; p++) {
            if (parametersDesc[p].id_parameter === viewDevicePageTitle[i]) {
                parameterNameInfo.push(parametersDesc[p].parameter);
                break;
            }
        }
    }
    parameterNameCurrentReadings = [];
    for (let i = 0; i < viewWidgetIdParameters.length; i++) {
        for (let p = 0; p < parametersDesc.length; p++) {
            if (parametersDesc[p].id_parameter === viewWidgetIdParameters[i]) {
                parameterNameCurrentReadings.push(parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')')
                break;
            };
        }
    }
}

function getWidjetsForMap(idObjMap) {
    prepareWidgetTitles();
    idObjc = idObjMap;
    widgetDevInfo = {
        complate: false
    };
    widgetCurrentReadings = {
        complate: false
    };
    widgetChart = {
        complate: false
    };
    counterm = 0;
    parameterInfo = [];
    getwidgetDevInfo(viewDevicePageTitle[counterm]);
    getWidgetCurrentReadings(idObjc);
    getWidgetChart(idObjc);
}

function getwidgetDevInfo(idPar) {
    getwidgetDevInfoR.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObjc}&id_parameter=${idPar}`);
    getwidgetDevInfoR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getwidgetDevInfoR.setRequestHeader('Authorization', 'Token ' + token);
    getwidgetDevInfoR.send();
}

getwidgetDevInfoR.onreadystatechange = function () {
    if (getwidgetDevInfoR.readyState === 4 && getwidgetDevInfoR.status === 200) {
        let payload = JSON.parse(getwidgetDevInfoR.responseText);
        let widgetDevInfoArr = payload.results;
        if (widgetDevInfoArr.length === 0) {
            let emObj = {
                value: ''
            }
            widgetDevInfoArr.push(emObj);
        }
        parameterInfo.push(widgetDevInfoArr[0].value);
        counterm++;
        if (counterm < viewDevicePageTitle.length) { // если счётчик меньше чем кол-во параметров в заголовке, то заново вызываем
            getwidgetDevInfo(viewDevicePageTitle[counterm]);
        } else {
            parameterInfoLine = [];
            for (let j = 0; j < parameterInfo.length; j++) {
                if (!(parameterInfo[j] === '')) {  // если не пустое значение то
                    parameterInfoLine.push([parameterNameInfo[j], parameterInfo[j]]);
                }
            }
            contentWidgetDevInfo = document.createElement('table');
            contentWidgetDevInfo.classList.add('dev-info__table');
            let tableInfoBody = document.createElement('tbody');
            for (let p = 0; p < parameterInfoLine.length; p++) {
                let devInfoLine = document.createElement('tr');
                devInfoLine.innerHTML = `<td>${parameterInfoLine[p][0]}</td><td class="right-value">${parameterInfoLine[p][1]}</td>`
                tableInfoBody.appendChild(devInfoLine);
            }
            contentWidgetDevInfo.appendChild(tableInfoBody);
            widgetDevInfo = {
                complate: true
            }
            checkComplateWidgets();
        }
    }
}

function getWidgetCurrentReadings(idObjc) {
    getWCR.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObjc}&limit=25`);
    getWCR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getWCR.setRequestHeader('Authorization', 'Token ' + token);
    getWCR.send();
}

getWCR.onreadystatechange = function () {
    if (getWCR.readyState === 4 && getWCR.status === 200) {
        let payload = JSON.parse(getWCR.responseText);
        wCR = payload.results;  // массив с 25 объектами
        let currentReadingsContent = document.getElementById('current-readings__content');
        currentReadingsContent.textContent = '';
        for (let p = 0; p < viewWidgetIdParameters.length; p++) {
            let presentValue = getDesiredId(viewWidgetIdParameters[p], wCR);
            if (typeof presentValue !== "undefined") {
                let presentValueLine = document.createElement('tr');
                presentValueLine.innerHTML = `<td>${parameterNameCurrentReadings[p]}</td><td class="right-value">${Number(presentValue.value).toFixed(1)}</td>`
                currentReadingsContent.appendChild(presentValueLine);
            }
        }

        let currentReadingsTime = document.getElementById('current-readings-time');
        let now = new Date();
        let requestTime = new Date(wCR[0].datetime_data); //
        let timeDiff = Math.floor((now - requestTime) / (1000 * 60));
        if (timeDiff > 10) {
            currentReadingsTime.classList.add('old-time');
            currentReadingsTime.classList.remove('actual-time');
        } else {
            currentReadingsTime.classList.add('actual-time');
            currentReadingsTime.classList.remove('old-time');
        }
        currentReadingsTime.textContent = addZero(requestTime.getDate()) + '/' + addZero(requestTime.getMonth() + 1) + '/' + addZero(requestTime.getFullYear()) + ' ' + addZero(requestTime.getHours()) + ':' + addZero(requestTime.getMinutes());

        widgetCurrentReadings = {
            complate: true
        }
        checkComplateWidgets();
    }
}

function getDesiredId(element, wCR) {
    for (let i = 0; i < wCR.length; i++) {
        if (wCR[i].id_parameter === element) {
            return wCR[i];
        }
    }
}

function getWidgetChart(idObjc) { // получение оси х (временные периоды)
    massivForEG = [];
    recordsForPeriodForEG = [];
    let lastTimeForEG = new Date(parseInt(new Date().getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
    let firstTimeForEG = new Date(lastTimeForEG.getFullYear(), lastTimeForEG.getMonth(), lastTimeForEG.getDate(), lastTimeForEG.getHours() - 2, lastTimeForEG.getMinutes());
    let timeIntervalForEG = Math.floor((lastTimeForEG - firstTimeForEG) / (1000 * 60)); // заданный период в минутах
    numberOfRecordsForEG = timeIntervalForEG / 5 + 1; // сколько в интервале отметок, кратных 5

    for (let numb = 0; numb < numberOfRecordsForEG; numb++) { // за 2 часа
        let newRecForEG = new Date(firstTimeForEG.getFullYear(), firstTimeForEG.getMonth(), firstTimeForEG.getDate(), firstTimeForEG.getHours(), firstTimeForEG.getMinutes() + 5 * (numb));
        recordsForPeriodForEG.push(addZero(newRecForEG.getDate()) + '/' + addZero(newRecForEG.getMonth() + 1) + ' ' + addZero(newRecForEG.getHours()) + ':' + addZero(newRecForEG.getMinutes()));
        massivForEG.push(newRecForEG);
        if (recordsForPeriodForEG[numberOfRecordsForEG]) {
            break;
        }
    }
    massivForEG.reverse();

    counterChart = 0; // получение осей y
    allWidgetData = []; // общий массив для всех параметров
    getChartValuesFunc(idParForWidgetChart[counterChart]);
}

function getChartValuesFunc(idPar) {
    getChartValues.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObjc}&id_parameter=${idPar}&limit=${numberOfRecordsForEG}`);
    getChartValues.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getChartValues.setRequestHeader('Authorization', 'Token ' + token);
    getChartValues.send();
}

getChartValues.onreadystatechange = function () {
    if (getChartValues.readyState === 4 && getChartValues.status === 200) {
        let payload = JSON.parse(getChartValues.responseText);
        let widgetChartData = dateCorr(payload.results); // данные за последние 2 часа
        if (widgetChartData) {
            let rightWCD = [];

            for (let i = 0; i < massivForEG.length; i++) { // проходим по созданному массиву
                let valY = null;
                for (let d = 0; d < widgetChartData.length; d++) { // проходим по полученным датам
                    if (massivForEG[i].setSeconds(0) === widgetChartData[d].datetime_data.setSeconds(0)) {
                        valY = Number(Number(widgetChartData[d].value).toFixed(1));
                        break;
                    }
                }
                rightWCD.push(valY);
            }
            allWidgetData.push(rightWCD); // добавление values в общий массив со всеми параметрами
        }
        counterChart++;
        if (counterChart < idParForWidgetChart.length) {
            getChartValuesFunc(idParForWidgetChart[counterChart]);
        } else {
            drawMapGraph();
        }
    }
}

function drawMapGraph() {

    let canvasMapChart = document.createElement('canvas');
    chartMapBlock = document.createElement('div');

    if (allWidgetData != null) {
        let chartMap = new Chart(canvasMapChart, {
            type: 'line',
            data: {
                labels: recordsForPeriodForEG, // массив с параметрами на оси х
                datasets: [{
                    label: 'Канал 1',
                    data: allWidgetData[0], // массив с данными y
                    borderColor: '#1976d2',
                    backgroundColor: 'transparent',
                    hoverBackgroundColor: '#1976d2',
                    borderWidth: 2, // ширина полоски
                    pointBorderWidth: 1,
                    pointHitRadius: 1,
                    pointBorderColor: 'transparent',
                    cubicInterpolationMode: 'monotone'
                },
                {
                    label: 'Канал 2',
                    data: allWidgetData[1], // массив с данными y
                    borderColor: '#d21976',
                    backgroundColor: 'transparent',
                    hoverBackgroundColor: '#d21976',
                    borderWidth: 2, // ширина полоски
                    pointBorderWidth: 1,
                    pointHitRadius: 1,
                    pointBorderColor: 'transparent',
                    cubicInterpolationMode: 'monotone'
                },
                {
                    label: 'Канал 3',
                    data: allWidgetData[2], // массив с данными y
                    borderColor: '#76d219',
                    backgroundColor: 'transparent',
                    hoverBackgroundColor: '#76d219',
                    borderWidth: 2, // ширина полоски
                    pointBorderWidth: 1,
                    pointHitRadius: 1,
                    pointBorderColor: 'transparent',
                    cubicInterpolationMode: 'monotone'
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            boxWidth: 10,
                            boxHeight: 10,
                        }
                    }
                },
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
                            text: labelY,
                            padding: 15
                        }
                    },
                }
            }
        });

        canvasMapChart.textContent = chartMap;
        chartMapBlock.appendChild(canvasMapChart);
        mapChartContainer.appendChild(chartMapBlock);
    }

    widgetChart = {
        complate: true
    };
    checkComplateWidgets();
}

function checkComplateWidgets() {
    if (widgetDevInfo.complate && widgetCurrentReadings.complate && widgetChart.complate) {
        if (blockWidgetDevInfo.contains(widgetLoading)) {
            blockWidgetDevInfo.removeChild(widgetLoading);
            blockWidgetDevInfo.appendChild(contentWidgetDevInfo);
        }
        currentReadings.hidden = false;
        mapChartWidget.hidden = false;
    }
}

let currObj;
function changeLocation(idObj) {
    currObj = idObj;
    mapLoad.classList.add('put-label');
    mapL.addEventListener('click ', getCoordinates);
}

function getCoordinates(ev) {
    mapLoad.classList.remove('put-label');
    let lat = ev.latlng.lat;
    let lng = ev.latlng.lng;
    mapL.removeEventListener('click ', getCoordinates);
    sendNewCoord(lat, lng);
}

function sendNewCoord(lat, lng) {
    let newCoord = JSON.stringify({
        "value": `${lat}, ${lng}`,
        "id_object": currObj,
        "id_parameter": 13
    });
    postNewCoord.open("POST", "http://" + current_host + `/api/v1/data/?id_object=${currObj}&id_parameter=13`);
    postNewCoord.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    postNewCoord.setRequestHeader('Authorization', 'Token ' + token);
    postNewCoord.send(newCoord);
    window['mapMarker_' + currObj].setLatLng([lat, lng]);
}

postNewCoord.onreadystatechange = () => {
    if (postNewCoord.readyState === 4 && postNewCoord.status !== 201) {
        alert('Ошибка');
    }
}
