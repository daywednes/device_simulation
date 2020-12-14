/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import examplesRoute from '@/views/retes/Examples/route';

const retesRouter = {
    path: '/automation',
    component: Layout,
    redirect: '/',
    name: 'Automation',
    meta: {
        title: 'Automation',
        icon: 'chart'
    },
    children:

    //UI Automation on Navigation bar
    // examplesRoute

    //Default UI
        [{
            path: 'View',
            hidden: true,
            component: () =>
                import ('@/views/retes/Examples/'),
            name: 'View ',
            meta: { title: 'View', noCache: true },
            children: examplesRoute
        }, {
            path: 'View/Demo%20Automation',
            component: () =>
                import ('@/views/retes/Examples/'),
            name: 'Demo%20Automation',
            meta: { title: 'Automation', noCache: true },
        }

    ]
}

export default retesRouter