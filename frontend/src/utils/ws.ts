// frontend/src/utils/ws.ts
import ReconnectingWebSocket from 'reconnecting-websocket';
export function createGameSocket() {
  const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
  const url = `${scheme}://${window.location.host}/api`;
  console.log('Connecting WebSocket to', url);
  const ws = new ReconnectingWebSocket(url);
  ws.addEventListener('open', () => console.log('WS open'));
  ws.addEventListener('close', () => console.log('WS closed'));
  ws.addEventListener('error', e => console.error('WS error', e));
  return ws;
}
