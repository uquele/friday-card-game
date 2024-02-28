export async function httpPostObj(object) {
  const url = '/score'
  const method = 'POST'
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const body = JSON.stringify(object)

  const response = await fetch(url, { method, headers, body})
  const json = await response.json()

  return json
}

export async function httpPing() {
  const url = '/ping'
  const method = 'POST'
  const headers = { 'Content-Type': 'text/plain' }

  const body = 'ping'

  const response = await fetch(url, { method, headers, body})
  const text = await response.text()

  console.log(text)

  return text === 'pong'
}