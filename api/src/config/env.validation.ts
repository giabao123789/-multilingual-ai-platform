const requiredVariables = ['DATABASE_URL', 'JWT_SECRET', 'OPENAI_API_KEY'] as const;

export function validateEnvironment(config: Record<string, unknown>) {
  for (const key of requiredVariables) {
    const value = config[key];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`Environment variable ${key} is required.`);
    }
  }

  return config;
}
