import basic from './basic'
import readonly from './readonly'
import area from './area'
import module from './module'
import task from './task'
import customization from './customization'
import reroute from './reroute'
import dock from './dock'
import minimap from './minimap'
import customdock from './customdock'

export default [{
        key: 'Demo Automation',
        init: customdock,
        packages: [
            'rete',
            'rete-connection-plugin',
            'rete-vue-render-plugin',
            'rete-minimap-plugin',
            'rete-dock-plugin'
        ]
    },

    // {
    //     key: 'Zone2 Name2',
    //     init: readonly,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-readonly-plugin'
    //     ]
    // },
    // {
    //     key: 'Zone3',
    //     init: area,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-area-plugin'
    //     ]
    // },
    {
        key: 'module',
        init: module,
        packages: [
            'rete',
            'rete-connection-plugin',
            'rete-vue-render-plugin',
            'rete-module-plugin'
        ]
    },
    // {
    //     key: 'Zone5',
    //     init: task,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-task-plugin'
    //     ]
    // },
    // {
    //     key: 'Zone6',
    //     init: customization,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin'
    //     ]
    // },
    // {
    //     key: 'Zone7',
    //     init: reroute,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-connection-reroute-plugin'
    //     ]
    // },
    // {
    //     key: 'Zone8',
    //     init: dock,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-dock-plugin'
    //     ]
    // },
    // {
    //     key: 'minimap',
    //     init: minimap,
    //     packages: [
    //         'rete',
    //         'rete-connection-plugin',
    //         'rete-vue-render-plugin',
    //         'rete-minimap-plugin'
    //     ]
    // },
    {
        key: 'customization',
        init: customization,
        packages: [
            'rete',
            'rete-connection-plugin',
            'rete-vue-render-plugin',
            'rete-minimap-plugin',
            'rete-dock-plugin'
        ]
    }
]