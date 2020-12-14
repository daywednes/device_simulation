import request from '@/utils/request'

export function getOrgs(data) {
    return request({
        url: '/org',
        method: 'get'
    })
}

export function createOrg(data) {
    return request({
        url: '/org',
        method: 'post',
        data
    })
}

export function deleteOrg(id) {
    return request({
        url: '/org/' + id,
        method: 'delete',
    })
}

export function updateOrg(data) {
    return request({
        url: '/org/' + this.data.id,
        method: 'patch',
        data
    })
}