'use strict';

let eventsLoading = document.getElementById('events-loading');
let afterEventsLoading = document.getElementById('after-events-loading');

let eventsFilterDevice = document.getElementById('events__filter-device');
let eventsFilterParameter = document.getElementById('events__filter-parameter');
let dropdownDevice = document.getElementById('dropdown__device');
let dropdownParameter = document.getElementById('dropdown__parameter');
let iconExpandDevice = document.getElementById('icon-expand__device');
let iconExpandParameter = document.getElementById('icon-expand__parameter');

let checkIdRecord = new XMLHttpRequest();
let reqGetNewEvents = new XMLHttpRequest();

let eventsTableTbody = document.getElementById('events-table__tbody');
let evDev;
let evPar;
let evVal;

let lastIDRec;
let newIDRec;
let eventsLimit;

let colorLine;
let filterItems = [];
let parId;

let redParams = [55, 75, 25, 27, 28, 29, 30, 31, 32, 33, 34];

class EventClass {
    constructor() {
        this.tm = 0;
        this.idObjStorage = [];
        this.idParStorage = [];
        this.mainStorage = [];
        this.timeout = 10000;
        this.interval = null;
        this.isRun = false;
    }

    getIdObjects() {
        this.idObjStorage = [];
        let str = document.querySelectorAll('.marked-obj');
        for (let i = 0; i < str.length; i++) {
            this.idObjStorage.push(Number(str[i].id.split('-')[2]));
        }
    }
    getIdParameters() {
        this.idParStorage = [];
        let strg = document.querySelectorAll('.marked-par');
        for (let i = 0; i < strg.length; i++) {
            this.idParStorage.push(Number(strg[i].id.split('-')[2]));
        }
    }

    viewSome() {
        var self = this;
        self.getIdObjects();
        self.getIdParameters();
        let requests = [];
        let counter = 0;
        self.mainStorage = [];
        for (let i = 0; i < self.idObjStorage.length; i++) {
            for (let r = 0; r < self.idParStorage.length; r++) {
                requests.push(new XMLHttpRequest());
                let context = requests[requests.length - 1];
                requests[requests.length - 1].open("GET", "http://" + current_host + `/api/v1/data/?id_object=${self.idObjStorage[i]}&id_parameter=${self.idParStorage[r]}&limit=10`);
                requests[requests.length - 1].setRequestHeader('Content-Type', 'application/json; charset=utf-8');
                requests[requests.length - 1].setRequestHeader('Authorization', 'Token ' + token);
                requests[requests.length - 1].send();

                requests[requests.length - 1].onreadystatechange = function () {
                    if (context.readyState === 4 && context.status === 200) {
                        let payload = JSON.parse(context.responseText);
                        self.mainStorage = self.mainStorage.concat(payload.results);
                        counter++;
                        if (counter === requests.length) {
                            drawEvents(self.mainStorage);
                            if (sessionStorage.getItem('savePage') === '6') {
                                self.tm = setTimeout(function () { self.viewSome(); }, self.timeout * 1000);
                            }
                        }
                    }
                }
            }
        }
    }

    start(timeout) { // таймаут в секундах
        this.isRun = true;
        this.timeout = timeout;
        this.viewSome();
    }
    stop() { // очищает таймаут
        this.isRun = false;
        clearTimeout(this.tm);
    }
}

let evnt = new EventClass();

// events on filter
eventsFilterDevice.addEventListener('click', () => {
    dropdownDevice.classList.toggle('dropdown__list_visible');
    iconExpandDevice.classList.toggle('icon-expand_transform');
})

eventsFilterParameter.addEventListener('click', () => {
    dropdownParameter.classList.toggle('dropdown__list_visible');
    iconExpandParameter.classList.toggle('icon-expand_transform');
})

