export const database = {
  type: process.env.TYPEORM_CONNECTION || '',
  url: process.env.TYPEORM_URL || '',
  logging: process.env.TYPEORM_LOGGING === 'true',
  ssl: process.env.TYPEORM_SSL === 'true'
}
