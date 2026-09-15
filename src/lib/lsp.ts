const HEADER_SEPARATOR = '\r\n\r\n'
const OPEN_METHOD = 'textDocument/didOpen'
const GDSCRIPT = 'gdscript'

// opencode labels .gd files "plaintext" (its extension map has no .gd entry),
// and Godot only parses documents whose language id it recognises
export function relabelGdscript(message: string) {
  if (!message.includes(OPEN_METHOD)) {
    return message
  }

  try {
    const json = JSON.parse(message)
    const doc = json?.params?.textDocument
    if (!doc) {
      return message
    }

    doc.languageId = GDSCRIPT
    return JSON.stringify(json)
  } catch {
    return message
  }
}

// LSP messages are Content-Length headers plus a JSON body; rewrite each
// complete message and pass anything else through untouched
export function createFrameRewriter(write: (data: string) => void) {
  let pending = Buffer.alloc(0)

  return (chunk: Buffer) => {
    pending = Buffer.concat([pending, chunk])

    while (true) {
      const headerEnd = pending.indexOf(HEADER_SEPARATOR)
      if (headerEnd === -1) {
        return
      }

      const header = pending.subarray(0, headerEnd).toString()
      const length = Number(header.match(/Content-Length:\s*(\d+)/i)?.[1])

      // not a framed LSP message: flush as-is and stop trying
      if (!Number.isFinite(length)) {
        write(pending.toString())
        pending = Buffer.alloc(0)
        return
      }

      const bodyStart = headerEnd + HEADER_SEPARATOR.length
      if (pending.length < bodyStart + length) {
        return
      }

      const body = pending.subarray(bodyStart, bodyStart + length).toString()
      const message = relabelGdscript(body)
      write(`Content-Length: ${Buffer.byteLength(message)}${HEADER_SEPARATOR}${message}`)
      pending = pending.subarray(bodyStart + length)
    }
  }
}
