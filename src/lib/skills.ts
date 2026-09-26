import type { Context } from '@opencode/plugin/promise/plugin'
import { Skill } from '@opencode/plugin'
import { existsSync, readdirSync, readFileSync } from 'fs'
import { basename, join } from 'path'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

type Frontmatter = {
  meta: Record<string, string>
  body: string
}

function parseFrontmatter(raw: string): Frontmatter {
  const match = raw.match(FRONTMATTER)

  if (!match) {
    return { meta: {}, body: raw }
  }

  const meta: Record<string, string> = {}

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }

  return { meta, body: raw.slice(match[0].length) }
}

function loadSkill(path: string, id: string): Skill.Info {
  const { meta, body } = parseFrontmatter(readFileSync(path, 'utf-8'))

  return {
    id,
    name: meta['name'] ?? id,
    ...(meta['description'] ? { description: meta['description'] } : {}),
    path,
    content: body,
  } as Skill.Info
}

function loadSkills(skillsDir: string): Skill.Info[] {
  const skills: Skill.Info[] = []

  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const path = join(skillsDir, entry.name, 'SKILL.md')
      if (existsSync(path)) {
        skills.push(loadSkill(path, entry.name))
      }
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      skills.push(loadSkill(join(skillsDir, entry.name), basename(entry.name, '.md')))
    }
  }

  return skills
}

// V2 dropped the config hook, so the bundled skills are registered directly
// instead of being added to config.skills.paths
export async function registerSkills(ctx: Context, skillsDir: string) {
  let skills: Skill.Info[]

  try {
    skills = loadSkills(skillsDir)
  } catch {
    return
  }

  if (skills.length === 0) {
    return
  }

  await ctx.skill.transform((editor) => {
    for (const skill of skills) {
      editor.add(skill)
    }
  })
}
