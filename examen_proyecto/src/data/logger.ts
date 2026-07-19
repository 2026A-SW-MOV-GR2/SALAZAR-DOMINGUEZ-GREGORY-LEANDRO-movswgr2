export type LogLevel = 'DEBUG' | 'INFO' | 'ERROR';

export function log(level: LogLevel, message: string, details?: Record<string, unknown>) {
  const suffix = details ? ` ${JSON.stringify(details)}` : '';
  console.log(`[${level}] ${message}${suffix}`);
}