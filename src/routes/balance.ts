import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  sebi_trading_db: D1Database
}

const balance = new Hono<{ Bindings: Bindings }>()


const MINIMUM_BALANCE = 1000

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
   
    await db.prepare(`
      INSERT INTO balance (user_id, amount) VALUES (?, 0.00)
    `).bind(userId).run()
    
    balanceRecord = await db.prepare(`
      SELECT * FROM balance WHERE user_id = ?
    `).bind(userId).first()
  }
  
  return balanceRecord
}


balance.get('/check-low-balance', async (c) => {
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
    const isLowBalance = currentAmount < MINIMUM_BALANCE
    const shortfall = isLowBalance ? MINIMUM_BALANCE - currentAmount : 0
    
    return c.json({
      success: true,
      message: isLowBalance ? 'Balance is low. Please recharge.' : 'Balance is sufficient',
      balance: {
        currentBalance: currentAmount,
        minimumRequired: MINIMUM_BALANCE,
        currency: 'INR',
        lastUpdated: balanceRecord.updated_at || new Date().toISOString()
      },
      alert: {
        isLowBalance: isLowBalance,
        shortfall: shortfall,
        message: isLowBalance ? `Your balance is ₹${currentAmount}. Minimum required is ₹${MINIMUM_BALANCE}. Please recharge ₹${shortfall} to meet the minimum requirement.` : 'Your balance is sufficient for trading.'
      }
    })
    
  } catch (error) {
    console.error('Check low balance error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check balance status'
    }, 500)
  }
})


balance.get('/alert', async (c) => {
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
    const isLowBalance = currentAmount < MINIMUM_BALANCE
    const shortfall = isLowBalance ? MINIMUM_BALANCE - currentAmount : 0
    
    
    return c.json({
      success: true,
      hasAlert: isLowBalance,
      alertType: isLowBalance ? 'LOW_BALANCE' : 'NONE',
      alert: isLowBalance ? {
        type: 'LOW_BALANCE',
        severity: 'WARNING',
        title: 'Low Balance Alert',
        message: `Your balance is ₹${currentAmount}. Minimum required is ₹${MINIMUM_BALANCE}.`,
        action: 'Please recharge your account',
        shortfall: shortfall,
        requiredAmount: MINIMUM_BALANCE,
        currentAmount: currentAmount,
        actionButton: {
          text: 'Recharge Now',
          amount: shortfall,
          url: '/recharge'
        }
      } : null,
      balance: {
        currentBalance: currentAmount,
        minimumRequired: MINIMUM_BALANCE,
        currency: 'INR',
        lastUpdated: balanceRecord.updated_at || new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Alert endpoint error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check balance alert'
    }, 500)
  }
})


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
    
    
    const isLowBalance = newBalance < MINIMUM_BALANCE
    const shortfall = isLowBalance ? MINIMUM_BALANCE - newBalance : 0
    
    return c.json({
      success: true,
      message: 'Balance added successfully',
      previousBalance: currentAmount,
      addedAmount: addBalance,
      newBalance: newBalance,
      alert: {
        isLowBalance: isLowBalance,
        shortfall: shortfall,
        message: isLowBalance ? `Balance updated to ₹${newBalance}. Minimum required is ₹${MINIMUM_BALANCE}. Please recharge ₹${shortfall} more to meet the minimum requirement.` : 'Balance is now sufficient for trading.'
      }
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
    const isLowBalance = currentAmount < MINIMUM_BALANCE
    const shortfall = isLowBalance ? MINIMUM_BALANCE - currentAmount : 0
    
    
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
        minimumRequired: MINIMUM_BALANCE,
        currency: 'INR',
        lastUpdated: balanceRecord.updated_at || new Date().toISOString()
      },
      alert: {
        isLowBalance: isLowBalance,
        shortfall: shortfall,
        message: isLowBalance ? `Your balance is ₹${currentAmount}. Minimum required is ₹${MINIMUM_BALANCE}. Please recharge ₹${shortfall} to meet the minimum requirement.` : 'Your balance is sufficient for trading.'
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
