import request from '@/utils/request'

export function getActivity(data) {
    return request({
        url: '/activity',
        method: 'get'
    })
}

export function getActivityById(hubId) {
    return request({
        url: '/activity/' + hubId,
        method: 'get'
    })
}

export function createActivity(data) {
    return request({
        url: '/activity',
        method: 'post',
        data
    })
}

export function deleteActivity(id) {
    return request({
        url: '/activity/' + id,
        method: 'delete',
    })
}

export function updateActivity(data) {
    return request({
        url: '/activity',
        method: 'patch',
        data
    })
}