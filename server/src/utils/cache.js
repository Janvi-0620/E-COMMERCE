// ============================================
// Redis Cache Utility
// ============================================
// Wrapper for Redis client with helper methods

import { createClient } from 'redis';
import env from '../config/env.js';
import logger from './logger.js';

let redisClient = null;

const initRedis = async () => {
  if (env.server.mockMode) return null;
  if (redisClient) return redisClient;

  try {
    redisClient = createClient({
      url: `redis://${env.redis.host}:${env.redis.port}`,
      password: env.redis.password
    });

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('✅ Redis Connected'));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('❌ Redis Connection Failed', error);
    return null;
  }
};

const get = async (key) => {
  if (!redisClient) await initRedis();
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const set = async (key, value, ttl = 3600) => {
  if (!redisClient) await initRedis();
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl
    });
    return true;
  } catch (error) {
    return false;
  }
};

const del = async (key) => {
  if (!redisClient) await initRedis();
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    return false;
  }
};

const delPattern = async (pattern) => {
  if (!redisClient) await initRedis();
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  initRedis,
  get,
  set,
  del,
  delPattern
};
