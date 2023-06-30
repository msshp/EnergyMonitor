'use strict'

let savePage;
let currentId;

let btnPass = document.querySelector('.btn-password');
let inputPass = document.querySelector('.form__input-password');

const viewIdParameters = [17, 23, 46, 18, 24, 47, 19, 35, 48];
const viewDevicePageTitle = [8, 9, 10, 11, 12];
const viewDevicePageTable = [17, 23, 46, 18, 24, 47, 19, 35, 48];
const viewDeviceChart = [17, 23, 46, 18, 24, 47, 19, 35, 48];
const idForCharts = [
    [17, 23, 46, 146],
    [18, 24, 47, 147],
    [19, 35, 48, 148]
]

let energyPeriodData = {
    a: [],
    b: [],
    c: []
}

let exportCsv;

let channelSelBtn;
let channelSelection;
let btnLogout = document.getElementById("button-logout");

const current_host = window.location.host;
let xhr = new XMLHttpRequest();
let requestGetParameters = new XMLHttpRequest();
let requestGetObjects = new XMLHttpRequest(); // получение id устройства
let getData = new XMLHttpRequest(); // данные по id устройства
let getDataDevicePageTitle = new XMLHttpRequest(); // получение заголовка страницы устройства
let getDataSpecDeviceTable = new XMLHttpRequest(); // получение данных таблицы устройства (вкладка Параметры)
let getProjectData = new XMLHttpRequest(); // получение данных проекта
let getProjectInfo = new XMLHttpRequest();
let getProjectParameters = new XMLHttpRequest();
let postNewPInfo = new XMLHttpRequest();
let getPNameR = new XMLHttpRequest();
let getPAdressR = new XMLHttpRequest();
let postNewPInfoAdress = new XMLHttpRequest();
let getProjectDateOfCreation = new XMLHttpRequest();
let getMapR = new XMLHttpRequest();

let btnFormLogin = document.getElementById('form__input-login');
let token;
let user;
let objectsList;
let idNum;

let tableTitle;
let tableLine;

let popup = document.getElementById('popup');
let popupClose = document.querySelector('.close-popup');
let popupBody = document.querySelector('.popup-body');

popupClose.addEventListener('click', () => {
    popup.classList.remove('popup-block');
    popupBody.textContent = '';
    checkNewParName();
})

let parametersDesc = [];
let dataStorage = [];
let parametersData;
let indObj;
let checkЕlement = [];

let deviceTableThead = document.getElementById('device-table__thead');
let deviceTableBody = document.getElementById('device-table__tbody');

// sidenav

let sidenavDevices = document.getElementById('sidenav__devices');
let sidenavProject = document.getElementById('sidenav__project');
let sidenavMap = document.getElementById('sidenav__map');
let sidenavEvents = document.getElementById('sidenav__events');
let iconLightbulb = document.querySelector('.icon-lightbulb');
let iconWork = document.querySelector('.icon-work');
let iconExplore = document.querySelector('.icon-explore');
let iconList = document.querySelector('.icon-list');


let inputUnfocus = document.querySelector('.input_unfocus');
let inputBox = document.querySelector('.input-box');
let formHeader = document.querySelector('.form-header');
let inputIcon = document.querySelector('.input-icon');
let btnBurger = document.querySelector('.top-menu__btn');
let sideMenuBtn = document.querySelector('.side-menu__btn');

// blocks

let authPage = document.getElementById('auth');
let deviceTable = document.getElementById('device-table');
let deviceSpecificParams = document.getElementById('device-specific-params');
let topNav = document.querySelector('.top-menu');
let sideNav = document.querySelector('.sidenav');
let availableContent = document.querySelector('.wrapper');
let content = document.querySelector('.content');
let preLoading = document.getElementById('pre-loading');
let afterPreLoading = document.getElementById('after-pre-loading');
let project = document.getElementById('project');
let map = document.getElementById('map-block');
let events = document.getElementById('events');

// specific parameters

let divTitle;
let loading = document.getElementById('loading');
let afterLoading = document.getElementById('after-loading');
let afterLoadingContainer = document.getElementById('after-loading-container');

let devPageTitle;
let devDataDescription;
let devData;

let deviceDataBase = { devPageTitle, devDataDescription, devData };

devPageTitle = {
    complate: false,
    data: []
};

devDataDescription = {
    complate: false,
    data: []
};

devData = {
    complate: false,
    data: []
};

let complate;
let headerOutput = [];
let descTitle;
let outputTitle = [];
let w;
let idObj;
let backВutton = document.getElementById('back-button');

let deviceSpecificName = document.getElementById('device-specific-name');
let deviceSpecParamsThead = document.getElementById('device-specific-params__thead');
let deviceSpecParamsTbody = document.getElementById('device-specific-params__tbody');

let counter;
let allSpecDeviceData;
let specificParamsLine;   // создали строку устройства

// пагинация

let notesOnPage = 10; // количество записей на странице
let actLi;
let deviceTableContent = document.getElementById('device-table-content');
let ul;
let ulBlock;
let specificParamsVal;

// export

let btnDownloadData;

// spec device nav

let deviceParamsBtn = document.getElementById('device-params-btn');
let chartsBtn = document.getElementById('charts-btn');

// charts

let chart;
let chartsContainer = document.getElementById('charts-container');
let deviceParamsTable = document.getElementById('device-params-table');
let canvasChart;
let chartBlock;
let labelY;

let recordsForPeriod = []; // ось x
let massivForComparison = []; // ось x для сравнения полной даты
let periodData = null; // ось y
let newRec;

let chartsContainerLoader;
let loader;

// поиск по дате
let lastTime;
let firstTime;
let timeInterval;
let numberOfRecords;
let filterByDate = document.querySelector('.filter-by-date');
let dataOffset = null;

// project

let projectList;
let idProject;
let projectInfoList;
let desiredParameterName;
let projDateOfCreation;
let projectInfoParameters;
let projectSection = document.querySelector('.project-section');
let projInfoItem;
let projInfoLine;
let projectInfoParams;
let projNameList;
let projAdressList;
let projectLoading = document.getElementById('project-loading');
let projectAfterLoading = document.getElementById('project-after-loading');

// map

let deviceСoordinates;
let mapL = null;
let mapLoad = document.getElementById('map-drawing');

// добавление нулей в даты

function addZero(num) {
    if (num >= 0 && num <= 9) {
        return '0' + num;
    } else {
        return num;
    }
}

// login
// show/hide password

btnPass.onclick = function () {
    if (inputPass.getAttribute('type') === 'password') {
        inputPass.setAttribute('type', 'text');
        btnPass.classList.add('icon-visibility');
        btnPass.classList.remove('icon-visibility-off');
    } else {
        inputPass.setAttribute('type', 'password');
        btnPass.classList.add('icon-visibility-off');
        btnPass.classList.remove('icon-visibility');
    }
    return;
}

