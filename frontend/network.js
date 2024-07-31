export async function httpPostObj(object) {
  const url = './friday/score'
  const method = 'POST'
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  const body = JSON.stringify(object)

  const response = await fetch(url, { method, headers, body })
  const json = await response.json()

  return json
}

export async function httpPingStatus() {
  const url = './friday/ping'

  const method = 'POST'
  const headers = { 'Content-Type': 'text/plain' }
  const body = ''

  const response = await fetch(url, { method, headers, body})

  return response.status
}