// Define an interface for the app configuration
interface AppConfig {
  name: string;
  script: string;
  instances: number;
  autorestart: boolean;
  env: {
    PORT: number;
  };
}

const config: AppConfig[] = [
  {
    name: "frs-node-orm",
    script: "index.js", // Or your app's main entry file
    instances: 2, // Start with one instance for testing
    autorestart: true, // Automatically restart on crashes
    env: {
      PORT: 3000, // Specify the port your app listens on
    },
  },
];

// Export the configuration
export const apps = config;