// input highlighting

inputUnfocus.onfocus = function () {
    inputBox.classList.toggle('input-bd_focus');
    formHeader.classList.toggle('input_focus');
    inputIcon.classList.toggle('input_focus');
}

inputUnfocus.onblur = function () {
    inputBox.classList.toggle('input-bd_focus');
    formHeader.classList.toggle('input_focus');
    inputIcon.classList.toggle('input_focus');
}

// side navigation

sideMenuBtn.onclick = function () {
    sideNav.classList.toggle('sidenav_hidden');
    content.classList.toggle('content_compressed');
}

sidenavDevices.addEventListener('click', () => {
    showGeneralTable();
})

function showGeneralTable() {
    evnt.stop();
    highlightingMenuItems();
    sessionStorage.removeItem('savePage');
    getObjects();
    project.hidden = true;
    map.hidden = true;
    events.hidden = true;
    projectLoading.hidden = false;
    projectAfterLoading.hidden = true;
    deviceSpecificParams.hidden = true;
}

sidenavProject.addEventListener('click', () => {
    showProject();
})

function showProject() {
    evnt.stop();
    deviceTable.hidden = true;
    deviceSpecificParams.hidden = true;
    map.hidden = true;
    events.hidden = true;
    project.hidden = false;
    sidenavProject.classList.add('active-sidenav-btn');
    iconWork.classList.add('active-sidenav-btn');
    sidenavDevices.classList.remove('active-sidenav-btn');
    iconLightbulb.classList.remove('active-sidenav-btn');
    sidenavMap.classList.remove('active-sidenav-btn');
    iconExplore.classList.remove('active-sidenav-btn');
    sidenavEvents.classList.remove('active-sidenav-btn');
    iconList.classList.remove('active-sidenav-btn');
    loading.hidden = false;
    afterLoading.hidden = true;
    projectLoading.hidden = true;
    projectAfterLoading.hidden = false;
    savePage = '4';
    sessionStorage.setItem('savePage', savePage);
}

sidenavMap.addEventListener('click', () => {
    showMap();
})

function showMap() {
    evnt.stop();
    deviceTable.hidden = true;
    deviceSpecificParams.hidden = true;
    project.hidden = true;
    events.hidden = true;
    map.hidden = false;
    if (mapL === null) {
        mapLoad.innerHTML = '<div class="load-map-container"><div class="loader"></div></div>';
        getMap();
    }
    sidenavMap.classList.add('active-sidenav-btn');
    iconExplore.classList.add('active-sidenav-btn');
    sidenavDevices.classList.remove('active-sidenav-btn');
    iconLightbulb.classList.remove('active-sidenav-btn');
    sidenavProject.classList.remove('active-sidenav-btn');
    iconWork.classList.remove('active-sidenav-btn');
    sidenavEvents.classList.remove('active-sidenav-btn');
    iconList.classList.remove('active-sidenav-btn');
    loading.hidden = false;
    afterLoading.hidden = true;
    savePage = '5';
    sessionStorage.setItem('savePage', savePage);
}

sidenavEvents.addEventListener('click', () => {
    showEvents();
})

// highlighting menu items

function highlightingMenuItems() {
    sidenavDevices.classList.add('active-sidenav-btn');
    iconLightbulb.classList.add('active-sidenav-btn');
    sidenavProject.classList.remove('active-sidenav-btn');
    iconWork.classList.remove('active-sidenav-btn');
    sidenavMap.classList.remove('active-sidenav-btn');
    iconExplore.classList.remove('active-sidenav-btn');
    sidenavEvents.classList.remove('active-sidenav-btn');
    iconList.classList.remove('active-sidenav-btn');
}

// token availability check

function checkToken() {
    preLoading.hidden = false;
    afterPreLoading.hidden = true;
    if (sessionStorage.getItem('token')) {
        token = sessionStorage.getItem('token');
        checkNewParName();
        getObjects();
    } else {
        authPage.hidden = false; // показать авторизацию
    }
}

btnFormLogin.onclick = function getToken(evt) {
    user = document.getElementById("login").value;
    let pass = document.getElementById("password").value;
    if (user && pass) {
        evt.preventDefault();
        let msg = JSON.stringify({ "username": user, "password": pass });
        xhr.open("POST", "http://" + current_host + "/api/v1/auth/token/login/");
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.send(msg);
    }
}

xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let payload = JSON.parse(this.responseText);
        token = payload.auth_token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', user);
        checkNewParName();
        getObjects();
    }
}

function getProject() {
    getProjectData.open("GET", "http://" + current_host + "/api/v1/objects/?id_object_type=1");
    getProjectData.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getProjectData.setRequestHeader('Authorization', 'Token ' + token);
    getProjectData.send();
}

getProjectData.onreadystatechange = function () {
    if (getProjectData.readyState === 4 && getProjectData.status === 200) {
        let payload = JSON.parse(getProjectData.responseText);
        projectList = payload.results;
        idProject = projectList[0].id_object;
        getProjParameters();
        getProjectInformation();
    }
}

function getProjParameters() {
    getProjectParameters.open("GET", "http://" + current_host + '/api/v1/parameters/?id_object_type=1');
    getProjectParameters.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getProjectParameters.setRequestHeader('Authorization', 'Token ' + token);
    getProjectParameters.send();
}

getProjectParameters.onreadystatechange = function () {
    if (getProjectParameters.readyState === 4 && getProjectParameters.status === 200) {
        let payload = JSON.parse(getProjectParameters.responseText);
        projectInfoParameters = payload.results;
        sessionStorage.setItem('projectInfoParameters', JSON.stringify(projectInfoParameters));
    }
}

function getProjectInformation() {
    getPName();
}

function getPName() {
    getPNameR.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idProject}&id_parameter=1&limit=1`);
    getPNameR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getPNameR.setRequestHeader('Authorization', 'Token ' + token);
    getPNameR.send();
}

getPNameR.onreadystatechange = function () {
    if (getPNameR.readyState === 4 && getPNameR.status === 200) {
        let payload = JSON.parse(getPNameR.responseText);
        let projectNameResponse = payload.results;
        sessionStorage.setItem('projectNameResponse', JSON.stringify(projectNameResponse));
        getPDataOfCreation();
    }
}

function getPDataOfCreation() {
    getProjectDateOfCreation.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idProject}&id_parameter=1`);
    getProjectDateOfCreation.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getProjectDateOfCreation.setRequestHeader('Authorization', 'Token ' + token);
    getProjectDateOfCreation.send();
}

getProjectDateOfCreation.onreadystatechange = function () {
    if (getProjectDateOfCreation.readyState === 4 && getProjectDateOfCreation.status === 200) {
        let payload = JSON.parse(getProjectDateOfCreation.responseText);
        let projectDateOfCreation = payload.results;
        let projDate = projectDateOfCreation[projectDateOfCreation.length - 1].datetime_data;
        sessionStorage.setItem('projectDateOfCreation', JSON.stringify(projDate));
        getPAdress();
    }
}

