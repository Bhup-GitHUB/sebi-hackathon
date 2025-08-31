import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  sebi_trading_db: D1Database
}

const balance = new Hono<{ Bindings: Bindings }>()

async function verifyToken(c: any) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Authorization header required'
    }, 401)
  }

  const token = authHeader.substring(7)
  try {
    const secret = 'hackathon-secret-key-2024'
    const payload = await verify(token, secret)
    return payload
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid or expired token'
    }, 401)
  }
}

// Helper function to safely parse amount
function safeParseAmount(amount: any): number {
  if (amount === null || amount === undefined) return 0
  const parsed = parseFloat(amount)
  return isNaN(parsed) ? 0 : parsed
}

async function getOrCreateBalance(db: D1Database, userId: string) {
  let balanceRecord = await db.prepare(`
    SELECT * FROM balance WHERE user_id = ?
  `).bind(userId).first()
  
  if (!balanceRecord) {
    // Create balance record if it doesn't exist
    await db.prepare(`
      INSERT INTO balance (user_id, amount) VALUES (?, 0.00)
    `).bind(userId).run()
    
    balanceRecord = await db.prepare(`
      SELECT * FROM balance WHERE user_id = ?
    `).bind(userId).first()
  }
  
  return balanceRecord
}


balance.post('/add', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const { addBalance } = await c.req.json()
    
    
    if (!addBalance || typeof addBalance !== 'number' || addBalance <= 0) {
      return c.json({
        success: false,
        error: 'Valid balance amount is required (must be a positive number)'
      }, 400)
    }
    
 
    const currentBalance = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    if (!currentBalance) {
      return c.json({
        success: false,
        error: 'Failed to get or create balance record'
      }, 500)
    }
    
    const currentAmount = safeParseAmount(currentBalance.amount)
    const newBalance = currentAmount + addBalance
    
    
    await c.env.sebi_trading_db.prepare(`
      UPDATE balance SET amount = ?, updated_at = ? WHERE user_id = ?
    `).bind(newBalance, new Date().toISOString(), userId).run()
    
    
    await c.env.sebi_trading_db.prepare(`
      INSERT INTO balance_transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `).bind(userId, 'credit', addBalance, 'Balance added').run()
    
    return c.json({
      success: true,
      message: 'Balance added successfully',
      previousBalance: currentAmount,
      addedAmount: addBalance,
      newBalance: newBalance
    })
    
  } catch (error) {
    console.error('Add balance error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add balance'
    }, 500)
  }
})


balance.get('/check', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    
    
    const balanceRecord = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    if (!balanceRecord) {
      return c.json({
        success: false,
        error: 'Failed to get or create balance record'
      }, 500)
    }
    
    const currentAmount = safeParseAmount(balanceRecord.amount)
    
    
    const recentTransactions = await c.env.sebi_trading_db.prepare(`
      SELECT id, type, amount, description, created_at 
      FROM balance_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 10
    `).bind(userId).all()
    
    return c.json({
      success: true,
      message: 'Balance retrieved successfully',
      balance: {
        currentBalance: currentAmount,
        currency: 'INR',
        lastUpdated: balanceRecord.updated_at || new Date().toISOString()
      },
      recentTransactions: recentTransactions.results || []
    })
    
  } catch (error) {
    console.error('Check balance error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get balance'
    }, 500)
  }
})


balance.get('/transactions', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
   
    const transactions = await c.env.sebi_trading_db.prepare(`
      SELECT id, type, amount, description, created_at 
      FROM balance_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all()
    
   
    const totalCount = await c.env.sebi_trading_db.prepare(`
      SELECT COUNT(*) as count FROM balance_transactions WHERE user_id = ?
    `).bind(userId).first()
    
    const total = Number(totalCount?.count) || 0
    
    return c.json({
      success: true,
      message: 'Transaction history retrieved successfully',
      transactions: transactions.results || [],
      pagination: {
        limit,
        offset,
        total: total,
        hasMore: (offset + limit) < total
      }
    })
    
  } catch (error) {
    console.error('Transaction history error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction history'
    }, 500)
  }
})

export default balance
