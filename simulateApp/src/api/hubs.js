import request from '@/utils/request'

export function getHubs(orgId) {
    return request({
        url: '/hubs/' + orgId,
        method: 'get'
    })
}
export function getHubDetails(orgId) {
    return request({
        url: '/hubs/details/' + orgId,
        method: 'get'
    })
}

export function createHub(data) {
    return request({
        url: '/hubs',
        method: 'post',
        data
    })
}

export function deleteHub(id) {
    return request({
        url: '/hubs/' + id,
        method: 'delete',
    })
}

export function updateHub(data) {
    return request({
        url: '/hubs/' + data.id,
        method: 'patch',
        data
    })
}