/**
 * Virtual file system structure for KaustubhOS
 * Maps directory paths to their contents
 */
export const fileSystem = {
  '/': 'boot_logs.txt\nabout.txt\ncontact.txt\nskills.txt\nprojects/',
  '/projects': 'kaustubh-os\nredis-from-scratch\nInsightInvest',
}

/**
 * File contents mapped by their full path
 */
export const fileContents = {
  '/boot_logs.txt':
    "[OK] Booting KaustubhOS \n[OK] Loading neural handshake...\n[OK] Mounting in-memory portfolio...\n[FAIL] Humor module missing. Proceeding anyway.\n[OK] System ready.\nType 'help' to begin.",

  '/about.txt':
    "Hi, I'm Kaustubh.\nBuilder of weird systems that almost work.\nI like things that glitch, hum, and blink green.",

  '/contact.txt':
    'You can find me on:\nEmail:    snigenigmatic972@gmail.com\nGitHub:   github.com/snigenigmatic\nLinkedIn: linkedin.com/in/c-kaustubh',

  '/skills.txt':
    '[LANGUAGES]\n  Go, JavaScript/TypeScript, Python, SQL\n\n[FRAMEWORKS]\n  React, Node.js, Gin (Go)\n\n[TOOLS]\n  Docker, Kubernetes, Git, AWS, xterm.js',

  '/projects/kaustubh-os':
    "[KaustubhOS] - This very portfolio!\n\nTYPE:     Personal Project\nSTACK:    Go, JavaScript, xterm.js\nSOURCE:   github.com/snigenigmatic/kaustubhOS\n\n'cat' a project file to see details.",

  '/projects/redis-from-scratch':
    '[Redis from Scratch] - Learning project\n\nTYPE:     Personal Project\nSTACK:    Go, Redis\nSOURCE:   github.com/snigenigmatic/redis-from-scratch\nNOTES:    Building a Redis clone to understand its internals.',

  '/projects/InsightInvest':
    '[InsightInvest] - Smart chatbot that helps you analyze any publicly traded company with just a name or ticker symbol. \n\nTYPE:     Hackathon Project\nSTACK:    React, FastAPI, Pandas, Redis, Next.js\nSOURCE:   github.com/snigenigmatic/InsightInvest',
}

/**
 * System log messages shown randomly
 */
export const systemLogs = [
  '[SYS] Initializing pseudo-random subsystems...',
  '[OK] Mounting /home/kaustubh',
  '[OK] Loading thought modules...',
  '[WARN] Memory leak detected in inspiration.dll',
  '[OK] Establishing neural handshake...',
]
