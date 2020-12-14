import ContextMenuPlugin from 'rete-context-menu-plugin'
import { NumComponent } from '@/views/retes/rete/components/num-component'
import { AddComponent } from '@/views/retes/rete/components/add-component'
import { initialize as init } from '@/views/retes/rete'
import data from '@/views/retes/rete/data/simple.json'

export default async function(container) {
  const { editor, engine, resize, process } = await init(container)

  editor.use(ContextMenuPlugin);

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
