import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import './App.css'
import { executeCommand } from './utils/commandHandlers'
import { bootSequence, handleKeyInput } from './utils/terminalUtils'

/**
 * Main application component for KaustubhOS terminal portfolio
 * @returns {JSX.Element} The rendered app component
 */
function App() {
  const terminalRef = useRef(null)
  const linksRef = useRef(null)
  const [term, setTerm] = useState(null)
  const cwdRef = useRef('/')
  const bufferRef = useRef('')
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)

  // Initialize terminal and boot sequence
  useEffect(() => {
    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
      theme: {
        background: 'rgba(0, 0, 0, 0)',
        foreground: '#64ff7f',
        cursor: '#64ff7f',
      },
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.open(terminalRef.current)
    fitAddon.fit()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTerm(terminal)

    // Run boot sequence
    bootSequence(terminal, cwdRef.current)

    // Handle window resize
    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  // Setup keyboard event handler
  useEffect(() => {
    if (!term) return

    const handleKey = e => {
      const refs = {
        cwdRef,
        linksRef,
      }

      const commandExecutor = cmd => executeCommand(cmd, term, refs)

      handleKeyInput({
        e,
        term,
        bufferRef,
        cwdRef,
        historyRef,
        historyIndexRef,
        executeCommand: commandExecutor,
      })
    }

    term.onKey(handleKey)

    return () => {
      term.off('key', handleKey)
    }
  }, [term])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">KaustubhOS</div>
        <div className="controls">guest@kaustubhOS</div>
      </header>

      <main className="terminal-wrap">
        <div
          ref={terminalRef}
          className="terminal"
          role="application"
          aria-label="Terminal"
        ></div>
        <div ref={linksRef} className="links" aria-live="polite"></div>
      </main>

      <footer className="footer">
        Type{' '}
        <code>
          <b>help</b>
        </code>{' '}
        to get started
      </footer>
    </div>
  )
}

export default App
