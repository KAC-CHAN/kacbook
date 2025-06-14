// frontend/src/pages/index.tsx
import { useEffect, useState } from 'react';
import { createGameSocket } from '../utils/ws';
import { Header } from '../components/Header';
import { RoundDisplay } from '../components/RoundDisplay';
import { BetPanel } from '../components/BetPanel';

export default function Home() {
  const [ws, setWs] = useState(null);
  const [round, setRound] = useState({ id: 0, status: 'loading', result: null });
  const user = `user_${Math.floor(Math.random()*100000)}`;

  useEffect(() => {
    const socket = createGameSocket();
    socket.addEventListener('message', evt => {
      console.log('WS message', evt.data);
      const msg = JSON.parse(evt.data);
      if (['init','new_round','locked','payout'].includes(msg.type)) {
        setRound(msg.round);
      }
    });
    setWs(socket);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 space-y-6">
      <Header />
      <RoundDisplay round={round} />
      {ws && <BetPanel ws={ws} user={user} />}
    </div>
  );
}
