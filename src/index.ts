import { Hono } from 'hono'
import auth from './routes/auth'
import kyc from './routes/kyc'

type Bindings = {
  sebi_trading_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()


app.get('/', (c) => {
  return c.json({ 
    message: 'SEBI Hackathon Trading Platform API',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        signup: 'POST /auth/signup',
        login: 'POST /auth/login'
      },
      kyc: {
        register: 'POST /kyc/register',
        validate: 'POST /kyc/validate',
        status: 'GET /kyc/status'
      },
      database: 'GET /test-db'
    }
  })
})


app.get('/debug', async (c) => {
  return c.json({
    hasDB: !!c.env.sebi_trading_db,
    dbType: typeof c.env.sebi_trading_db,
    envKeys: Object.keys(c.env || {}),
    bindingWorking: c.env.sebi_trading_db ? 'Yes' : 'No'
  })
})


app.get('/test-db', async (c) => {
  try {
    const result = await c.env.sebi_trading_db.prepare('SELECT * FROM users LIMIT 5').all()
    return c.json({
      success: true,
      message: 'Database connected successfully!',
      totalUsers: result.results?.length || 0,
      users: result.results
    })
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }, 500)
  }
})


app.route('/auth', auth)
app.route('/kyc', kyc)


app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /',
      'GET /test-db',
      'POST /auth/signup',
      'POST /auth/login',
      'POST /kyc/register',
      'POST /kyc/validate',
      'GET /kyc/status'
    ]
  }, 404)
})


app.onError((err, c) => {
  console.error('Global error:', err)
  return c.json({
    success: false,
    error: 'Internal server error',
    message: err.message
  }, 500)
})

export default app