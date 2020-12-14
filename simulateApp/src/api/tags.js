import request from '@/utils/request'

export function getTags(data) {
    return request({
        url: '/tags',
        method: 'get'
    })
}

export function getTagsById(deviceId) {
    return request({
        url: '/tags/' + deviceId,
        method: 'get'
    })
}

export function createTags(data) {
    return request({
        url: '/tags',
        method: 'post',
        data
    })
}

export function deleteTags(id) {
    return request({
        url: '/tags/' + id,
        method: 'delete',
    })
}

export function updateTags(data) {
    return request({
        url: '/tags',
        method: 'patch',
        data
    })
}