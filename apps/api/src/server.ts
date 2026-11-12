import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = await buildApp();

try {
  await app.listen({
    port: env.PORT,
    host: env.HOST,
  });
  app.log.info(`🚀 Kalasquare API server running at http://${env.HOST}:${env.PORT}`);
  app.log.info(`📚 Swagger documentation available at http://${env.HOST}:${env.PORT}/docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
