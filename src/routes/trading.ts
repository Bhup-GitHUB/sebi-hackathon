import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  sebi_trading_db: D1Database
}

const trading = new Hono<{ Bindings: Bindings }>()


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


trading.post('/buy', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }

    const userId = tokenResult.sub
    const { stockName, price, quantity } = await c.req.json()

   
    if (!stockName || typeof stockName !== 'string' || stockName.trim() === '') {
      return c.json({
        success: false,
        error: 'Valid stock name is required'
      }, 400)
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return c.json({
        success: false,
        error: 'Valid price is required (must be a positive number)'
      }, 400)
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return c.json({
        success: false,
        error: 'Valid quantity is required (must be a positive integer)'
      }, 400)
    }

    
    const totalCost = price * quantity

    const balanceRecord = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    if (!balanceRecord) {
      return c.json({
        success: false,
        error: 'Failed to get balance record'
      }, 500)
    }

    const currentBalance = safeParseAmount(balanceRecord.amount)

    if (currentBalance < totalCost) {
      const shortfall = totalCost - currentBalance
      return c.json({
        success: false,
        error: 'Insufficient balance for this purchase',
        details: {
          requiredAmount: totalCost,
          currentBalance: currentBalance,
          shortfall: shortfall,
          stockName: stockName,
          price: price,
          quantity: quantity
        },
        alert: {
          type: 'INSUFFICIENT_BALANCE',
          message: `You need ₹${totalCost} to buy ${quantity} shares of ${stockName} at ₹${price} each. Your current balance is ₹${currentBalance}. Please recharge ₹${shortfall}.`
        }
      }, 400)
    }

   
    const remainingBalance = currentBalance - totalCost
    if (remainingBalance < MINIMUM_BALANCE) {
      return c.json({
        success: false,
        error: 'Purchase would leave insufficient balance',
        details: {
          remainingBalance: remainingBalance,
          minimumRequired: MINIMUM_BALANCE,
          shortfall: MINIMUM_BALANCE - remainingBalance
        },
        alert: {
          type: 'MINIMUM_BALANCE_VIOLATION',
          message: `This purchase would leave you with ₹${remainingBalance}, which is below the minimum required balance of ₹${MINIMUM_BALANCE}. Please recharge ₹${MINIMUM_BALANCE - remainingBalance} more.`
        }
      }, 400)
    }

   
    await c.env.sebi_trading_db.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        stock_name TEXT NOT NULL,
        order_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        executed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run()

    
    await c.env.sebi_trading_db.prepare(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        stock_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        average_price DECIMAL(15,2) NOT NULL,
        total_investment DECIMAL(15,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, stock_name)
      )
    `).run()

  
    const orderResult = await c.env.sebi_trading_db.prepare(`
      INSERT INTO orders (user_id, stock_name, order_type, quantity, price, total_amount, status, executed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(userId, stockName.toUpperCase(), 'buy', quantity, price, totalCost, 'executed', new Date().toISOString()).run()

   
    await c.env.sebi_trading_db.prepare(`
      UPDATE balance SET amount = ?, updated_at = ? WHERE user_id = ?
    `).bind(remainingBalance, new Date().toISOString(), userId).run()

    
    await c.env.sebi_trading_db.prepare(`
      INSERT INTO balance_transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `).bind(userId, 'debit', totalCost, `Buy ${quantity} shares of ${stockName.toUpperCase()} at ₹${price}`).run()

    
    const existingPortfolio = await c.env.sebi_trading_db.prepare(`
      SELECT * FROM portfolio WHERE user_id = ? AND stock_name = ?
    `).bind(userId, stockName.toUpperCase()).first()

    if (existingPortfolio) {
    
      const newQuantity = Number(existingPortfolio.quantity) + quantity
      const newTotalInvestment = safeParseAmount(existingPortfolio.total_investment) + totalCost
      const newAveragePrice = newTotalInvestment / newQuantity

      await c.env.sebi_trading_db.prepare(`
        UPDATE portfolio SET quantity = ?, average_price = ?, total_investment = ?, updated_at = ?
        WHERE user_id = ? AND stock_name = ?
      `).bind(newQuantity, newAveragePrice, newTotalInvestment, new Date().toISOString(), userId, stockName.toUpperCase()).run()
    } else {
    
      await c.env.sebi_trading_db.prepare(`
        INSERT INTO portfolio (user_id, stock_name, quantity, average_price, total_investment)
        VALUES (?, ?, ?, ?, ?)
      `).bind(userId, stockName.toUpperCase(), quantity, price, totalCost).run()
    }

    return c.json({
      success: true,
      message: 'Stock purchase successful',
      order: {
        orderId: orderResult.meta.last_row_id,
        stockName: stockName.toUpperCase(),
        orderType: 'buy',
        quantity: quantity,
        price: price,
        totalAmount: totalCost,
        status: 'executed',
        executedAt: new Date().toISOString()
      },
      balance: {
        previousBalance: currentBalance,
        amountSpent: totalCost,
        newBalance: remainingBalance,
        currency: 'INR'
      },
      portfolio: {
        stockName: stockName.toUpperCase(),
        quantity: quantity,
        averagePrice: price,
        totalInvestment: totalCost
      }
    })

  } catch (error) {
    console.error('Buy order error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute buy order'
    }, 500)
  }
})


