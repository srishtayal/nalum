import { BASE_URL } from "./constants";

const KEEP_ALIVE_INTERVAL = 2 * 60 * 1000; // 2 minutes

let keepAliveInterval: NodeJS.Timeout | null = null;

const pingBackend = async () => {
  try {
    await fetch(`${BASE_URL}/health`, {
      method: "GET",
      cache: "no-store",
    });
    console.log("[Keep-Alive] Backend pinged successfully");
  } catch (error) {
    console.error("[Keep-Alive] Failed to ping backend:", error);
  }
};

export const startKeepAlive = () => {
  if (keepAliveInterval) {
    console.log("[Keep-Alive] Already running");
    return;
  }

  console.log("[Keep-Alive] Started - pinging every 2 minutes");
  
  // Ping immediately
  pingBackend();
  
  // Then ping every 2 minutes
  keepAliveInterval = setInterval(pingBackend, KEEP_ALIVE_INTERVAL);
};

export const stopKeepAlive = () => {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log("[Keep-Alive] Stopped");
  }
};
