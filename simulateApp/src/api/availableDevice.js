import request from '@/utils/request'

export function getAvailableDevices(data) {
    return request({
        url: '/availableDevices',
        method: 'get'
    })
}

export function getAvailableDevicesById(deviceId) {
    return request({
        url: '/availableDevices/' + deviceId,
        method: 'get'
    })
}

export function createAvailableDevices(data) {
    return request({
        url: '/availableDevices',
        method: 'post',
        data
    })
}

export function deleteAvailableDevices(id) {
    return request({
        url: '/availableDevices/' + id,
        method: 'delete',
    })
}

export function updateAvailableDevices(data) {
    return request({
        url: '/availableDevices',
        method: 'patch',
        data
    })
}