import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

type Bindings = {
  sebi_trading_db: D1Database
}

const auth = new Hono<{ Bindings: Bindings }>()

// Simple hash function for hackathon
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// POST /auth/signup
auth.post('/signup', async (c) => {
  try {
    const { username, email, phone, password, name } = await c.req.json()
    
    // Validate required fields
    if (!username || !email || !phone || !password || !name) {
      return c.json({
        success: false,
        error: 'All fields are required'
      }, 400)
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Insert user
    const result = await c.env.sebi_trading_db.prepare(`
      INSERT INTO users (username, email, phone, password_hash, name)
      VALUES (?, ?, ?, ?, ?)
    `).bind(username, email, phone, passwordHash, name).run()
    
    return c.json({
      success: true,
      message: 'User created successfully',
      userId: result.meta.last_row_id
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Signup failed'
    }, 400)
  }
})

// POST /auth/login  
auth.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    if (!username || !password) {
      return c.json({
        success: false,
        error: 'Username and password are required'
      }, 400)
    }
    
    // Find user
    const result = await c.env.sebi_trading_db.prepare(`
      SELECT * FROM users WHERE username = ?
    `).bind(username).first()
    
    if (!result) {
      return c.json({ 
        success: false, 
        error: 'Invalid username or password' 
      }, 401)
    }
    
    // Hash provided password and compare
    const providedPasswordHash = await hashPassword(password)
    if (providedPasswordHash !== result.password_hash) {
      return c.json({ 
        success: false, 
        error: 'Invalid username or password' 
      }, 401)
    }
    
    // Create JWT payload
    const payload = {
        //@ts-ignore
      sub: result.id.toString(),
      username: result.username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }
    
    const secret = 'hackathon-secret-key-2024'
    const token = await sign(payload, secret)
    
    return c.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: result.id,
        username: result.username,
        email: result.email,
        name: result.name
      }
    })
    
  } catch (error) {
    return c.json({
      success: false,
      error: error instanceof Error ? error.message : 'Login failed'
    }, 500)
  }
})

export default auth