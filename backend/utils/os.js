const os = require('node:os')
const { exec } = require('node:child_process')

function getOperatingSystem() {
  switch (os.platform()) {
    case 'darwin':
      return 'macOS';
    case 'win32':
      return 'Windows';
    case 'linux':
      return 'Linux';
    default:
      return 'Unknown';
  }
}

function openLinkInDefaultBrowser(link) {
  const os = getOperatingSystem()

  let command;
  switch (os) {
    case 'Windows':
      command = 'start'
      break
    case 'macOS':
      command = 'open'
      break
    case 'Linux':
      command = 'xdg-open'
      break
    case 'Unknown':
    default:
      command = undefined
  }

  if (command) {
    exec(`${command} ${link}`, (err, stdout, stderr) => {
      if (err) console.log('Error opening default browser (err):', err.message)
      if (stderr) console.log('Error opening default browser (stderr):', stderr)
    })
  } else {
    console.log(`Can't open default browser as OS is unknown`)
  }
}

module.exports = { getOperatingSystem, openLinkInDefaultBrowser }