import request from '@/utils/request'

export function getDeviceStatus(data) {
    return request({
        url: '/deviceStatus',
        method: 'get'
    })
}

export function getDeviceStatusById(hubId) {
    return request({
        url: '/deviceStatus/' + hubId,
        method: 'get'
    })
}

export function createDeviceStatus(data) {
    return request({
        url: '/deviceStatus',
        method: 'post',
        data
    })
}

export function deleteDeviceStatus(id) {
    return request({
        url: '/deviceStatus/' + id,
        method: 'delete',
    })
}

export function updateDeviceStatus(data) {
    return request({
        url: '/deviceStatus',
        method: 'patch',
        data
    })
}