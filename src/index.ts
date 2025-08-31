import { Hono } from 'hono'
import auth from './routes/auth'
import kyc from './routes/kyc'
import balance from './routes/balance'
import trading from './routes/trading'

type Bindings = {
  sebi_trading_db: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    message: 'SEBI Hackathon Trading Platform API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        signup: 'POST /auth/signup'
      },
      kyc: {
        register: 'POST /kyc/register',
        validate: 'POST /kyc/validate',
        status: 'GET /kyc/status'
      },
      balance: {
        add: 'POST /balance/add',
        check: 'GET /balance/check',
        checkLowBalance: 'GET /balance/check-low-balance',
        alert: 'GET /balance/alert',
        transactions: 'GET /balance/transactions'
      },
      trading: {
        buy: 'POST /trading/buy'
      }
    }
  })
})

app.route('/auth', auth)
app.route('/kyc', kyc)
app.route('/balance', balance)
app.route('/trading', trading)

export default app