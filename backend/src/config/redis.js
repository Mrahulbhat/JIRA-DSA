import Redis from "redis";

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => console.error("Redis error", err));
redisClient.connect();

export default redisClient;