function showEvents() {
    savePage = '6';
    sessionStorage.setItem('savePage', savePage);
    sidenavMap.classList.remove('active-sidenav-btn');
    iconExplore.classList.remove('active-sidenav-btn');
    sidenavDevices.classList.remove('active-sidenav-btn');
    iconLightbulb.classList.remove('active-sidenav-btn');
    sidenavProject.classList.remove('active-sidenav-btn');
    iconWork.classList.remove('active-sidenav-btn');
    sidenavEvents.classList.add('active-sidenav-btn');
    iconList.classList.add('active-sidenav-btn');

    deviceTable.hidden = true;
    deviceSpecificParams.hidden = true;
    project.hidden = true;
    map.hidden = true;
    events.hidden = false;

    dropdownDevice.textContent = '';
    dropdownParameter.textContent = '';

    for (let b = 0; b < objectsList.length; b++) {
        let dropdownListItem = document.createElement('li');
        dropdownListItem.classList.add('dropdown__list-item');
        dropdownListItem.classList.add('marked-obj');
        dropdownListItem.id = `obj-item-${objectsList[b].id_object}`;
        dropdownListItem.innerHTML = `${objectsList[b].object_description}<i class="icon-checkbox"></i>`;
        dropdownDevice.appendChild(dropdownListItem);

        dropdownListItem.addEventListener('click', () => {
            let iconSwitch = dropdownListItem.lastElementChild;
            parId = dropdownListItem.id.split('-')[2];
            if (iconSwitch.classList.contains('icon-checkbox-blank')) {
                iconSwitch.classList.remove('icon-checkbox-blank');
                dropdownListItem.classList.add('marked-obj');
                iconSwitch.classList.add('icon-checkbox');
                showSelectedDevices(); // показать строки с этим id par 
            } else {
                iconSwitch.classList.add('icon-checkbox-blank');
                dropdownListItem.classList.remove('marked-obj');
                iconSwitch.classList.remove('icon-checkbox');
                removeUnselectedDevices(); // убрать строки с этим id par
            }
        })
    }

    for (let p = 0; p < parametersDesc.length; p++) {
        let dropdownPListItem = document.createElement('li');
        dropdownPListItem.classList.add('dropdown__list-item');
        dropdownPListItem.id = `par-item-${parametersDesc[p].id_parameter}`;
        if (parametersDesc[p].id_parameter === 54 || parametersDesc[p].id_parameter === 55) {
            dropdownPListItem.innerHTML = `${parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')'}<i class="icon-checkbox"></i>`;
            dropdownPListItem.classList.add('marked-par');
        } else {
            dropdownPListItem.innerHTML = `${parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')'}<i class="icon-checkbox-blank"></i>`;
        }
        dropdownParameter.appendChild(dropdownPListItem);

        dropdownPListItem.addEventListener('click', () => {
            let iconSwitch = dropdownPListItem.lastElementChild;
            parId = dropdownPListItem.id;
            if (iconSwitch.classList.contains('icon-checkbox-blank')) {
                iconSwitch.classList.remove('icon-checkbox-blank');
                iconSwitch.classList.add('icon-checkbox');
                dropdownPListItem.classList.add('marked-par');
                showSelectedParameters(); // показать строки с этим id par 
            } else {
                iconSwitch.classList.add('icon-checkbox-blank');
                iconSwitch.classList.remove('icon-checkbox');
                dropdownPListItem.classList.remove('marked-par');
                removeUnselectedParameters(); // убрать строки с этим id par
            }
        })
    }

    let deviceStorage = dropdownDevice.querySelectorAll(".dropdown__list-item");
    let parameterStorage = dropdownParameter.querySelectorAll(".dropdown__list-item");

    evnt.start(5);
}

function drawEvents(mainStorage) {
    mainStorage.sort((a, b) => {
        if (a.id_record > b.id_record) {
            return 1;
        }
        if (a.id_record < b.id_record) {
            return -1;
        }
        // a должно быть равным b
        return 0;
    });
    eventsTableTbody.textContent = '';
    for (let i = 0; i < mainStorage.length; i++) {
        let thisIDPar = mainStorage[i].id_parameter;
        let eventLine = document.createElement('tr');
        eventLine.classList.add('device-table__line');
        eventLine.classList.add('smaller-line');

        colorLine = 0;
        if (colorLine % 2 == 0) {
            eventLine.classList.add('device-table__line_painted');
        }

        let evTime = new Date(mainStorage[i].datetime_data);
        let evCorrTime = addZero(evTime.getDate()) + '/' + addZero(evTime.getMonth() + 1) + '/' + addZero(evTime.getFullYear()) + ' ' + addZero(evTime.getHours()) + ':' + addZero(evTime.getMinutes());

        for (let d = 0; d < objectsList.length; d++) {
            if (objectsList[d].id_object === mainStorage[i].id_object) {
                evDev = objectsList[d].object_description;
                break;
            }
        }

        for (let p = 0; p < parametersDesc.length; p++) {
            if (parametersDesc[p].id_parameter === thisIDPar) {
                evPar = String(parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')');
                break;
            }
        }

        evVal = mainStorage[i].value;

        if (thisIDPar !== 54 && thisIDPar !== 55 && thisIDPar !== 56) {
            evVal = Number(mainStorage[i].value).toFixed(1);
        } else if (thisIDPar === 54) {
            eventLine.classList.add('device-table__line_green');
        }

        for (let i = 0; i < redParams.length; i++) {
            if (thisIDPar === redParams[i]) {
                eventLine.classList.add('device-table__line_red');
                break;
            }
        }

        eventLine.innerHTML = `<td class="event-td">${evCorrTime}</td><td class="event-td">${evDev}</td><td class="event-td event-td__par">${evPar}</td><td class="event-td">${evVal}</td>`;
        eventsTableTbody.prepend(eventLine);

        colorLine++;
    }

    eventsLoading.hidden = true;
    afterEventsLoading.hidden = false;
}

function showSelectedParameters() { // показать строки с этим id par 
    let allRightLines = document.querySelectorAll(`.line-${parId}`);
    for (let line of allRightLines) {
        line.classList.remove('smaller-line_none');
    }
}

function removeUnselectedParameters() { // убрать строки с этим id par
    let allRightLines = document.querySelectorAll(`.line-${parId}`);
    for (let line of allRightLines) {
        line.classList.add('smaller-line_none');
    }
}

function showSelectedDevices() { // показать строки с этим id par 
    let allRightLines = document.querySelectorAll(`.line-dev${parId}`);
    for (let line of allRightLines) {
        line.classList.remove('smaller-line_none');
    }
}

function removeUnselectedDevices() { // убрать строки с этим id par
    let allRightLines = document.querySelectorAll(`.line-dev${parId}`);
    for (let line of allRightLines) {
        line.classList.add('smaller-line_none');
    }
}