function getPAdress() {
    getPAdressR.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idProject}&id_parameter=2&limit=1`);
    getPAdressR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getPAdressR.setRequestHeader('Authorization', 'Token ' + token);
    getPAdressR.send();
}

getPAdressR.onreadystatechange = function () {
    if (getPAdressR.readyState === 4 && getPAdressR.status === 200) {
        let payload = JSON.parse(getPAdressR.responseText);
        let projectAdressResponse = payload.results;
        sessionStorage.setItem('projectAdressResponse', JSON.stringify(projectAdressResponse));
        drawProject();
    }
}

function drawProject() {
    projectSection.textContent = '';

    projNameList = JSON.parse(sessionStorage.getItem('projectNameResponse'));
    projAdressList = JSON.parse(sessionStorage.getItem('projectAdressResponse'));
    projDateOfCreation = new Date(JSON.parse(sessionStorage.getItem('projectDateOfCreation')));

    let projectName = document.querySelector('.project-name');
    let dateOfProjectCreation = document.querySelector('.date-of-project-creation');

    projectName.textContent = String(projNameList[0].value); // заголовок окошка
    dateOfProjectCreation.textContent = `Дата создания: ${addZero(projDateOfCreation.getDate()) + '/' + addZero(projDateOfCreation.getMonth()) + '/' + addZero(projDateOfCreation.getFullYear())}`;

    let numberOfDevices = document.getElementById('number-of-devices');
    numberOfDevices.textContent = String(objectsList.length);

    projectInfoParams = JSON.parse(sessionStorage.getItem('projectInfoParameters'));

    for (let pl = 0; pl < projectInfoParams.length; pl++) {
        projInfoLine = document.createElement('div');
        projInfoLine.classList.add('proj-info-block');
        projInfoLine.id = `proj-block${pl}`;
        let formHeader = document.createElement('p');
        formHeader.classList.add('form-header');

        formHeader.textContent = String(projectInfoParams[pl].parameter);
        projInfoLine.appendChild(formHeader);
        projInfoItem = document.createElement('div');
        projInfoItem.id = `proj${pl}`;
        if (projNameList[0].id_parameter === projectInfoParams[pl].id_parameter) {
            projInfoItem.innerHTML = `<div class="proj-info-item">${String(projNameList[0].value)}<i class="icon-pencil" onclick="editProjInfoItem(${pl})"></i></div>`;
        }

        if (projAdressList[0].id_parameter === projectInfoParams[pl].id_parameter) {
            projInfoItem.innerHTML = `<div class="proj-info-item">${String(projAdressList[0].value)}<i class="icon-pencil" onclick="editProjInfoItem(${pl})"></i></div>`;
        }
        projInfoLine.appendChild(projInfoItem);
        projectSection.appendChild(projInfoLine);
    }

    projectLoading.hidden = true;
    projectAfterLoading.hidden = false;
}

function editProjInfoItem(pl) {
    let editingProjInfoLine = document.getElementById(`proj-block${pl}`);
    let editingProjInfoItem = document.getElementById(`proj${pl}`);
    let editProjInput = document.createElement('div');
    editProjInput.classList.add('edit-proj-input');
    if (projectInfoParams[pl].id_parameter === 1) {
        editProjInput.innerHTML = `<input id="proj-name" type="text" value="${String(projNameList[0].value)}"><i class="icon-save" onclick="sendNewProjName()"></i>`
    }
    if (projectInfoParams[pl].id_parameter === 2) {
        editProjInput.innerHTML = `<input id="proj-adress" type="text" value="${String(projAdressList[0].value)}"><i class="icon-save" onclick="sendNewProjAdress()"></i>`
    }
    editingProjInfoItem.hidden = true;
    editingProjInfoLine.appendChild(editProjInput);
}

function sendNewProjName() {
    let newMsgPName = JSON.stringify({
        "value": `${document.getElementById('proj-name').value}`,
        "id_object": idProject,
        "id_parameter": 1
    });
    postNewPInfo.open("POST", "http://" + current_host + `/api/v1/data/?id_object=${idProject}`);
    postNewPInfo.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    postNewPInfo.setRequestHeader('Authorization', 'Token ' + token);
    postNewPInfo.send(newMsgPName);
}

postNewPInfo.onreadystatechange = () => {
    if (postNewPInfo.readyState === 4 && postNewPInfo.status === 201) {
        getProjectInformation();
    }
}

function sendNewProjAdress() {
    let newMsgPAdress = JSON.stringify({
        "value": `${document.getElementById('proj-adress').value}`,
        "id_object": idProject,
        "id_parameter": 2
    });
    postNewPInfoAdress.open("POST", "http://" + current_host + `/api/v1/data/?id_object=${idProject}`);
    postNewPInfoAdress.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    postNewPInfoAdress.setRequestHeader('Authorization', 'Token ' + token);
    postNewPInfoAdress.send(newMsgPAdress);
}

postNewPInfoAdress.onreadystatechange = () => {
    if (postNewPInfoAdress.readyState === 4 && postNewPInfoAdress.status === 201) {
        getProjectInformation();
    }
}

function getObjects() {
    requestGetObjects.open("GET", "http://" + current_host + "/api/v1/objects/?id_object_type=3");
    requestGetObjects.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    requestGetObjects.setRequestHeader('Authorization', 'Token ' + token);
    requestGetObjects.send();
}

requestGetObjects.onreadystatechange = function () {
    if (requestGetObjects.readyState === 4 && requestGetObjects.status === 200) {
        let payload = JSON.parse(requestGetObjects.responseText);
        objectsList = payload.results;  // получили массив объектов
        drawBlocks();
        getProject();
    }
}

function drawBlocks() {
    authPage.hidden = true;
    availableContent.hidden = false;
    deviceTable.hidden = false;
    sideNav.hidden = false;
    topNav.hidden = false;
    highlightingMenuItems();
    drawDescriptions();
}

// general device table

function drawDescriptions() {
    requestGetParameters.open("GET", "http://" + current_host + "/api/v1/parameters/?id_object_type=3");
    requestGetParameters.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    requestGetParameters.setRequestHeader('Authorization', 'Token ' + token);
    requestGetParameters.send();

    requestGetParameters.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let payload = JSON.parse(this.responseText);
            parametersDesc = payload.results;  // получили массив объектов

            if (!sessionStorage.getItem('savePage')) {
                tableTitle = document.createElement('tr');     // создали строку заголовка
                tableTitle.textContent = ''; // чистим перед перерисовкой
                tableTitle.classList.add('device-table__title');

                // заголовок «устройство»
                let paramDevice = document.createElement('th');
                paramDevice.classList.add('device-name');
                paramDevice.textContent = String(parametersDesc[0].parameter);
                tableTitle.appendChild(paramDevice);

                for (let i = 0; i < viewIdParameters.length; i++) {
                    for (let p = 0; p < parametersDesc.length; p++) {
                        if (parametersDesc[p].id_parameter === viewIdParameters[i]) {
                            // заголовок параметра
                            let paramDesc = document.createElement('th');
                            paramDesc.classList.add('device-value');
                            paramDesc.textContent = String(parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')');
                            tableTitle.appendChild(paramDesc);
                            break;
                        };
                    }
                }
                let emptyDescParam = document.createElement('th');
                emptyDescParam.classList.add('empty-desc');
                tableTitle.appendChild(emptyDescParam);
                deviceTableThead.textContent = '';
                deviceTableThead.appendChild(tableTitle); // добавили строку заголовков в таблицу

                drawContent();
            } else if (sessionStorage.getItem('savePage') === '2' || sessionStorage.getItem('savePage') === '3') {
                openDeviceSpecificParams(Number(sessionStorage.getItem('currentId')));
            } else if (sessionStorage.getItem('savePage') === '4') {
                drawProject();
                showProject();
            } else if (sessionStorage.getItem('savePage') === '5') {
                showMap();
            } else if (sessionStorage.getItem('savePage') === '6') {
                showEvents();
            }
        }
    }
}

function drawContent() {
    indObj = 0;
    getRTD(indObj);
}

function getRTD(indObj) {
    idNum = objectsList[indObj].id_object;
    getData.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idNum}&limit=50`);
    getData.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getData.setRequestHeader('Authorization', 'Token ' + token);
    getData.send();
}

