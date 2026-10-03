import type { Context } from '@opencode/plugin/promise/plugin'
import { describe, expect, test } from 'bun:test'
import { mkdirSync, mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { registerSkills } from './skills.js'

function fakeCtx() {
  const added: Array<Record<string, unknown>> = []

  const editor = {
    add: (skill: Record<string, unknown>) => {
      added.push(skill)
    },
    list: () => [],
    get: () => undefined,
    update: () => {},
    remove: () => {},
  }

  const ctx = {
    skill: {
      transform: async (callback: (target: typeof editor) => void) => {
        callback(editor)
        return { dispose: async () => {} }
      },
    },
  }

  return { ctx: ctx as unknown as Context, added }
}

describe('registerSkills', () => {
  test('registers directory skills with parsed frontmatter', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'godot-skills-'))
    const skillDir = join(dir, 'my-skill')
    mkdirSync(skillDir)
    writeFileSync(
      join(skillDir, 'SKILL.md'),
      '---\nname: My Skill\ndescription: What it does\n---\n\n# My Skill\n\nBody text.\n',
    )

    const { ctx, added } = fakeCtx()
    await registerSkills(ctx, dir)

    expect(added).toHaveLength(1)
    const skill = added[0] as {
      id: string
      name: string
      description: string
      path: string
      content: string
    }
    expect(skill.id).toBe('my-skill')
    expect(skill.name).toBe('My Skill')
    expect(skill.description).toBe('What it does')
    expect(skill.path).toBe(join(skillDir, 'SKILL.md'))
    expect(skill.content).toBe('\n# My Skill\n\nBody text.\n')
  })

  test('registers root-level markdown skills by filename', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'godot-skills-'))
    writeFileSync(join(dir, 'flat.md'), '# Flat\n')

    const { ctx, added } = fakeCtx()
    await registerSkills(ctx, dir)

    expect(added).toHaveLength(1)
    const skill = added[0] as { id: string; name: string; content: string }
    expect(skill.id).toBe('flat')
    expect(skill.name).toBe('flat')
    expect(skill.content).toBe('# Flat\n')
  })

  test('ignores directories without SKILL.md and missing directories', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'godot-skills-'))
    mkdirSync(join(dir, 'empty'))

    const { ctx, added } = fakeCtx()
    await registerSkills(ctx, join(dir, 'does-not-exist'))
    await registerSkills(ctx, dir)

    expect(added).toHaveLength(0)
  })
})
