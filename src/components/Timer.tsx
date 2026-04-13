import { useEffect, useState } from "react";

export default function Timer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(endTime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft <= 0) return <span>Auction Ended</span>;

  const seconds = Math.floor(timeLeft / 1000) % 60;
  const minutes = Math.floor(timeLeft / (1000 * 60)) % 60;
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));

  return (
    <span>
      {hours}h {minutes}m {seconds}s
    </span>
  );
}