getData.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        let payload = JSON.parse(this.responseText);
        parametersData = dateCorr(payload.results);  // получили массив объектов (50)

        let rightParametersData = [];
        for (let p = 0; p < viewIdParameters.length; p++) {
            rightParametersData.push(getDesiredId(viewIdParameters[p], parametersData)); // выбор нужных объектов
        }

        if (rightParametersData) {
            dataStorage.push(rightParametersData);
            indObj++;
            if (indObj < objectsList.length) {
                getRTD(indObj);
            } else {
                drawTableLines();
            };
        }
    }
}

function dateCorr(parametersData) {
    for (let idc = 0; idc < parametersData.length; idc++) {
        let corrDate = new Date(parametersData[idc].datetime_data);
        let corrDateUnix = parseInt(corrDate.getTime() / 1000); // в секундах
        let remainder = corrDateUnix % 300;
        let remCorrDate;

        if (remainder > 240) {
            remCorrDate = parseInt(corrDateUnix / 300 + 1) * 300;
        } else if (remainder < 120) {
            remCorrDate = parseInt(corrDateUnix / 300) * 300;
        }
        corrDate = new Date(remCorrDate * 1000);
        parametersData[idc].datetime_data = new Date(corrDate);
    }
    return parametersData;
}

function drawTableLines() {
    deviceTableBody.textContent = '';
    for (let k = 0; k < objectsList.length; k++) {
        tableLine = document.createElement('tr');     // создали строку устройства
        tableLine.classList.add('device-table__line');

        if (k % 2 == 0) { // раскрасили строку
            tableLine.classList.add('device-table__line_painted');
        }

        let paramDevice = document.createElement('td');   // создали ячейку с названием
        paramDevice.classList.add('device-name');
        paramDevice.textContent = String(objectsList[k].object_description);
        paramDevice.addEventListener('click', () => {
            openDeviceData(objectsList[k].id_object);
        })
        // время запроса

        let now = new Date();
        let requestTime = new Date(dataStorage[k][0].datetime_data);
        let timeDiff = Math.floor((now - requestTime) / (1000 * 60));

        // если больше 10 минут, подсветка красным

        let paramTime = document.createElement('div');
        paramTime.innerHTML = `<span>${addZero(requestTime.getDate()) + '/' + addZero(requestTime.getMonth() + 1) + '/' + addZero(requestTime.getFullYear()) + ' ' + addZero(requestTime.getHours()) + ':' + addZero(requestTime.getMinutes())}</span><i class="icon-pencil edit-parameter-names"></i>`;

        if (timeDiff > 10) {
            paramTime.classList.add('old-time');
            paramTime.classList.remove('actual-time');
        } else {
            paramTime.classList.add('actual-time');
            paramTime.classList.remove('old-time');
        }
        paramDevice.appendChild(paramTime);
        tableLine.appendChild(paramDevice);
        deviceTableBody.appendChild(tableLine); // добавили строку заголовков в таблицу

        drawDeviceSettings(k);

        // добавление кнопки «Детально»

        let btnDeviceDetails = document.createElement('td');
        btnDeviceDetails.classList.add('device-table__line-btns');
        btnDeviceDetails.innerHTML = `<button id="device-table__line-btns${k}" class="line-btns__details">Детально</button>`;
        tableLine.appendChild(btnDeviceDetails);
        document.getElementById(`device-table__line-btns${k}`).addEventListener('click', () => { openDeviceSpecificParams(k) });
    }
}

function openDeviceData(idObj) {
    popup.classList.add('popup-block');
    let popupNameDevice = document.getElementById('popup__name-device');
    for (let m = 0; m < objectsList.length; m++) {
        if (objectsList[m].id_object === idObj) {
            popupNameDevice.textContent = `${objectsList[m].object_description}`;
        }
    }

    for (let i = 0; i < viewIdParameters.length; i++) {
        let popupLine = document.createElement('div');
        popupLine.classList.add('popup-line');

        let popupPresentValue = document.createElement('span');
        popupPresentValue.classList.add('present-value');

        for (let p = 0; p < parametersDesc.length; p++) {
            if (parametersDesc[p].id_parameter === viewIdParameters[i]) {
                popupPresentValue.textContent = `${parametersDesc[p].parameter}`;
            }
        }
        let popupLineInput = document.createElement('div');
        popupLineInput.classList.add('edit-proj-input');
        popupLineInput.classList.add('new-value');
        let newInputName = getNewName(idObj, viewIdParameters[i]);
        let inputVal = '';
        if (newInputName) {
            inputVal = newInputName;
        }
        popupLineInput.innerHTML = `<input id="change-par-name-${viewIdParameters[i]}" type="text" value="${inputVal}">`;
        let popupButton = document.createElement('button');
        popupButton.textContent = 'Изменить';
        popupButton.addEventListener('click', () => {
            changeParameterName(viewIdParameters[i], idObj);
        })

        popupLine.appendChild(popupPresentValue);
        popupLine.appendChild(popupLineInput);
        popupLine.appendChild(popupButton);
        popupBody.appendChild(popupLine);
    }
}

