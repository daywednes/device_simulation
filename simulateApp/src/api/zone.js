import request from '@/utils/request'

export function getZones(orgId) {
    return request({
        url: '/zone/' + orgId,
        method: 'get'
    })
}
export function getZonesHub(hubId) {
    return request({
        url: '/zone/hub/' + hubId,
        method: 'get'
    })
}
export function getZoneDetails(orgId) {
    return request({
        url: '/zone/details/' + orgId,
        method: 'get'
    })
}

export function createZone(data) {
    return request({
        url: '/zone',
        method: 'post',
        data
    })
}

export function deleteZone(id) {
    return request({
        url: '/zone/' + id,
        method: 'delete',
    })
}

export function updateZone(data) {
    return request({
        url: '/zone/' + data.id,
        method: 'patch',
        data
    })
}
export function updateZoneName(data) {
    return request({
        url: '/zone/updateZoneName',
        method: 'post',
        data
    })
}
export function saveChanges(data) {
    return request({
        url: '/zone/saveChanges',
        method: 'post',
        data
    })
}