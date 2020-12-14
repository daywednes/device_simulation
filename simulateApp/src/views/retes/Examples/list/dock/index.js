import ContextMenuPlugin from 'rete-context-menu-plugin'
import DockPlugin from 'rete-dock-plugin'
import VueRenderPlugin from 'rete-vue-render-plugin'
import { NumComponent } from '@/views/retes/rete/components/num-component'
import { AddComponent } from '@/views/retes/rete/components/add-component'
import { initialize as init } from '@/views/retes/rete'
import data from '@/views/retes/rete/data/simple.json'
import './styles.sass'

export default async function(container, extra) {
    const { editor, engine, resize, process } = await init(container)

    extra.classList.add('dock-menu')

    editor.use(ContextMenuPlugin)
    editor.use(DockPlugin, {
        container: extra,
        plugins: [VueRenderPlugin]
    });

    [
        new NumComponent(),
        new AddComponent()
    ].map(c => {
        editor.register(c)
        engine.register(c)
    })

    await editor.fromJSON(data)

    resize()
    process()

    return { editor, engine }
}