function drawDeviceSettings(k) {

    checkЕlement = dataStorage[k]; // это массив
    for (let l = 0; l < viewIdParameters.length; l++) {
        let paramData = document.createElement('td');
        paramData.classList.add('device-value');
        let val = '–';
        for (let m = 0; m < checkЕlement.length; m++) {
            if (checkЕlement[m].id_parameter === viewIdParameters[l]) {
                val = Number(checkЕlement[m].value).toFixed(1);
                break;
            }
        }
        paramData.textContent = val;
        tableLine.appendChild(paramData);
    }
    preLoading.hidden = true;
    afterPreLoading.hidden = false;
}

// logout 

btnLogout.onclick = function logOut() {
    sessionStorage.clear();
    authPage.hidden = false;
    availableContent.hidden = true;
    deviceTable.hidden = true;
    deviceSpecificParams.hidden = true;
    topNav.hidden = true;
    sideNav.hidden = true;
    events.hidden = true;
    objectsList = [];
    parametersDesc = [];
    dataStorage = [];

    // очистка таблицы 
    deviceTableThead.innerHTML = '';
    deviceTableBody.innerHTML = '';
    preLoading.hidden = false;
    afterPreLoading.hidden = true;
}

// drawing specific device

function openDeviceSpecificParams(k) {
    deviceTable.hidden = true;
    deviceSpecificParams.hidden = false;
    currentId = k;
    sessionStorage.setItem('currentId', String(k));
    getDeviceData(); // запрос данных для страницы
}

function getDeviceData() {
    idObj = objectsList[currentId].id_object;
    devPageTitle = {
        complate: false,
        data: []
    };

    devDataDescription = {
        complate: false,
        data: []
    };

    devData = {
        complate: false,
        data: []
    };

    deviceSpecificName.textContent = '';
    deviceSpecParamsThead.textContent = '';

    headerOutput = [];
    outputTitle = [];
    devDataDescription = [];

    // запрос заголовков страницы
    counter = 0;

    getDevicePageTitle(viewDevicePageTitle[counter]);
    // запрос заголовков таблицы
    getDevDataDescription();

    lastTime = new Date(parseInt(new Date().getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
    firstTime = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate() - 1, lastTime.getHours(), lastTime.getMinutes());
    getDevData(); // запрос данных для таблицы
    drawFilter(); // отрисовка фильтра
}

function checkComplate() {
    if (devPageTitle.complate && devDataDescription.complate && devData.complate) {
        drawDeviceData();
        loading.hidden = true;
        afterLoading.hidden = false;
    }
}

function getDevicePageTitle(idPar) {
    getDataDevicePageTitle.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObj}&id_parameter=${idPar}`);
    getDataDevicePageTitle.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getDataDevicePageTitle.setRequestHeader('Authorization', 'Token ' + token);
    getDataDevicePageTitle.send();
}

getDataDevicePageTitle.onreadystatechange = function () {
    if (getDataDevicePageTitle.readyState === 4 && getDataDevicePageTitle.status === 200) {
        let payload = JSON.parse(getDataDevicePageTitle.responseText);
        let devicePageTitle = payload.results;

        if (devicePageTitle) {
            if (devicePageTitle.length === 0) {
                let emObj = {
                    value: ''
                }
                devicePageTitle.push(emObj);
            }
            outputTitle.push(devicePageTitle[0].value);
            counter++;
            if (counter < viewDevicePageTitle.length) { // если счётчик меньше чем кол-во параметров в заголовке, то заново вызываем
                getDevicePageTitle(viewDevicePageTitle[counter], counter);
            } else {
                descTitle = [];
                for (let i = 0; i < viewDevicePageTitle.length; i++) { // создаём массив с заголовками заголовка
                    for (let p = 0; p < parametersDesc.length; p++) {
                        if (parametersDesc[p].id_parameter === viewDevicePageTitle[i]) {
                            descTitle.push(parametersDesc[p].parameter);
                        }
                    }
                }
                for (let j = 0; j < outputTitle.length; j++) {
                    if (outputTitle[j] === '') {  // если пустое значение то
                        headerOutput.push('');
                    } else {
                        headerOutput.push(descTitle[j] + ':' + ' ' + outputTitle[j]);
                    }
                }
                devPageTitle = {
                    complate: true,
                    data: headerOutput
                }
                checkComplate();
            }
        }
    }
}

// ПОЛУЧЕНИЕ заголовков таблицы (вкладка Данные)

function getDevDataDescription() {
    devDataDescription = [];
    for (let v = 0; v < viewDevicePageTable.length; v++) {
        for (let x = 0; x < parametersDesc.length; x++) {
            if (parametersDesc[x].id_parameter === viewDevicePageTable[v]) {
                let newName = getNewName(idObj, viewDevicePageTable[v]); // внесли id
                let name = String(parametersDesc[x].parameter);
                if (newName) {
                    name = String(newName);
                }
                let rightParName = name;
                devDataDescription.push(rightParName + ' ' + '(' + parametersDesc[x].measure_unit + ')');
                break;
            };
        }
    }
    devDataDescription = {
        complate: true,
        data: devDataDescription
    }
    checkComplate(); // проверка готовности данных
}

function getDevData() {
    timeInterval = Math.floor((lastTime - firstTime) / (1000 * 60)); // заданный период в минутах (1440 по умолчанию)
    numberOfRecords = timeInterval / 5 + 1; // сколько в интервале отметок, кратных 5? (289 по умолчанию)
    dataOffset = null;
    if (String(new Date(lastTime)) !== String(new Date(parseInt(new Date().getTime() / 300000) * 300000))) {
        // (сейчас - lastTime)в минутах / 5 = offset;
        dataOffset = Math.floor((new Date(parseInt(new Date().getTime() / 300000) * 300000) - lastTime) / (1000 * 60)) / 5; // offset 
    }
    w = 0;
    allSpecDeviceData = []; // общий массив
    getSpecDeviceTableLine(viewDevicePageTable[w]);
}

function getSpecDeviceTableLine(idPar) {
    if (dataOffset !== null) {
        getDataSpecDeviceTable.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObj}&id_parameter=${idPar}&limit=${numberOfRecords}&offset=${dataOffset}`);
    } else {
        getDataSpecDeviceTable.open("GET", "http://" + current_host + `/api/v1/data/?id_object=${idObj}&id_parameter=${idPar}&limit=${numberOfRecords}`);
    }
    getDataSpecDeviceTable.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getDataSpecDeviceTable.setRequestHeader('Authorization', 'Token ' + token);
    getDataSpecDeviceTable.send();
}

