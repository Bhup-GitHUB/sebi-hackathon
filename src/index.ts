import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import kyc from "./routes/kyc";
import balance from "./routes/balance";
import trading from "./routes/trading";

type Bindings = {
  sebi_trading_db: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://regulus-desk.vercel.app/",
      "https://sebi.bhupeshkumar.tech",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({
    message: "SEBI Hackathon Trading Platform API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      auth: {
        login: "POST /auth/login",
        signup: "POST /auth/signup",
      },
      kyc: {
        register: "POST /kyc/register",
        validate: "POST /kyc/validate",
        status: "GET /kyc/status",
      },
      balance: {
        add: "POST /balance/add",
        check: "GET /balance/check",
        checkLowBalance: "GET /balance/check-low-balance",
        alert: "GET /balance/alert",
        transactions: "GET /balance/transactions",
      },
      trading: {
        buy: "POST /trading/buy",
        sell: "POST /trading/sell",
        portfolio: "GET /trading/portfolio",
      },
    },
  });
});

app.route("/auth", auth);
app.route("/kyc", kyc);
app.route("/balance", balance);
app.route("/trading", trading);

export default app;
