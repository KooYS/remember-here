import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'remember-here',
  brand: {
    displayName: 'RememberHere',
    primaryColor: '#3182F6',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite --host',
      build: 'tsc -b && vite build',
    },
  },
  permissions: [
    { name: 'camera', access: 'access' },
    { name: 'photos', access: 'read' },
    { name: 'location', access: 'access' },
  ],
  outdir: 'dist',
  webViewProps: {
    type: 'partner',
  },
});
