// frontend/src/components/RoundDisplay.tsx
export function RoundDisplay({ round }) {
  console.log('Render RoundDisplay', round);
  return (
    <div className="p-4 bg-white/50 backdrop-blur rounded-2xl shadow-lg">
      <p className="text-lg">Round #{round.id}</p>
      <p>Status: <span className="font-semibold">{round.status}</span></p>
      {round.status === 'payout' && <p>Crash @ ×{round.result.crash.toFixed(2)}</p>}
    </div>
  );
}