getDataSpecDeviceTable.onreadystatechange = function () {
    if (getDataSpecDeviceTable.readyState === 4 && getDataSpecDeviceTable.status === 200) {
        let payload = JSON.parse(getDataSpecDeviceTable.responseText);
        let devicePageSpecParam = dateCorr(payload.results);  // получили массив объектов
        // коррекция даты
        if (!w) {
            devicePageSpecParam.forEach(element => {
                let objectLine = {
                    dT: element.datetime_data,
                    dTLine: [element]
                }
                allSpecDeviceData.push(objectLine);
            })
        } else {
            allSpecDeviceData.forEach(element => {
                let yu;
                for (yu = 0; yu < devicePageSpecParam.length; yu++) {

                    // сравнение дат без учёта секунд

                    let firstDate = new Date(element.dT);
                    let secondDate = new Date(devicePageSpecParam[yu].datetime_data);

                    let firstDateMin = firstDate.getDate() + firstDate.getMonth + firstDate.getFullYear() + firstDate.getHours() + firstDate.getMinutes();

                    let secondDateMin = secondDate.getDate() + secondDate.getMonth + secondDate.getFullYear() + secondDate.getHours() + secondDate.getMinutes();

                    if (firstDateMin === secondDateMin) {
                        element.dTLine.push(devicePageSpecParam[yu]);
                        break;
                    }
                }
                if (yu === devicePageSpecParam.length) {
                    element.dTLine.push({
                        value: '-'
                    });
                }
            })
        }

        w++;
        if (w < viewDevicePageTable.length) {
            getSpecDeviceTableLine(viewDevicePageTable[w]);
        } else {
            devData = {
                complate: true,
                data: allSpecDeviceData
            }
            checkComplate();
        }
    }
}

// отрисовка страницы
function drawDeviceData() {
    deviceSpecificName.textContent = '';
    // заголовок страницы
    for (let d = 0; d < devPageTitle.data.length; d++) {
        divTitle = document.createElement('div');
        divTitle.textContent = String(devPageTitle.data[d]);
        deviceSpecificName.appendChild(divTitle);
    }
    // проверка страницы
    if (sessionStorage.getItem('savePage') === '3') { // устройство - графики
        showCharts();
    } else {
        drawDevParameters();
    }
}

function drawDevParameters() {
    exportCsv = '';
    if (deviceSpecParamsThead.contains(tableTitle)) {
        deviceSpecParamsThead.removeChild(tableTitle); // очистка таблицы перед перерисовкой
    }
    // заголовки таблицы
    tableTitle = document.createElement('tr');   // создали строку заголовка
    tableTitle.textContent = ''; // чистим перед перерисовкой
    tableTitle.classList.add('device-table__title');
    let paramDevice = document.createElement('th');
    paramDevice.classList.add('parameter-time');
    paramDevice.textContent = String('Дата и время');
    exportCsv += 'Дата и время; ';
    tableTitle.appendChild(paramDevice);

    devDataDescription.data.forEach((element) => {
        let paramDesc = document.createElement('th');
        paramDesc.classList.add('parameter-name');
        paramDesc.textContent = String(element);
        exportCsv += element + '; ';
        tableTitle.appendChild(paramDesc);
    })

    exportCsv += '\n\r';
    deviceSpecParamsThead.appendChild(tableTitle); // добавили строку заголовков в таблицу
    // данные таблицы
    dataDistribution();
    savePage = '2';
    sessionStorage.setItem('savePage', savePage);
    if (deviceTableContent.contains(chartsContainerLoader)) {
        let loadingBlocks = document.querySelectorAll('.charts-container-loader');
        loadingBlocks.forEach(function (elem) {
            elem.parentNode.removeChild(elem);
        });
    }
    chartsContainer.hidden = true;
    chartsContainer.textContent = '';
    deviceParamsTable.hidden = false;
    if (deviceTableContent.contains(ul)) {
        ul.hidden = false;
    }
}

function dataDistribution() {
    let paginationMassiv = [];
    for (let r = 0; r < devData.data.length; r++) {

        specificParamsLine = document.createElement('tr');
        specificParamsLine.classList.add('device-table__line');
        specificParamsLine.classList.add('small-line');

        if (r % 2 == 0) { // раскрасили строку
            specificParamsLine.classList.add('device-table__line_painted');
        }

        let specificParamsTitle = document.createElement('td');
        specificParamsTitle.classList.add('parameter-time');
        let requestTime = new Date(devData.data[r].dT);

        let timeOfLine = addZero(requestTime.getDate()) + '/' + addZero(requestTime.getMonth() + 1) + '/' + addZero(requestTime.getFullYear()) + ' ' + addZero(requestTime.getHours()) + ':' + addZero(requestTime.getMinutes());
        specificParamsTitle.textContent = timeOfLine;
        specificParamsLine.appendChild(specificParamsTitle);
        exportCsv += timeOfLine + '; ';

        for (let y = 0; y < devData.data[r].dTLine.length; y++) {
            specificParamsVal = document.createElement('td');
            specificParamsVal.classList.add('parameter-name');

            if (devData.data[r].dTLine[y].value === '-') {
                specificParamsVal.textContent = '-';
                exportCsv += '-; ';
            } else {
                let valOfPar = String(Number(devData.data[r].dTLine[y].value).toFixed(1));
                specificParamsVal.textContent = valOfPar;
                exportCsv += valOfPar + '; ';
            }
            specificParamsLine.appendChild(specificParamsVal);
        }
        paginationMassiv.push(specificParamsLine); // рисуем линию
        exportCsv += '\n\r';
    }
    if (deviceTableContent.contains(ul)) {
        deviceTableContent.removeChild(ul);
    }
    if (paginationMassiv.length > 289) {
        for (let lines = 0; lines < paginationMassiv.length; lines++) {
            deviceSpecParamsTbody.appendChild(paginationMassiv[lines]);
        }
    } else {
        // пагинация
        ul = document.createElement('ul');
        ul.id = 'pagination';
        ulBlock = document.createElement('ul');
        ulBlock.classList.add('ul-block');

        let countOfItems = Math.ceil(paginationMassiv.length / notesOnPage); // количество строк делим на кол-во записей на стр
        let items = [];

        for (let f = 1; f <= countOfItems; f++) {
            let li = document.createElement('li');
            li.classList.add('item-page');
            li.textContent = String(f);
            ulBlock.appendChild(li);
            items.push(li);
        }

        ul.appendChild(ulBlock);
        deviceTableContent.appendChild(ul);
        showPage(items[0]);

        for (let item of items) {
            item.addEventListener('click', function () {
                showPage(this);
            });
        }
        function showPage(item) {
            if (actLi) { // убираем подсветку с предыдущего li
                actLi.classList.remove('pagination-li_active');
            }
            actLi = item;

            item.classList.add('pagination-li_active');
            let pageNum = +item.innerHTML;
            let start = (pageNum - 1) * notesOnPage;
            let end = start + notesOnPage;
            let notes = paginationMassiv.slice(start, end);
            deviceSpecParamsTbody.textContent = '';
            for (let note of notes) {
                deviceSpecParamsTbody.appendChild(note); // рисуем поочерёдно строки
            }
        }
    }
}

