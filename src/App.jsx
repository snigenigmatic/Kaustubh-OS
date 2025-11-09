import { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'
import './App.css'

// File system - matching your Go version exactly
const fileSystem = {
  '/': 'boot_logs.txt\nabout.txt\ncontact.txt\nskills.txt\nprojects/',
  '/projects': 'kaustubh-os\nredis-from-scratch\nInsightInvest',
}

const fileContents = {
  '/boot_logs.txt': '[OK] Booting KaustubhOS \n[OK] Loading neural handshake...\n[OK] Mounting in-memory portfolio...\n[FAIL] Humor module missing. Proceeding anyway.\n[OK] System ready.\nType \'help\' to begin.',
  
  '/about.txt': 'Hi, I\'m Kaustubh.\nBuilder of weird systems that almost work.\nI like things that glitch, hum, and blink green.',
  
  '/contact.txt': 'You can find me on:\nEmail:    snigenigmatic972@gmail.com\nGitHub:   github.com/snigenigmatic\nLinkedIn: linkedin.com/in/c-kaustubh',
  
  '/skills.txt': '[LANGUAGES]\n  Go, JavaScript/TypeScript, Python, SQL\n\n[FRAMEWORKS]\n  React, Node.js, Gin (Go)\n\n[TOOLS]\n  Docker, Kubernetes, Git, AWS, xterm.js',
  
  '/projects/kaustubh-os': '[KaustubhOS] - This very portfolio!\n\nTYPE:     Personal Project\nSTACK:    Go, JavaScript, xterm.js\nSOURCE:   github.com/snigenigmatic/kaustubhOS\n\n\'cat\' a project file to see details.',
  
  '/projects/redis-from-scratch': '[Redis from Scratch] - Learning project\n\nTYPE:     Personal Project\nSTACK:    Go, Redis\nSOURCE:   github.com/snigenigmatic/redis-from-scratch\nNOTES:    Building a Redis clone to understand its internals.',
  
  '/projects/InsightInvest': '[InsightInvest] - Smart chatbot that helps you analyze any publicly traded company with just a name or ticker symbol. \n\nTYPE:     Hackathon Project\nSTACK:    React, FastAPI, Pandas, Redis, Next.js\nSOURCE:   github.com/snigenigmatic/InsightInvest',
}

const systemLogs = [
  '[SYS] Initializing pseudo-random subsystems...',
  '[OK] Mounting /home/kaustubh',
  '[OK] Loading thought modules...',
  '[WARN] Memory leak detected in inspiration.dll',
  '[OK] Establishing neural handshake...',
]

function App() {
  const terminalRef = useRef(null)
  const linksRef = useRef(null)
  const [term, setTerm] = useState(null)
  const cwdRef = useRef('/')
  const bufferRef = useRef('')
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)

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
    setTerm(terminal)

    // Boot sequence with typing effect
    const bootSequence = async () => {
      const bootText = fileContents['/boot_logs.txt']
      const lines = bootText.split('\n')
      
      for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
          terminal.write(line[i])
          await new Promise(resolve => setTimeout(resolve, 40))
        }
        terminal.write('\r\n')
      }
      terminal.write('\r\n')
      writePrompt(terminal)
    }

    bootSequence()

    // Handle resize
    const handleResize = () => fitAddon.fit()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      terminal.dispose()
    }
  }, [])

  useEffect(() => {
    if (!term) return

    const handleKey = async (e) => {
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
          writePrompt(term)
          return
        }

        await executeCommand(cmd)
        writePrompt(term)
      } 
      else if (key === 'Backspace') {
        if (bufferRef.current.length > 0) {
          bufferRef.current = bufferRef.current.slice(0, -1)
          redrawPrompt()
        }
      }
      else if (key === 'ArrowUp') {
        if (historyRef.current.length > 0) {
          historyIndexRef.current = Math.max(0, historyIndexRef.current - 1)
          bufferRef.current = historyRef.current[historyIndexRef.current] || ''
          redrawPrompt()
        }
      }
      else if (key === 'ArrowDown') {
        if (historyIndexRef.current < historyRef.current.length) {
          historyIndexRef.current = Math.min(historyRef.current.length, historyIndexRef.current + 1)
          bufferRef.current = (historyIndexRef.current === historyRef.current.length) ? '' : (historyRef.current[historyIndexRef.current] || '')
          redrawPrompt()
        }
      }
      else if (ctrl && key.toLowerCase() === 'c') {
        term.write('^C\r\n')
        bufferRef.current = ''
        writePrompt(term)
      }
      else if (key.length === 1) {
        bufferRef.current += key
        term.write(key)
      }
    }

    const writePrompt = () => {
      term.write(`guest@kaustubhOS:${cwdRef.current}$ `)
    }

    const redrawPrompt = () => {
      term.write('\x1b[2K\r')
      writePrompt()
      term.write(bufferRef.current)
    }

    const executeCommand = async (cmd) => {
      const parts = cmd.trim().split(' ')
      const command = parts[0]
      const args = parts.slice(1)

      switch (command) {
        case 'help':
          term.writeln('Available commands:')
          term.writeln('ls')
          term.writeln('cd <dir>')
          term.writeln('cat <file>')
          term.writeln('links')
          term.writeln('whoami')
          term.writeln('date')
          term.writeln('uname -a')
          term.writeln('clear  (frontend)')
          term.writeln('help')
          term.writeln('sudo <cmd>')
          break

        case 'ls': {
          const listing = fileSystem[cwdRef.current]
          if (listing) {
            const items = listing.split('\n')
            items.forEach(item => {
              if (item.endsWith('/')) {
                term.writeln(`\x1b[34m${item}\x1b[0m`)
              } else {
                term.writeln(item)
              }
            })
          } else {
            term.writeln(`ls: ${cwdRef.current}: No such file or directory`)
          }
          break
        }

        case 'cd': {
          const dir = args[0]
          let newPath
          
          if (!dir || dir === '~') {
            newPath = '/'
          } else if (dir === '..') {
            if (cwdRef.current === '/') {
              newPath = '/'
            } else {
              newPath = cwdRef.current.substring(0, cwdRef.current.lastIndexOf('/')) || '/'
            }
          } else {
            if (cwdRef.current === '/') {
              newPath = '/' + dir
            } else {
              newPath = cwdRef.current + '/' + dir
            }
          }

          if (fileSystem[newPath]) {
            cwdRef.current = newPath
          } else {
            term.writeln(`cd: ${dir}: No such directory`)
          }
          break
        }

        case 'cat': {
          const file = args[0]
          if (!file) {
            term.writeln('cat: missing file operand')
            break
          }

          let filePath
          if (file.startsWith('/')) {
            filePath = file
          } else if (cwdRef.current === '/') {
            filePath = '/' + file
          } else {
            if (cwdRef.current === '/projects') {
              filePath = '/projects/' + file
            } else {
              filePath = cwdRef.current + '/' + file
            }
          }

          const content = fileContents[filePath]
          if (content) {
            term.write(content)
            if (!content.endsWith('\n')) term.writeln('')
          } else {
            term.writeln(`cat: ${file}: No such file`)
          }
          break
        }

        case 'links':
          term.writeln('LINKS_COMMAND')
          term.writeln('GitHub: https://github.com/snigenigmatic')
          term.writeln('LinkedIn: https://linkedin.com/in/c-kaustubh')
          term.writeln('Email: snigenigmatic972@gmail.com')
          
          // Render clickable links
          if (linksRef.current) {
            linksRef.current.innerHTML = ''
            const links = [
              'https://github.com/snigenigmatic',
              'https://linkedin.com/in/c-kaustubh',
              'mailto:snigenigmatic972@gmail.com'
            ]
            links.forEach(url => {
              const a = document.createElement('a')
              a.href = url
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              a.textContent = url
              linksRef.current.appendChild(a)
              linksRef.current.appendChild(document.createElement('br'))
            })
          }
          break

        case 'whoami':
          term.writeln('guest')
          break

        case 'date':
          term.writeln(new Date().toUTCString())
          break

        case 'uname':
          term.writeln('KaustubhOS v3.0 portfolio-server 1.0 GNU/Linux-ish')
          break

        case 'echo':
          term.writeln(args.join(' '))
          break

        case 'sudo':
          term.writeln('[sudo] password for guest: ********')
          await new Promise(resolve => setTimeout(resolve, 1000))
          const responses = [
            'Access granted. You now have root privileges.\nJust kidding. This is a static portfolio.',
            'Segmentation fault (core dumped)',
            'Warning: sudoers file corrupted, entering recovery mode...',
            'Permission denied. This incident will be reported. (Not really)'
          ]
          term.writeln(responses[Math.floor(Math.random() * responses.length)])
          break

        default:
          term.writeln(`bash: ${command}: command not found`)
          // Show system logs sometimes
          if (Math.random() > 0.4) {
            term.writeln('')
            term.writeln('\x1b[90m[system logs]\x1b[0m')
            const randomLogs = systemLogs.slice(0, 3)
            randomLogs.forEach(log => {
              if (log.startsWith('[OK]')) {
                term.writeln(`\x1b[32m${log}\x1b[0m`)
              } else if (log.startsWith('[WARN]')) {
                term.writeln(`\x1b[33m${log}\x1b[0m`)
              } else {
                term.writeln(`\x1b[90m${log}\x1b[0m`)
              }
            })
          }
      }
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
        <div ref={terminalRef} className="terminal" role="application" aria-label="Terminal"></div>
        <div ref={linksRef} className="links" aria-live="polite"></div>
      </main>

      <footer className="footer">
        Type <code><b>help</b></code> to get started
      </footer>
    </div>
  )
}

export default App