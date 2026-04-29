import { existsSync, cpSync, mkdirSync } from 'fs'
import { join } from 'path'

const skillsSource = join(import.meta.dir, '..', 'skills')
const agentsSource = join(import.meta.dir, '..', 'agents')

const projectRoot = process.env.INIT_CWD ?? process.cwd()
const opencodeDir = join(projectRoot, '.opencode')

mkdirSync(opencodeDir, { recursive: true })

const skillsTarget = join(opencodeDir, 'skills')
const agentsTarget = join(opencodeDir, 'agents')

function syncTo(target: string, source: string) {
  if (!existsSync(source)) {
    return
  }

  mkdirSync(target, { recursive: true })
  cpSync(source, target, { recursive: true, force: true })
}

syncTo(skillsTarget, skillsSource)
syncTo(agentsTarget, agentsSource)
