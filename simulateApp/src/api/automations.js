import request from '@/utils/request'

export function getAutomations(orgId) {
    return request({
        url: '/automations/' + orgId,
        method: 'get'
    })
}
export function getAutomationDetails(orgId) {
    return request({
        url: '/automations/details/' + orgId,
        method: 'get'
    })
}

export function createAutomation(data) {
    return request({
        url: '/automations',
        method: 'post',
        data
    })
}

export function updateautomationsByName(data) {
    return request({
        url: '/automations/updateautomationsByName',
        method: 'post',
        data
    })
}

export function deleteAutomation(id) {
    return request({
        url: '/automations/' + id,
        method: 'delete',
    })
}

export function updateAutomation(data) {
    return request({
        url: '/automations/' + data.id,
        method: 'patch',
        data
    })
}