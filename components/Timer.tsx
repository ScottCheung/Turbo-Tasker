type TimerProps = {
  milliseconds: number | null;
  over?: boolean;
  className?: string;
};

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

export function formatDuration(milliseconds: number) {
  const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export default function Timer({ milliseconds, over = false, className = "" }: TimerProps) {
  if (milliseconds === null) {
    return <span className={`tabular-nums ${className}`}>--:--</span>;
  }

  return (
    <span className={`tabular-nums ${className}`}>
      {over ? "OVER " : ""}
      {formatDuration(milliseconds)}
    </span>
  );
}
