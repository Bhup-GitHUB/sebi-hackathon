import { Hono } from 'hono'

type Bindings = {
  sebi_trading_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({ 
    message: 'SEBI Hackathon Trading Platform API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
})

app.get('/test-db', async (c) => {
  try {
    const result = await c.env.sebi_trading_db.prepare('SELECT * FROM users').all()
    return c.json({
      success: true,
      message: 'Database connected successfully!',
      users: result.results
    })
  } catch (error) {
    // Properly type the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return c.json({
      success: false,
      error: errorMessage
    }, 500)
  }
})

export default app