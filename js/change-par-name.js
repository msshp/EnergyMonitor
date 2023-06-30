'use strict';

let postNewParameterName = new XMLHttpRequest();
let reqCheckParName = new XMLHttpRequest();

let cColor;
let cType;

let objNewParNames = []; // изменение названий параметров

if (sessionStorage.getItem('objNewParNames')) {
    objNewParNames = sessionStorage.getItem('objNewParNames');
}

function changeParameterName(idPar, idObj) {
    let newParName = document.getElementById(`change-par-name-${idPar}`).value;
    let newMsgPName = JSON.stringify({
        "value": `${idPar}, ${newParName}`,
        "id_object": idObj,
        "id_parameter": 76
    });
    postNewParameterName.open("POST", "http://" + current_host + `/api/v1/data/?id_object=${idObj}&id_parameter=76`);
    postNewParameterName.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    postNewParameterName.setRequestHeader('Authorization', 'Token ' + token);
    postNewParameterName.send(newMsgPName);
}

postNewParameterName.onreadystatechange = () => {
    if (!postNewParameterName.readyState || !postNewParameterName.status) {
        alert('Нет связи с сервером');
    } else if (!postNewParameterName.readyState && !postNewParameterName.status) {
        alert('Нет связи с сервером');
    }
    if (postNewParameterName.status !== 201) {
        alert('Нет связи с сервером');
    }
    if (postNewParameterName.readyState === 4 && postNewParameterName.status === 201) {
        console.log('новое название отправлено');
    }
}

function checkNewParName() {
    reqCheckParName.open("GET", "http://" + current_host + `/api/v1/data/?id_parameter=76`);
    reqCheckParName.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    reqCheckParName.setRequestHeader('Authorization', 'Token ' + token);
    reqCheckParName.send();

    reqCheckParName.onreadystatechange = function () {
        if (reqCheckParName.readyState === 4 && reqCheckParName.status === 200) {
            let payload = JSON.parse(this.responseText);
            objNewParNames = payload.results;  // получили массив объектов
            sessionStorage.setItem('objNewParNames', objNewParNames);
        }
    }
}

function getNewName(idObj, idPar) {
    let newName = null;
    for (let i = 0; i < objNewParNames.length; i++) {
        if (idObj === objNewParNames[i].id_object) {
            let thisPar = objNewParNames[i].value.split(',');
            if (Number(thisPar[0]) === idPar) {
                newName = thisPar[1];
                break;
            }
        }
    }
    return newName;
}

function getCartType(idChartP) {
    if (idChartP === 17 || idChartP === 23 || idChartP === 18 || idChartP === 24 || idChartP === 19 || idChartP === 35) {
        cType = 'line';
    } else if (idChartP === 46 || idChartP === 47 || idChartP === 48) {
        cType = 'bar';
    }
}

function getChartColor(idChartP) {
    if (idChartP === 17 || idChartP === 23 || idChartP === 46) {
        cColor = '#1976D2';
    } else if (idChartP === 18 || idChartP === 24 || idChartP === 47) {
        cColor = '#D21976';
    } else if (idChartP === 19 || idChartP === 35 || idChartP === 48) {
        cColor = '#76D219';
    }
}