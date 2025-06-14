// frontend/src/components/BetPanel.tsx
import { useState } from 'react';
import { Button, Input } from 'shadcn-ui';
export function BetPanel({ ws, user }) {
  const [amount, setAmount] = useState(0);
  const [zone, setZone] = useState('A');
  const placeBet = () => {
    const msg = { type: 'bet', user, amount, zone };
    console.log('Sending bet', msg);
    ws.send(JSON.stringify(msg));
  };
  return (
    <div className="p-4 bg-white/50 backdrop-blur rounded-2xl shadow-lg space-y-2">
      <Input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(+e.target.value)} />
      <select className="w-full p-2 rounded-lg" value={zone} onChange={e => setZone(e.target.value)}>
        {['A','B','C'].map(z => <option key={z}>{z}</option>)}
      </select>
      <Button onClick={placeBet} className="w-full">Place Bet</Button>
    </div>
  );
}
