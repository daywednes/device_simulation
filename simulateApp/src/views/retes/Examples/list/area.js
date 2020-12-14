import AreaPlugin from 'rete-area-plugin'
import { NumComponent } from '@/views/retes/rete/components/num-component'
import { AddComponent } from '@/views/retes/rete/components/add-component'
import { initialize as init } from '../../rete'
import data from '@/views/retes/rete/data/simple.json'

export default async function(container) {
  const { editor, engine, resize, process } = await init(container)

  editor.use(AreaPlugin, { scaleExtent: { min: 1, max: 1 }, translateExtent: { width: 500, height: 400 }});

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
