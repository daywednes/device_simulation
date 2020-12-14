import ContextMenuPlugin from 'rete-context-menu-plugin'
import TaskPlugin from 'rete-task-plugin'
import { MouseComponent } from '@/views/retes/rete/components/mouse-component'
import { EnterPressComponent } from '@/views/retes/rete/components/match-component'
import { AlertComponent } from '@/views/retes/rete/components/alert-component'
import { initialize as init } from '@/views/retes/rete'
import data from '@/views/retes/rete/data/task.json'
import { initEvents } from './events'
import alert from './alert'
import './style.sass'

export default async function(container) {
  const { editor, engine, resize, process } = await init(container)

  editor.use(ContextMenuPlugin)
  editor.use(TaskPlugin);

  [
    new MouseComponent(initEvents(container)),
    new EnterPressComponent(),
    new AlertComponent(alert(container))
  ].map(c => {
    editor.register(c)
    engine.register(c)
  })

  await editor.fromJSON(data)

  resize()
  process()

  return { editor, engine }
}
