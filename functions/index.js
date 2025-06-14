// functions/index.js
import { GameRoom } from './game';

export async function fetch(request, env) {
  console.log('Index fetch invoked');
  const id = env.GAME_ROOM.idFromName('MAIN');
  const room = env.GAME_ROOM.get(id);
  return room.fetch(request);
}
