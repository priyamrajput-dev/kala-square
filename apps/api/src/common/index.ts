// Common helpers, response schemas, and shared utilities for Fastify API

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
