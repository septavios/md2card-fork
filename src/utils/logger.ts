/**
 * Development-only logging utility
 * Prevents console statements from appearing in production builds
 */

const isDevelopment = import.meta.env.DEV;

export const devLog = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

// For production error logging (always enabled for critical errors)
export const prodLog = {
  error: (...args: any[]) => {
    console.error(...args);
  },
  
  warn: (...args: any[]) => {
    console.warn(...args);
  }
};