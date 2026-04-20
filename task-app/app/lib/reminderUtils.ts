export function calculateTriggerTime(deadlineISO: string, offsetLabel: string, customTime?: string): string {
  // If custom time
  if (offsetLabel === 'Custom' && customTime) {
    return new Date(customTime).toISOString();
  }

  const deadline = new Date(deadlineISO);
  if (isNaN(deadline.getTime())) {
    // fallback if no proper deadline provided
    const defaultDate = new Date();
    defaultDate.setHours(defaultDate.getHours() + 24);
    return defaultDate.toISOString();
  }
  
  // Calculate offset in minutes
  let minutes = 0;
  switch (offsetLabel) {
    case '0 minutes before': minutes = 0; break;
    case '30 minutes before': minutes = 30; break;
    case '1 hour before': minutes = 60; break;
    case '6 hours before': minutes = 6 * 60; break;
    case '1 day before': minutes = 24 * 60; break;
    case '2 days before': minutes = 48 * 60; break;
    case '1 week before': minutes = 7 * 24 * 60; break;
    default: minutes = 0;
  }

  const trigger = new Date(deadline.getTime() - minutes * 60000);
  return trigger.toISOString();
}

export function formatReminderTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function isReminderActive(triggerTime: string, snoozedUntil?: string | null): boolean {
  const now = new Date();
  
  if (snoozedUntil) {
    const snoozeDate = new Date(snoozedUntil);
    if (now < snoozeDate) return false; // currently snoozed
  }

  const trigger = new Date(triggerTime);
  return now >= trigger;
}
