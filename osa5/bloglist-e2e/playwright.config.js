// @ts-check
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 9000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: {}
    }
  ]
})