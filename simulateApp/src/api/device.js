import request from '@/utils/request'

export function getAlldevices() {
    return request({
        url: '/device/',
        method: 'get'
    })
}
export function getDevices(orgId) {
    return request({
        url: '/device/' + orgId,
        method: 'get'
    })
}
export function getDevicesAvail(orgId) {
    return request({
        url: '/device/getDevicesAvail/' + orgId,
        method: 'get'
    })
}
export function getDevicesByZone(zoneId) {
    return request({
        url: '/device/zone/' + zoneId,
        method: 'get'
    })
}
export function getDeviceDetails(orgId) {
    return request({
        url: '/device/details/' + orgId,
        method: 'get'
    })
}

export function createDevice(data) {
    return request({
        url: '/device',
        method: 'post',
        data
    })
}
export function addToZone(data) {
    return request({
        url: '/device/addToZone/',
        method: 'post',
        data
    })
}
export function removeFromZone(data) {
    return request({
        url: '/device/removeFromZone/',
        method: 'post',
        data
    })
}

export function deleteDevice(id) {
    return request({
        url: '/device/' + id,
        method: 'delete',
    })
}

export function updateDevice(data) {
    return request({
        url: '/device/' + data.id,
        method: 'post',
        data
    })
}