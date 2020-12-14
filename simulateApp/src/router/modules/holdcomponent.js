/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const holdcomponentRouter = {
    path: '/holdcomponent',
    component: Layout,
    redirect: '/permission',
    name: 'holdcomponent',
    meta: {
        title: 'holdcomponent',
        icon: 'chart'
    },
    children: [{
            path: '/permission',
            component: Layout,
            redirect: '/permission/page',
            alwaysShow: true, // will always show the root menu
            name: 'Permission',
            meta: {
                title: 'Permission',
                icon: 'lock',
            },
            children: [{
                    path: 'page',
                    component: () =>
                        import ('@/views/permission/page'),
                    name: 'PagePermission',
                    meta: {
                        title: 'Page Permission',
                    }
                },
                {
                    path: 'directive',
                    component: () =>
                        import ('@/views/permission/directive'),
                    name: 'DirectivePermission',
                    meta: {
                        title: 'Directive Permission'
                            // if do not set roles, means: this page does not require permission
                    }
                },
                {
                    path: 'role',
                    component: () =>
                        import ('@/views/permission/role'),
                    name: 'RolePermission',
                    meta: {
                        title: 'Role Permission',
                    }
                }
            ]
        }, {
            path: '/icon',
            component: Layout,
            children: [{
                path: 'index',
                component: () =>
                    import ('@/views/icons/index'),
                name: 'Icons',
                meta: { title: 'Icons', icon: 'icon', noCache: true }
            }]
        }, {
            path: '/error',
            component: Layout,
            redirect: 'noRedirect',
            name: 'ErrorPages',
            meta: {
                title: 'Error Pages',
                icon: '404'
            },
            children: [{
                    path: '401',
                    component: () =>
                        import ('@/views/error-page/401'),
                    name: 'Page401',
                    meta: { title: '401', noCache: true }
                },
                {
                    path: '404',
                    component: () =>
                        import ('@/views/error-page/404'),
                    name: 'Page404',
                    meta: { title: '404', noCache: true }
                }
            ]
        },

        {
            path: '/error-log',
            component: Layout,
            children: [{
                path: 'log',
                component: () =>
                    import ('@/views/error-log/index'),
                name: 'ErrorLog',
                meta: { title: 'Error Log', icon: 'bug' }
            }]
        },

        {
            path: '/zip',
            component: Layout,
            redirect: '/zip/download',
            alwaysShow: true,
            name: 'Zip',
            meta: { title: 'Zip', icon: 'zip' },
            children: [{
                path: 'download',
                component: () =>
                    import ('@/views/zip/index'),
                name: 'ExportZip',
                meta: { title: 'Export Zip' }
            }]
        },

        {
            path: '/clipboard',
            component: Layout,
            children: [{
                path: 'index',
                component: () =>
                    import ('@/views/clipboard/index'),
                name: 'ClipboardDemo',
                meta: { title: 'Clipboard', icon: 'clipboard' }
            }]
        },
    ]
}

export default holdcomponentRouter