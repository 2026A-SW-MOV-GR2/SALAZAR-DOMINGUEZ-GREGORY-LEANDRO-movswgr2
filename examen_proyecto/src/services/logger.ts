export type LogLevel = 'DEBUG' | 'INFO' | 'ERROR';

function write(level: LogLevel, message: string, meta?: unknown) {
  const suffix = meta === undefined ? '' : ` ${JSON.stringify(meta)}`;
  // eslint-disable-next-line no-console
  console.log(`[${level}] ${message}${suffix}`);
}

export const logger = {
  debug(message: string, meta?: unknown) {
    write('DEBUG', message, meta);
  },
  info(message: string, meta?: unknown) {
    write('INFO', message, meta);
  },
  error(message: string, meta?: unknown) {
    write('ERROR', message, meta);
  },
};