trading.get('/portfolio', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }

    const userId = tokenResult.sub

   
    await c.env.sebi_trading_db.prepare(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        stock_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        average_price DECIMAL(15,2) NOT NULL,
        total_investment DECIMAL(15,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, stock_name)
      )
    `).run()

    
    const portfolio = await c.env.sebi_trading_db.prepare(`
      SELECT stock_name, quantity, average_price, total_investment, created_at, updated_at
      FROM portfolio 
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).bind(userId).all()

  
    let totalInvestment = 0
    let totalStocks = 0
    const stocks = portfolio.results || []

    stocks.forEach((stock: any) => {
      totalInvestment += safeParseAmount(stock.total_investment)
      totalStocks += stock.quantity
    })

    return c.json({
      success: true,
      message: 'Portfolio retrieved successfully',
      portfolio: {
        totalStocks: totalStocks,
        totalInvestment: totalInvestment,
        numberOfHoldings: stocks.length,
        stocks: stocks.map((stock: any) => ({
          stockName: stock.stock_name,
          quantity: stock.quantity,
          averagePrice: safeParseAmount(stock.average_price),
          totalInvestment: safeParseAmount(stock.total_investment),
          currentValue: safeParseAmount(stock.average_price) * stock.quantity, // Assuming current price = average price for now
          createdAt: stock.created_at,
          updatedAt: stock.updated_at
        }))
      }
    })

  } catch (error) {
    console.error('Portfolio error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get portfolio'
    }, 500)
  }
})


trading.post('/sell', async (c) => {
  try {
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }

    const userId = tokenResult.sub
    const { stockName, price, quantity } = await c.req.json()

    
    if (!stockName || typeof stockName !== 'string' || stockName.trim() === '') {
      return c.json({
        success: false,
        error: 'Valid stock name is required'
      }, 400)
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return c.json({
        success: false,
        error: 'Valid price is required (must be a positive number)'
      }, 400)
    }

    if (!quantity || typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return c.json({
        success: false,
        error: 'Valid quantity is required (must be a positive integer)'
      }, 400)
    }

    
    const portfolioEntry = await c.env.sebi_trading_db.prepare(`
      SELECT * FROM portfolio WHERE user_id = ? AND stock_name = ?
    `).bind(userId, stockName.toUpperCase()).first()

    if (!portfolioEntry) {
      return c.json({
        success: false,
        error: 'You do not own any shares of this stock',
        details: {
          stockName: stockName.toUpperCase(),
          requestedQuantity: quantity
        }
      }, 400)
    }

    const ownedQuantity = Number(portfolioEntry.quantity)
    if (ownedQuantity < quantity) {
      return c.json({
        success: false,
        error: 'Insufficient shares to sell',
        details: {
          stockName: stockName.toUpperCase(),
          ownedQuantity: ownedQuantity,
          requestedQuantity: quantity,
          shortfall: quantity - ownedQuantity
        }
      }, 400)
    }

   
    const saleProceeds = price * quantity
    const averagePrice = safeParseAmount(portfolioEntry.average_price)
    const profitLoss = (price - averagePrice) * quantity
    const profitLossPercentage = ((price - averagePrice) / averagePrice) * 100

    
    const balanceRecord = await getOrCreateBalance(c.env.sebi_trading_db, userId)
    if (!balanceRecord) {
      return c.json({
        success: false,
        error: 'Failed to get balance record'
      }, 500)
    }

    const currentBalance = safeParseAmount(balanceRecord.amount)
    const newBalance = currentBalance + saleProceeds

    
    await c.env.sebi_trading_db.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        stock_name TEXT NOT NULL,
        order_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        executed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `).run()

   
    const orderResult = await c.env.sebi_trading_db.prepare(`
      INSERT INTO orders (user_id, stock_name, order_type, quantity, price, total_amount, status, executed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(userId, stockName.toUpperCase(), 'sell', quantity, price, saleProceeds, 'executed', new Date().toISOString()).run()

   
    await c.env.sebi_trading_db.prepare(`
      UPDATE balance SET amount = ?, updated_at = ? WHERE user_id = ?
    `).bind(newBalance, new Date().toISOString(), userId).run()

   
    await c.env.sebi_trading_db.prepare(`
      INSERT INTO balance_transactions (user_id, type, amount, description)
      VALUES (?, ?, ?, ?)
    `).bind(userId, 'credit', saleProceeds, `Sell ${quantity} shares of ${stockName.toUpperCase()} at ₹${price}`).run()

   
    const remainingQuantity = ownedQuantity - quantity
    if (remainingQuantity === 0) {
      
      await c.env.sebi_trading_db.prepare(`
        DELETE FROM portfolio WHERE user_id = ? AND stock_name = ?
      `).bind(userId, stockName.toUpperCase()).run()
    } else {
        
      const remainingInvestment = safeParseAmount(portfolioEntry.total_investment) * (remainingQuantity / ownedQuantity)
      await c.env.sebi_trading_db.prepare(`
        UPDATE portfolio SET quantity = ?, total_investment = ?, updated_at = ?
        WHERE user_id = ? AND stock_name = ?
      `).bind(remainingQuantity, remainingInvestment, new Date().toISOString(), userId, stockName.toUpperCase()).run()
    }

    return c.json({
      success: true,
      message: 'Stock sale successful',
      order: {
        orderId: orderResult.meta.last_row_id,
        stockName: stockName.toUpperCase(),
        orderType: 'sell',
        quantity: quantity,
        price: price,
        totalAmount: saleProceeds,
        status: 'executed',
        executedAt: new Date().toISOString()
      },
      balance: {
        previousBalance: currentBalance,
        amountReceived: saleProceeds,
        newBalance: newBalance,
        currency: 'INR'
      },
      profitLoss: {
        amount: profitLoss,
        percentage: profitLossPercentage,
        type: profitLoss >= 0 ? 'profit' : 'loss'
      },
      portfolio: {
        stockName: stockName.toUpperCase(),
        remainingQuantity: remainingQuantity,
        averagePrice: averagePrice
      }
    })

  } catch (error) {
    console.error('Sell order error:', error)
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to execute sell order'
    }, 500)
  }
})

  export default trading
