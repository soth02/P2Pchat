import { readFileSync } from 'fs'
import { expect, test } from 'vitest'

test('netlify config exists and has correct settings', () => {
  const config = readFileSync('netlify.toml', 'utf8').trim()
  expect(config).toBe('[build]\ncommand = "npm run build"\npublish = "dist"')
})
