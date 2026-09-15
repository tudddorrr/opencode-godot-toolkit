import { describe, expect, test } from 'bun:test'
import { createFrameRewriter } from './lsp.js'

function frame(message: unknown) {
  const body = JSON.stringify(message)
  return `Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`
}

function open(languageId: string) {
  return frame({
    method: 'textDocument/didOpen',
    params: { textDocument: { uri: 'file:///a.gd', languageId, text: 'x' } },
  })
}

function bodyOf(output: string) {
  return JSON.parse(output.slice(output.indexOf('\r\n\r\n') + 4))
}

describe('createFrameRewriter', () => {
  test('relabels didOpen to gdscript', () => {
    const out: string[] = []
    createFrameRewriter((data) => out.push(data))(Buffer.from(open('plaintext')))
    expect(bodyOf(out.join('')).params.textDocument.languageId).toBe('gdscript')
  })

  test('passes non-didOpen frames through unchanged', () => {
    const out: string[] = []
    const message = frame({ method: 'textDocument/didChange', params: {} })
    createFrameRewriter((data) => out.push(data))(Buffer.from(message))
    expect(out.join('')).toBe(message)
  })

  test('reassembles frames split across chunks', () => {
    const out: string[] = []
    const rewrite = createFrameRewriter((data) => out.push(data))
    const message = open('plaintext')

    rewrite(Buffer.from(message.slice(0, 10)))
    expect(out).toHaveLength(0)

    rewrite(Buffer.from(message.slice(10)))
    expect(out).toHaveLength(1)
  })
})
