CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK(type IN ('income', 'expense')),
  amount NUMERIC(12,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) UNIQUE NOT NULL,
  monthly_limit NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE savings_goals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  current_amount NUMERIC(12,2) DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
