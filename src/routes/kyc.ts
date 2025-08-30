import { Hono } from 'hono'
import { verify } from 'hono/jwt'

type Bindings = {
  sebi_trading_db: D1Database
}

const kyc = new Hono<{ Bindings: Bindings }>()

// Middleware to verify JWT token
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

// KYC Registration endpoint
kyc.post('/register', async (c) => {
  try {
    // Verify JWT token
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const { pan } = await c.req.json()
    
    // Validate PAN format (10 characters, alphanumeric)
    if (!pan || typeof pan !== 'string') {
      return c.json({
        success: false,
        error: 'PAN is required'
      }, 400)
    }
    
    // PAN format validation (10 characters, alphanumeric)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    if (!panRegex.test(pan.toUpperCase())) {
      return c.json({
        success: false,
        error: 'Invalid PAN format. PAN should be 10 characters (5 letters + 4 digits + 1 letter)'
      }, 400)
    }
    
    // Check if KYC already exists for this user
    const existingKyc = await c.env.sebi_trading_db.prepare(`
      SELECT * FROM kyc WHERE user_id = ?
    `).bind(userId).first()
    
    if (existingKyc) {
      return c.json({
        success: false,
        error: 'KYC already registered for this user'
      }, 400)
    }
    
    // Insert KYC record
    const result = await c.env.sebi_trading_db.prepare(`
      INSERT INTO kyc (user_id, pan, status, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(userId, pan.toUpperCase(), 'pending', new Date().toISOString()).run()
    
    return c.json({
      success: true,
      message: 'KYC registration successful',
      kycId: result.meta.last_row_id,
      pan: pan.toUpperCase(),
      status: 'pending'
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'KYC registration failed'
    }, 500)
  }
})

// KYC Validation endpoint
kyc.post('/validate', async (c) => {
  try {
    // Verify JWT token
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    const { kycId } = await c.req.json()
    
    if (!kycId) {
      return c.json({
        success: false,
        error: 'KYC ID is required'
      }, 400)
    }
    
    // Check if KYC exists and belongs to the user
    const kycRecord = await c.env.sebi_trading_db.prepare(`
      SELECT * FROM kyc WHERE id = ? AND user_id = ?
    `).bind(kycId, userId).first()
    
    if (!kycRecord) {
      return c.json({
        success: false,
        error: 'KYC record not found'
      }, 404)
    }
    
    if (kycRecord.status === 'validated') {
      return c.json({
        success: false,
        error: 'KYC is already validated'
      }, 400)
    }
    
    // Update KYC status to validated
    await c.env.sebi_trading_db.prepare(`
      UPDATE kyc SET status = ?, validated_at = ? WHERE id = ?
    `).bind('validated', new Date().toISOString(), kycId).run()
    
    // Update user's KYC status
    await c.env.sebi_trading_db.prepare(`
      UPDATE users SET kyc_status = ? WHERE id = ?
    `).bind('validated', userId).run()
    
    return c.json({
      success: true,
      message: 'KYC validation successful',
      kycId: kycId,
      status: 'validated',
      validatedAt: new Date().toISOString()
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'KYC validation failed'
    }, 500)
  }
})

// Get KYC status endpoint
kyc.get('/status', async (c) => {
  try {
    // Verify JWT token
    const tokenResult = await verifyToken(c)
    if (tokenResult && 'error' in tokenResult) {
      return tokenResult
    }
    
    const userId = tokenResult.sub
    
    // Get KYC status for the user
    const kycRecord = await c.env.sebi_trading_db.prepare(`
      SELECT id, pan, status, created_at, validated_at 
      FROM kyc WHERE user_id = ?
    `).bind(userId).first()
    
    if (!kycRecord) {
      return c.json({
        success: true,
        message: 'No KYC record found',
        kycStatus: 'not_registered'
      })
    }
    
    return c.json({
      success: true,
      message: 'KYC status retrieved successfully',
      kyc: {
        id: kycRecord.id,
        pan: kycRecord.pan,
        status: kycRecord.status,
        createdAt: kycRecord.created_at,
        validatedAt: kycRecord.validated_at
      }
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get KYC status'
    }, 500)
  }
})

export default kyc
