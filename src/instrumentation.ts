export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production') {
    process.on('unhandledRejection', (reason) => {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Unhandled promise rejection',
          metadata: { reason: String(reason) },
        }),
      );
    });

    process.on('uncaughtException', (error) => {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'error',
          message: 'Uncaught exception',
          metadata: { error: error.message, stack: error.stack },
        }),
      );
    });
  }
}
