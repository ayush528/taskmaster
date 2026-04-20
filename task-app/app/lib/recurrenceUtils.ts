import { RRule, RRuleSet, rrulestr, Weekday } from 'rrule';
import { RecurringRule, Task } from '../context/TaskContext';

function mapDaysToRRule(days: string[] | undefined): Weekday[] | undefined {
  if (!days || days.length === 0) return undefined;
  const dayMap: { [key: string]: Weekday } = {
    'MO': RRule.MO,
    'TU': RRule.TU,
    'WE': RRule.WE,
    'TH': RRule.TH,
    'FR': RRule.FR,
    'SA': RRule.SA,
    'SU': RRule.SU,
  };
  return days.map(d => dayMap[d.toUpperCase()]).filter(Boolean);
}

export function generateInstances(startDateStr: string, rule: RecurringRule, limit: number = 30): Date[] {
  const dtstart = new Date(startDateStr);
  // Reset time to start of day for cleaner RRule processing
  dtstart.setHours(0, 0, 0, 0);

  let freq: number = RRule.DAILY;
  let interval = rule.interval || 1;

  switch (rule.frequency) {
    case 'daily': freq = RRule.DAILY; break;
    case 'weekly': freq = RRule.WEEKLY; break;
    case 'biweekly': freq = RRule.WEEKLY; interval = 2; break;
    case 'monthly': freq = RRule.MONTHLY; break;
    case 'custom': freq = RRule.DAILY; break; // simplistic approach for 'custom'
  }

  const options: any = {
    freq,
    interval,
    dtstart,
  };

  if (rule.frequency === 'weekly' && rule.daysOfWeek && rule.daysOfWeek.length > 0) {
    options.byweekday = mapDaysToRRule(rule.daysOfWeek);
  }

  if (rule.endDate) {
    options.until = new Date(rule.endDate);
    options.until.setHours(23, 59, 59, 999);
  }
  
  if (rule.occurrenceCount) {
    options.count = rule.occurrenceCount;
  }

  // Fallback limit if endless
  if (!rule.endDate && !rule.occurrenceCount) {
    options.count = limit;
  }

  try {
    const rrule = new RRule(options);
    return rrule.all();
  } catch (e) {
    console.error("Failed to parse RRule", e);
    return [];
  }
}
