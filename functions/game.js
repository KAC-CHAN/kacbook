// functions/game.js
export class GameRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.clients = new Set();
    this.round = { id: 1, bets: [], status: 'waiting', result: null };
    console.log('GameRoom initialized', this.round);
    this.startLoop();
  }

  startLoop() {
    console.log('Starting game loop');
    // Immediate first tick
    this.tick();
    // Subsequent ticks every 35s
    this.interval = setInterval(() => this.tick(), 35000);
  }

  async tick() {
    console.log(`Round ${this.round.id} WAITING phase started`);
    this.round.status = 'waiting';
    this.broadcast({ type: 'new_round', round: this.round });
    await this.delay(25000);

    console.log(`Round ${this.round.id} LOCK phase`);
    this.round.status = 'locked';
    this.broadcast({ type: 'locked', round: this.round });
    await this.delay(5000);

    console.log(`Round ${this.round.id} calculating outcome`);
    const result = this.calculateOutcome();
    this.round.status = 'payout';
    this.round.result = result;
    console.log('Outcome:', result);
    this.broadcast({ type: 'payout', round: this.round });
    // Reset bets for next round
    this.round.bets = [];
    this.round.id += 1;
  }

  calculateOutcome() {
    console.log('Generating zone ranges');
    const zones = this.getZoneRanges();
    console.log('Zones:', zones);
    const index = this.randomInt(0, zones.length - 1);
    const crash = (zones[index].min + zones[index].max) / 2;
    console.log(`Selected zone ${zones[index].name} crash multiplier ${crash.toFixed(2)}`);
    return { crash, zones };
  }

  getZoneRanges() {
    return [
      { name: 'A', min: 1.0, max: 1.2 + Math.random() * 0.3 },
      { name: 'B', min: 1.3, max: 1.6 + Math.random() * 0.5 },
      { name: 'C', min: 1.7, max: 2.5 + Math.random() * 1.0 }
    ];
  }

  randomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  fetch(request) {
    console.log('Fetch request received', request.url, request.headers.get('Upgrade'));
    if (request.headers.get('Upgrade') !== 'websocket') {
      console.error('Expected WebSocket upgrade');
      return new Response('Expected WebSocket', { status: 400 });
    }
    const [client, server] = new WebSocketPair();
    server.accept();
    this.clients.add(server);

    server.addEventListener('message', evt => this.handleMessage(evt, server));
    server.addEventListener('close', () => {
      console.log('Client disconnected');
      this.clients.delete(server);
    });

    console.log('Client connected, sending init');
    server.send(JSON.stringify({ type: 'init', round: this.round }));
    return new Response(null, { status: 101, webSocket: client });
  }

  handleMessage(evt, client) {
    console.log('Received message', evt.data);
    let msg;
    try {
      msg = JSON.parse(evt.data);
    } catch (e) {
      console.error('Invalid JSON', e);
      return;
    }
    if (msg.type === 'bet' && this.round.status === 'waiting') {
      console.log('Placing bet', msg);
      this.round.bets.push(msg);
      this.broadcast({ type: 'bet_placed', bet: msg });
    } else {
      console.warn('Ignored message', msg);
    }
  }

  broadcast(data) {
    const msg = JSON.stringify(data);
    console.log('Broadcasting', msg);
    this.clients.forEach(c => c.send(msg));
  }
}
