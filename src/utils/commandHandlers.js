import { fileSystem, fileContents, systemLogs } from '../data/fileSystem'

/**
 * Execute a command and write output to terminal
 * @param {string} cmd - Command string to execute
 * @param {Object} term - XTerm terminal instance
 * @param {Object} refs - References object containing cwdRef and linksRef
 * @returns {Promise<void>}
 */
export async function executeCommand(cmd, term, refs) {
  const { cwdRef, linksRef } = refs
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

    case 'ls':
      handleLs(term, cwdRef.current)
      break

    case 'cd':
      handleCd(term, cwdRef, args)
      break

    case 'cat':
      handleCat(term, cwdRef.current, args)
      break

    case 'links':
      handleLinks(term, linksRef.current)
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
      await handleSudo(term)
      break

    default:
      handleUnknownCommand(term, command)
  }
}

/**
 * Handle 'ls' command - list directory contents
 * @param {Object} term - XTerm terminal instance
 * @param {string} cwd - Current working directory
 */
function handleLs(term, cwd) {
  const listing = fileSystem[cwd]
  if (listing) {
    const items = listing.split('\n')
    items.forEach(item => {
      if (item.endsWith('/')) {
        term.writeln(`\x1b[34m${item}\x1b[0m`) // Blue for directories
      } else {
        term.writeln(item)
      }
    })
  } else {
    term.writeln(`ls: ${cwd}: No such file or directory`)
  }
}

/**
 * Handle 'cd' command - change directory
 * @param {Object} term - XTerm terminal instance
 * @param {Object} cwdRef - Reference to current working directory
 * @param {string[]} args - Command arguments
 */
function handleCd(term, cwdRef, args) {
  const dir = args[0]
  let newPath

  if (!dir || dir === '~') {
    newPath = '/'
  } else if (dir === '..') {
    if (cwdRef.current === '/') {
      newPath = '/'
    } else {
      newPath =
        cwdRef.current.substring(0, cwdRef.current.lastIndexOf('/')) || '/'
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
}

/**
 * Handle 'cat' command - display file contents
 * @param {Object} term - XTerm terminal instance
 * @param {string} cwd - Current working directory
 * @param {string[]} args - Command arguments
 */
function handleCat(term, cwd, args) {
  const file = args[0]
  if (!file) {
    term.writeln('cat: missing file operand')
    return
  }

  let filePath
  if (file.startsWith('/')) {
    filePath = file
  } else if (cwd === '/') {
    filePath = '/' + file
  } else {
    if (cwd === '/projects') {
      filePath = '/projects/' + file
    } else {
      filePath = cwd + '/' + file
    }
  }

  const content = fileContents[filePath]
  if (content) {
    term.write(content)
    if (!content.endsWith('\n')) term.writeln('')
  } else {
    term.writeln(`cat: ${file}: No such file`)
  }
}

/**
 * Handle 'links' command - display clickable social links
 * @param {Object} term - XTerm terminal instance
 * @param {HTMLElement} linksElement - DOM element for rendering links
 */
function handleLinks(term, linksElement) {
  term.writeln('LINKS_COMMAND')
  term.writeln('GitHub: https://github.com/snigenigmatic')
  term.writeln('LinkedIn: https://linkedin.com/in/c-kaustubh')
  term.writeln('Email: snigenigmatic972@gmail.com')

  // Render clickable links
  if (linksElement) {
    linksElement.innerHTML = ''
    const links = [
      'https://github.com/snigenigmatic',
      'https://linkedin.com/in/c-kaustubh',
      'mailto:snigenigmatic972@gmail.com',
    ]
    links.forEach(url => {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
      a.textContent = url
      linksElement.appendChild(a)
      linksElement.appendChild(document.createElement('br'))
    })
  }
}

/**
 * Handle 'sudo' command - show humorous responses
 * @param {Object} term - XTerm terminal instance
 */
async function handleSudo(term) {
  term.writeln('[sudo] password for guest: ********')
  await new Promise(resolve => setTimeout(resolve, 1000))
  const responses = [
    'Access granted. You now have root privileges.\nJust kidding. This is a static portfolio.',
    'Segmentation fault (core dumped)',
    'Warning: sudoers file corrupted, entering recovery mode...',
    'Permission denied. This incident will be reported. (Not really)',
  ]
  term.writeln(responses[Math.floor(Math.random() * responses.length)])
}

/**
 * Handle unknown commands - show error and random system logs
 * @param {Object} term - XTerm terminal instance
 * @param {string} command - The unknown command
 */
function handleUnknownCommand(term, command) {
  term.writeln(`bash: ${command}: command not found`)
  // Show system logs sometimes
  if (Math.random() > 0.4) {
    term.writeln('')
    term.writeln('\x1b[90m[system logs]\x1b[0m')
    const randomLogs = systemLogs.slice(0, 3)
    randomLogs.forEach(log => {
      if (log.startsWith('[OK]')) {
        term.writeln(`\x1b[32m${log}\x1b[0m`) // Green
      } else if (log.startsWith('[WARN]')) {
        term.writeln(`\x1b[33m${log}\x1b[0m`) // Yellow
      } else {
        term.writeln(`\x1b[90m${log}\x1b[0m`) // Gray
      }
    })
  }
}