// отрисовка фильтра
function drawFilter() {
    filterByDate.innerHTML = `Период с<input id="start" type="datetime-local" name="meeting-time" value="${new Date(firstTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '')}"/>по<input id="end" type="datetime-local" name="meeting-time" value="${new Date(lastTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '')}"/><button id="today" class="filter-by-date_active">Сегодня</button><button id="week">Неделя</button><button id="month">Месяц</button><button id="btn-download-data">Выгрузить данные</button>`;
    addEventsOnFilter();
}

function showCharts() {
    loadingNewData();
    deviceParamsTable.hidden = true; // закрыли таблицу с параметрами
    chartsBtn.classList.add('device-specific__nav-button_active');
    deviceParamsBtn.classList.remove('device-specific__nav-button_active');
    chartsContainer.hidden = false;
    chartsContainer.textContent = '';
    if (deviceTableContent.contains(ul)) {
        deviceTableContent.removeChild(ul);
    }
    getLabelsX(); // получение оси х (временные периоды)
    drawChartsFilter();
    for (let idCP = 0; idCP < viewDeviceChart.length; idCP++) {
        let idChartP = viewDeviceChart[idCP];
        drawChart(idChartP);
    };

    if (chartsContainer.contains(chartsContainerLoader)) {
        chartsContainer.removeChild(chartsContainerLoader);
    }
    if (deviceTableContent.contains(chartsContainerLoader)) {
        let loadingBlocks = document.querySelectorAll('.charts-container-loader');
        loadingBlocks.forEach(function (elem) {
            elem.parentNode.removeChild(elem);
        });
    }
    savePage = '3';
    sessionStorage.setItem('savePage', savePage);
}

function showParameters() {
    deviceTableContent.removeChild(channelSelection);
    chartsBtn.classList.remove('device-specific__nav-button_active');
    deviceParamsBtn.classList.add('device-specific__nav-button_active');
    loadingNewData();
    drawDevParameters();
}

function drawChartsFilter() {
    channelSelection = document.createElement('div');
    channelSelection.id = 'channel-selection';
    for (let i = 1; i < 4; i++) {
        channelSelBtn = document.createElement('button');
        channelSelBtn.id = `channel-selection-${i}`;
        channelSelBtn.textContent = `Канал ${i}`;
        if (i === 1) {
            channelSelBtn.classList.add(`color-channel-selection-1`)
        }
        channelSelBtn.addEventListener('click', () => {
            showRightCharts(i);
        })
        channelSelection.appendChild(channelSelBtn);
    }
    deviceTableContent.prepend(channelSelection);
}

function showRightCharts(i) {
    let channelBtns = channelSelection.childNodes;
    channelBtns.forEach((element) => {
        element.removeAttribute('class');
    })
    let changeChannelSelBtn = document.getElementById(`channel-selection-${i}`);
    changeChannelSelBtn.classList.add(`color-channel-selection-${i}`);

    let chartsArr = chartsContainer.childNodes;
    let idRCh = i - 1;
    chartsArr.forEach((element) => {
        element.hidden = true;
        let idEl = element.id.split('-')[2];
        for (let n = 0; n < idForCharts[idRCh].length; n++) {
            if (Number(idEl) === idForCharts[idRCh][n]) {
                element.hidden = false;
                break;
            }
        }
    })
}

