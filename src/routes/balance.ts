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

// Helper function to get or create balance record
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

// Add balance endpoint
balance.post('/add', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const { addBalance } = await c.req.json()
    
    // Validate input
    if (!addBalance || typeof addBalance !== 'number' || addBalance <= 0) {
      return c.json({
        success: false,
        error: 'Valid balance amount is required (must be a positive number)'
      }, 400)
    }
    
    // Get current balance
    const currentBalance = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    const newBalance = parseFloat(currentBalance.amount) + addBalance
    
    // Update balance
    await c.env.sebi_trading_db.prepare(`
      UPDATE balance SET amount = ?, updated_at = ? WHERE user_id = ?
    `).bind(newBalance, new Date().toISOString(), userId).run()
    
    // Record transaction
    await c.env.sebi_trading_db.prepare(`
      INSERT INTO balance_transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `).bind(userId, 'credit', addBalance, 'Balance added').run()
    
    return c.json({
      success: true,
      message: 'Balance added successfully',
      previousBalance: parseFloat(currentBalance.amount),
      addedAmount: addBalance,
      newBalance: newBalance,
      transactionId: (await c.env.sebi_trading_db.prepare('SELECT last_insert_rowid() as id').first()).id
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add balance'
    }, 500)
  }
})

// Check balance endpoint
balance.get('/check', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    
    // Get current balance
    const balanceRecord = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    
    // Get recent transactions (last 10)
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
        currentBalance: parseFloat(balanceRecord.amount),
        currency: 'INR',
        lastUpdated: balanceRecord.updated_at
      },
      recentTransactions: recentTransactions.results || []
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get balance'
    }, 500)
  }
})

// Get transaction history
balance.get('/transactions', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
    // Get transactions with pagination
    const transactions = await c.env.sebi_trading_db.prepare(`
      SELECT id, type, amount, description, created_at 
      FROM balance_transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all()
    
    // Get total count
    const totalCount = await c.env.sebi_trading_db.prepare(`
      SELECT COUNT(*) as count FROM balance_transactions WHERE user_id = ?
    `).bind(userId).first()
    
    return c.json({
      success: true,
      message: 'Transaction history retrieved successfully',
      transactions: transactions.results || [],
      pagination: {
        limit,
        offset,
        total: totalCount.count,
        hasMore: (offset + limit) < totalCount.count
      }
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get transaction history'
    }, 500)
  }
})

export default balance
