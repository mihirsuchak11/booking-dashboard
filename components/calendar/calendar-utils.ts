export const HOURS_24 = Array.from({ length: 24 }, (_, i) => {
  if (i === 0) return "12 AM";
  if (i < 12) return `${i} AM`;
  if (i === 12) return "12 PM";
  return `${i - 12} PM`;
});

export const HOUR_HEIGHT = 120;

// Calculate scroll offset to show current hour at the top with some padding
export function getInitialScrollOffset(): number {
  const now = new Date();
  const currentHour = now.getHours();
  // Scroll to 1 hour before current time (or 0 if early morning)
  const targetHour = Math.max(0, currentHour - 1);
  return targetHour * HOUR_HEIGHT;
}

export function getEventHeight(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startTotal = startHour * 60 + (startMin || 0);
  const endTotal = endHour * 60 + (endMin || 0);
  const duration = endTotal - startTotal;

  if (duration < 60) {
    return Math.max(24, Math.round((duration / 60) * HOUR_HEIGHT));
  }

  return Math.max(40, Math.round((duration / 60) * HOUR_HEIGHT));
}

export function getEventTop(startTime: string): number {
  const [hour, minute] = startTime.split(":").map(Number);
  const totalMinutes = hour * 60 + (minute || 0);
  const offset = totalMinutes * (HOUR_HEIGHT / 60);
  return Math.max(0, Math.round(offset));
}

export function getCurrentTimePosition(date: Date = new Date()): number {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const totalMinutes = hour * 60 + minute;
  const offset = totalMinutes * (HOUR_HEIGHT / 60);
  return Math.max(0, Math.round(offset));
}

export function getEventDuration(startTime: string, endTime: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  const startTotal = startHour * 60 + (startMin || 0);
  const endTotal = endHour * 60 + (endMin || 0);
  return endTotal - startTotal;
}

