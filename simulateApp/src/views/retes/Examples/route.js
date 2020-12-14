import list from './list'
const Example = () =>
    import ('./Example.vue')

export default [{
        path: '',
        redirect: list[0].key,
        name: list[0].key,
        // meta: { title: 'list[0].key' } 
    },
    {
        path: ':key',
        component: Example,
        // meta: { title: 'list[0].key' }
    }

    //UI Automation on Navigation bar
    // {
    //     path: '/' + list[0].key,
    //     name: list[0].key,
    //     component: Example,
    //     meta: { title: list[0].key, noCache: true },
    //     // meta: { title: 'list[0].key' } 
    // }, {
    //     path: '/' + list[1].key,
    //     name: list[1].key,
    //     component: Example,
    //     meta: { title: list[1].key, noCache: true },
    //     // meta: { title: 'list[0].key' } 
    // },
]