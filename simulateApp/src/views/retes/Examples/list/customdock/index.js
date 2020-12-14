import ContextMenuPlugin from 'rete-context-menu-plugin'
import DockPlugin from 'rete-dock-plugin'
// import DockPlugin2 from './src/index'
// import ModulePlugin from 'rete-module-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import { initialize as init } from '@/views/retes/rete'
// import createController from './controller'
import MinimapPlugin from 'rete-minimap-plugin'
// import modules from '@/views/retes/rete/data/moduledefault.json'

import './styles.sass'

export default async function (container, extra) {
    const { editor, engine, resize, process } = await init(container)

    editor.clear();
    extra.classList.add('dock-menu')

    editor.use(ContextMenuPlugin, {
        searchBar: true,
        delay: 100,
        allocate(component) {
            return [component.item.type];
        },
        rename(component) {
            return component.name;
        }
    });
    
    // editor.use(MinimapPlugin);
    editor.use(DockPlugin, {
        container: extra,
        plugins: [VueRenderPlugin]
    });

    // editor.use(ModulePlugin, { engine, modules });


    // createController(container, { editor, modules, resize })
    resize()
    process()

    return { editor, engine }
}