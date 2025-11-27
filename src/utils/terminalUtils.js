import { fileContents } from '../data/fileSystem'

/**
 * Write the command prompt to terminal
 * @param {Object} term - XTerm terminal instance
 * @param {string} cwd - Current working directory
 */
export function writePrompt(term, cwd) {
  term.write(`guest@kaustubhOS:${cwd}$ `)
}

/**
 * Redraw the prompt with current buffer content
 * @param {Object} term - XTerm terminal instance
 * @param {string} cwd - Current working directory
 * @param {string} buffer - Current command buffer
 */
export function redrawPrompt(term, cwd, buffer) {
  term.write('\x1b[2K\r') // Clear line and return to start
  writePrompt(term, cwd)
  term.write(buffer)
}

/**
 * Animate boot sequence with typing effect
 * @param {Object} term - XTerm terminal instance
 * @param {string} cwd - Current working directory
 * @returns {Promise<void>}
 */
export async function bootSequence(term, cwd) {
  const bootText = fileContents['/boot_logs.txt']
  const lines = bootText.split('\n')

  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      term.write(line[i])
      await new Promise(resolve => setTimeout(resolve, 40))
    }
    term.write('\r\n')
  }
  term.write('\r\n')
  writePrompt(term, cwd)
}

/**
 * Handle keyboard input for terminal
 * @param {Object} params - Handler parameters
 * @param {Object} params.e - Keyboard event
 * @param {Object} params.term - XTerm terminal instance
 * @param {Object} params.bufferRef - Reference to command buffer
 * @param {Object} params.cwdRef - Reference to current working directory
 * @param {Object} params.historyRef - Reference to command history
 * @param {Object} params.historyIndexRef - Reference to history index
 * @param {Function} params.executeCommand - Command execution function
 * @returns {Promise<void>}
 */
export async function handleKeyInput({
  e,
  term,
  bufferRef,
  cwdRef,
  historyRef,
  historyIndexRef,
  executeCommand,
}) {
  const key = e.domEvent.key
  const ctrl = e.domEvent.ctrlKey || e.domEvent.metaKey

  if (key === 'Enter') {
    const cmd = bufferRef.current.trim()
    if (cmd) {
      historyRef.current.push(cmd)
    }
    historyIndexRef.current = historyRef.current.length

    term.write('\r\n')
    bufferRef.current = ''

    if (cmd === 'clear') {
      if (typeof term.clear === 'function') term.clear()
      else if (typeof term.reset === 'function') term.reset()
      writePrompt(term, cwdRef.current)
      return
    }

    await executeCommand(cmd)
    writePrompt(term, cwdRef.current)
  } else if (key === 'Backspace') {
    if (bufferRef.current.length > 0) {
      bufferRef.current = bufferRef.current.slice(0, -1)
      redrawPrompt(term, cwdRef.current, bufferRef.current)
    }
  } else if (key === 'ArrowUp') {
    if (historyRef.current.length > 0) {
      historyIndexRef.current = Math.max(0, historyIndexRef.current - 1)
      bufferRef.current = historyRef.current[historyIndexRef.current] || ''
      redrawPrompt(term, cwdRef.current, bufferRef.current)
    }
  } else if (key === 'ArrowDown') {
    if (historyIndexRef.current < historyRef.current.length) {
      historyIndexRef.current = Math.min(
        historyRef.current.length,
        historyIndexRef.current + 1
      )
      bufferRef.current =
        historyIndexRef.current === historyRef.current.length
          ? ''
          : historyRef.current[historyIndexRef.current] || ''
      redrawPrompt(term, cwdRef.current, bufferRef.current)
    }
  } else if (ctrl && key.toLowerCase() === 'c') {
    term.write('^C\r\n')
    bufferRef.current = ''
    writePrompt(term, cwdRef.current)
  } else if (key.length === 1) {
    bufferRef.current += key
    term.write(key)
  }
}
