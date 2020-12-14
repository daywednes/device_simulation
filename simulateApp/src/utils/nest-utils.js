import store from '../store';
import _Vue from 'vue'

const paramMapKey = 'paramMap';
const dataSetMapKey = 'dataSetMap';
const ROWTYPE = {
    ROW_TYPE_NORMAL: 0,
    ROW_TYPE_INSERTED: 1,
    ROW_TYPE_UPDATED: 2,
    ROW_TYPE_DELETED: 3,
    ROW_TYPE_REMOVED: 4
}
const AUTOMATION_TYPE = {
    AUTOMATION: 0,
    ALARM: 1
}
const DeviceGroup = {
    Zone_Input: "Zone Input",
    Zone_Output: "Zone Output",
    Contact_Sensor: "Contact Sensor",
    Motion_Sensor: "Motion Sensor",
    Radar_Sensor: "Radar Sensor",
    Camera: "Camera",
}

const POPUP_CODE = {
    CENTER: "P$_MST_CT_01",
    USER_GROUP: "P$_UserGrpInfo_01",
    WAREHOUSE: "P$_MST_WAREHOUSE",
    PARTNER: "P$_MST_PARTNER",
    PROGRAM: "P$_ProgInfo_01"
}

const GLOBAL_SETTING = {
    SUB_MENU_NUMBER_COLUMN: "SUB_MENU_NUMBER_COLUMN"
}

function readGlobalSetting(code) {
    if (store.getters.gds_GlobalSetting) {

        let setting = store.getters.gds_GlobalSetting
            .find(val => val.DSETCODE == code)
        return !setting ? null : setting.SETVAL1 && setting.SETVAL1 != "" ? setting.SETVAL1 :
            (setting.SETVAL2 && setting.SETVAL2 != "" ? setting.SETVAL2 :
                (setting.SETDFT && setting.SETDFT != "" ? setting.SETDFT : null))
    }
    return null;
}

function loadCommonCode(commonCode, callback, config = { allSystem: false }) {
    const ds_loginInfo = store.getters.ds_loginInfo[0]
    const searchBody = { paramMap: {}, dataSetMap: {} }
    const gds_codeCond = {}
    gds_codeCond.CODE = commonCode
    gds_codeCond.CODEVALUE = ''
    if (!config.allSystem) {
        gds_codeCond.SYSGB = ds_loginInfo.SYSGB
    }
    gds_codeCond.AUTHGRP = ''
    gds_codeCond.LAKEY = ds_loginInfo.LAKEY
    searchBody.dataSetMap.gds_codeCond = [{ ...gds_codeCond }]

    // var result = callApi(methods.POST, 'systems/selectMultiCodeList.do', searchBody, null, true, function() {
    //     var promise = loadCommonCode(commonCode)
    //     if (typeof callback == 'function') {
    //         promise.then(callback)
    //     }
    // }).then(function(response) {
    //     // console.log(response.data);
    //     const data = response.data.dataset
    //     const result = {}
    //     const codeList = commonCode.split(',')
    //     codeList.forEach(code => {
    //         const dataList = data.gds_multiCodeList.filter(d => d.MAINCD === code)
    //         result['ds_' + code] = dataList
    //     })
    //     return result
    // })
    // if (typeof callback == 'function') {
    //     result.then(function(data) {
    //         callback(data);
    //         return data;
    //     })
    // }
    // return result
    return null
}

function confirmDBChange() {
    return true
}

function confirmDeactivate() {
    return true
}

function confirmDeleteScenario() {
    return true
}

function confirmOnSave() {
    return true
}

function confirmOnDelete() {
    return true
}

function confirmOnDiscardChanges() {
    return true
}

function alertOnMissingProperty(propertyName) {
    alert(`[${propertyName}] Missing.`)
}


/**
 * open a dialog, the dialog must have prop "result" to receive data from dialog
 * @param {HTMLElement} vm 
 * @param {*} component 
 * @param {*} data 
 * @return {*}
 */
function dialog(vm, component, data) {
    const i18n = vm.$i18n
    return new Promise(async (resolve, reject) => {

        // I'm combining a bunch of stuff to make this work.
        // First, create the vue component
        var dialogInstance = _Vue.extend(component); // component, imported at top of Sublib
        var oComponent = new dialogInstance({
            propsData: {
                input: data,
                result: {}
            },
            i18n: i18n,
            store: vm.$store
        }).$mount();

        // now add it to the DOM
        let parentEl = document.getElementById(vm.$el.id) ? document.getElementById(vm.$el.id) : document.getElementById('app');
        var oEl = parentEl.appendChild(oComponent.$el);

        // Add a listener so we can get the value and return it
        oComponent.$watch('result', function (newVal, oldVal) {
            // this is triggered when they chose an option
            // Delete the component / element now that I'm done
            oEl.remove();
            resolve(newVal);
        })
    }); // promise
}

export default {
    alertOnMissingProperty,
    confirmOnDelete,
    confirmDBChange,
    confirmDeactivate,
    confirmDeleteScenario,
    confirmOnDiscardChanges,
    confirmOnSave,
    loadCommonCode,
    readGlobalSetting,
    dialog,
    paramMapKey,
    dataSetMapKey,
    GLOBAL_SETTING,
    POPUP_CODE,
    ROWTYPE,
    AUTOMATION_TYPE,
    DeviceGroup
}