function drawChart(idChartP) {
    canvasChart = document.createElement('canvas');
    chartBlock = document.createElement('div');
    chartBlock.id = `chart-block-${idChartP}`;
    getCartType(idChartP);
    getChartColor(idChartP);
    getLabelString(idChartP);
    getDataY(idChartP);
    let resolution = getResolution(numberOfRecords); // to do
    let dataVal = prepareChartsData(recordsForPeriod, periodData, resolution, idChartP);
    if (periodData != null) {
        chart = new Chart(canvasChart, {
            type: cType,
            data: {
                labels: dataVal.recordsForPeriod, // массив с параметрами на оси х
                datasets: [{
                    label: labelY,
                    data: dataVal.periodData, // массив с данными y
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
                            text: labelY,
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
        if (idChartP === 46 || idChartP === 47 || idChartP === 48) {
            drawEnergyChart(dataVal.recordsForPeriod, dataVal.periodData, idChartP);
        }
    }
}

function getLabelString(idChartP) {
    for (let p = 0; p < parametersDesc.length; p++) {
        if (parametersDesc[p].id_parameter === idChartP) {
            labelY = String(parametersDesc[p].parameter + ' ' + '(' + parametersDesc[p].measure_unit + ')');
            break;
        }
    }
}

function getLabelsX() {
    massivForComparison = [];
    recordsForPeriod = [];

    for (let numb = 0; numb < numberOfRecords; numb++) { // (за сутки 289)
        newRec = new Date(firstTime.getFullYear(), firstTime.getMonth(), firstTime.getDate(), firstTime.getHours(), firstTime.getMinutes() + 5 * (numb));
        recordsForPeriod.push(addZero(newRec.getDate()) + '/' + addZero(newRec.getMonth() + 1) + ' ' + addZero(newRec.getHours()) + ':' + addZero(newRec.getMinutes()));
        massivForComparison.push(newRec);
        if (recordsForPeriod[numberOfRecords]) {
            break;
        }
    }
    massivForComparison.reverse();
}

function getDataY(idChartP) {
    periodData = [];
    for (let i = 0; i < massivForComparison.length; i++) { // проходим по созданному массиву
        let valY = null;
        for (let dd = 0; dd < devData.data.length; dd++) { // проходим по полученным датам
            if (massivForComparison[i].setSeconds(0) === devData.data[dd].dT.setSeconds(0)) {
                for (let g = 0; g < devData.data[dd].dTLine.length; g++) {
                    if (devData.data[dd].dTLine[g].id_parameter === idChartP) { // находим нужный параметр
                        valY = Number(Number(devData.data[dd].dTLine[g].value).toFixed(1));
                        break;
                    }
                }
            }
        }
        periodData.push(valY);
    }
}

// comeback

function comeBack() {
    sessionStorage.removeItem('savePage');
    deviceSpecificParams.hidden = true;
    // запуск функции отрисовки общей таблицы
    if (!sessionStorage.getItem('savePage')) {
        drawDescriptions();
        drawContent();
    }

    deviceTable.hidden = false;

    devPageTitle = {
        complate: false,
        data: []
    }

    devDataDescription = {
        complate: false,
        data: []
    }

    devData = {
        complate: false,
        data: []
    }

    headerOutput = [];
    outputTitle = [];
    descTitle = [];
    devDataDescription = [];
    allSpecDeviceData = [];

    deviceSpecParamsThead.textContent = '';
    deviceSpecParamsTbody.textContent = '';
    deviceSpecificName.textContent = '';
    if (deviceTableContent.contains(ul)) {
        deviceTableContent.removeChild(ul);
    }
    loading.hidden = false;
    afterLoading.hidden = true;

    // close charts
    deviceParamsTable.hidden = false;
    deviceTableContent.removeChild(channelSelection);
    chartsBtn.classList.remove('device-specific__nav-button_active');
    deviceParamsBtn.classList.add('device-specific__nav-button_active');
    chartsContainer.hidden = true;
    chartsContainer.textContent = '';
}

function addEvents() {
    // back
    backВutton.addEventListener('click', () => { comeBack() });

    // spec device nav
    chartsBtn.addEventListener('click', () => { showCharts() });
    deviceParamsBtn.addEventListener('click', () => { showParameters() });
}

function addEventsOnFilter() {
    let filterStart = document.getElementById('start');
    filterStart.addEventListener('change', () => {
        filterBtnToday.classList.remove('filter-by-date_active');
        filterBtnWeek.classList.remove('filter-by-date_active');
        loadingNewData();
        let newFilterStart = new Date(filterStart.value);
        firstTime = new Date(parseInt(newFilterStart.getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
        getDevData();
    })
    let filterEnd = document.getElementById('end');
    filterEnd.addEventListener('change', () => {
        filterBtnToday.classList.remove('filter-by-date_active');
        filterBtnWeek.classList.remove('filter-by-date_active');
        loadingNewData();
        let newFilterEnd = new Date(filterEnd.value);
        lastTime = new Date(parseInt(newFilterEnd.getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
        getDevData();
    })
    let filterBtnToday = document.getElementById('today');
    filterBtnToday.addEventListener('click', () => {
        filterBtnToday.classList.add('filter-by-date_active');
        filterBtnWeek.classList.remove('filter-by-date_active');
        filterBtnMonth.classList.remove('filter-by-date_active');
        loadingNewData();
        lastTime = new Date(parseInt(new Date().getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
        firstTime = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate() - 1, lastTime.getHours(), lastTime.getMinutes());
        filterEnd.value = new Date(lastTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        filterStart.value = new Date(firstTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        getDevData();
    });
    let filterBtnWeek = document.getElementById('week');
    filterBtnWeek.addEventListener('click', () => {
        filterBtnWeek.classList.add('filter-by-date_active');
        filterBtnToday.classList.remove('filter-by-date_active');
        filterBtnMonth.classList.remove('filter-by-date_active');
        loadingNewData();
        lastTime = new Date(parseInt(new Date().getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
        firstTime = new Date(lastTime.getFullYear(), lastTime.getMonth(), lastTime.getDate() - 7, lastTime.getHours(), lastTime.getMinutes());
        filterEnd.value = new Date(lastTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        filterStart.value = new Date(firstTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        getDevData();
    });
    let filterBtnMonth = document.getElementById('month');
    filterBtnMonth.addEventListener('click', () => {
        filterBtnMonth.classList.add('filter-by-date_active');
        filterBtnToday.classList.remove('filter-by-date_active');
        filterBtnWeek.classList.remove('filter-by-date_active');
        loadingNewData();
        lastTime = new Date(parseInt(new Date().getTime() / 300000) * 300000); // последняя отметка времени, кратная 5
        firstTime = new Date(lastTime.getFullYear(), lastTime.getMonth() - 1, lastTime.getDate(), lastTime.getHours(), lastTime.getMinutes());
        filterEnd.value = new Date(lastTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        filterStart.value = new Date(firstTime.toString().split('GMT')[0] + ' UTC').toISOString().replace('Z', '');
        getDevData();
    });
    btnDownloadData = document.getElementById('btn-download-data');
    btnDownloadData.addEventListener('click', () => {
        letExportCsv();
    })
}

function letExportCsv() {
    let blob = new Blob([exportCsv], { type: "text/plain" });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", Date.now() + "data");
    link.click();
}

function loadingNewData() {
    if (deviceTableContent.contains(channelSelection)) {
        deviceTableContent.removeChild(channelSelection);
    }
    deviceParamsTable.hidden = true;
    chartsContainerLoader = document.createElement('div');
    loader = document.createElement('div');
    loader.classList.add('loader');
    chartsContainerLoader.appendChild(loader);
    chartsContainerLoader.classList.add('charts-container-loader');
    chartsContainer.textContent = '';
    deviceTableContent.appendChild(chartsContainerLoader);
    if (deviceTableContent.contains(ul)) {
        ul.hidden = true;
    }
}

// map

function getMap() {
    getMapR.open("GET", "http://" + current_host + `/api/v1/data/?id_parameter=13`);
    getMapR.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    getMapR.setRequestHeader('Authorization', 'Token ' + token);
    getMapR.send();
}

getMapR.onreadystatechange = function () {
    if (getMapR.readyState === 4 && getMapR.status === 200) {
        let payload = JSON.parse(getMapR.responseText);
        deviceСoordinates = payload.results;
        sessionStorage.setItem('deviceСoordinates', JSON.stringify(deviceСoordinates));
        drawMap();
    }
}

let markers = [];

function drawMap() {
    let dDeviceCoordinates = JSON.parse(sessionStorage.getItem('deviceСoordinates'));
    mapLoad.innerHTML = '';

    mapL = L.map('map-drawing').setView([55.753559, 37.60921], 7);

    let tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            "detectRetina": false,
            "maxNativeZoom": 18,
            "maxZoom": 18,
            "minZoom": 0,
            "noWrap": false,
            "opacity": 1,
            "subdomains": "abc",
            "tms": false
        }
    ).addTo(mapL);

    for (let i = 0; i < objectsList.length; i++) {
        for (let dcl = 0; dcl < dDeviceCoordinates.length; dcl++) {
            if (objectsList[i].id_object === dDeviceCoordinates[dcl].id_object) {
                let coord = dDeviceCoordinates[dcl].value.split(', ');
                let marker_name = 'mapMarker_' + dDeviceCoordinates[dcl].id_object;
                window[marker_name] = L.circleMarker(
                    [Number(coord[0]), Number(coord[1])],
                    {
                        "bubblingMouseEvents": true,
                        "color": "#1976D2",
                        "dashArray": null,
                        "dashOffset": null,
                        "fill": true,
                        "fillColor": "#F15928",
                        "fillOpacity": 0.8,
                        "fillRule": "evenodd",
                        "lineCap": "round",
                        "lineJoin": "round",
                        "opacity": 1.0,
                        "radius": 7,
                        "stroke": true,
                        "weight": 3
                    }
                );
                window[marker_name].addTo(mapL);


                let popupMap = L.popup({ "maxWidth": "100%" });

                var descMap = document.createElement('div');
                descMap.innerHTML = `<div id="descMap" style="width: 100.0%; height: 100.0%;"><font size="3">${objectsList[i].object_description}</font><button class="change-location__btn" onclick="changeLocation(${objectsList[i].id_object})">Изменить местоположение</button></div>`;

                popupMap.setContent(descMap);
                window[marker_name].bindPopup(popupMap);

                window[marker_name].addEventListener('click', () => {
                    getWidjetsForMap(objectsList[i].id_object);
                });
                break;
            }
        }
    }
}

checkToken();
addEvents();