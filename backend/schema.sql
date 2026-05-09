CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  emoji VARCHAR(10),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE restaurant_tables (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'free'
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INTEGER REFERENCES menu_items(id),
  item_name VARCHAR(100) NOT NULL,
  item_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT DEFAULT ''
);

CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  quantity NUMERIC(10,2) DEFAULT 0,
  unit VARCHAR(20) NOT NULL,
  max_quantity NUMERIC(10,2) DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO menu_items (name, price, category, emoji) VALUES
('Samosa', 80, 'starters', '🥟'),
('Paneer Tikka', 220, 'starters', '🧀'),
('Soup of the Day', 120, 'starters', '🍲'),
('Butter Chicken', 320, 'mains', '🍛'),
('Paneer Butter Masala', 280, 'mains', '🫕'),
('Dal Tadka', 180, 'mains', '🥘'),
('Garlic Naan', 60, 'mains', '🫓'),
('Biryani', 360, 'mains', '🍚'),
('Mango Lassi', 90, 'drinks', '🥛'),
('Masala Chai', 50, 'drinks', '☕'),
('Fresh Lime Soda', 70, 'drinks', '🍋'),
('Gulab Jamun', 100, 'desserts', '🍮'),
('Rasmalai', 140, 'desserts', '🍨');

INSERT INTO inventory (name, quantity, unit, max_quantity) VALUES
('Tomatoes', 2.4, 'kg', 10),
('Paneer', 0.8, 'kg', 5),
('Chicken', 4.2, 'kg', 10),
('Rice', 8.5, 'kg', 20),
('Flour (Maida)', 6.0, 'kg', 15),
('Onions', 5.2, 'kg', 10),
('Garlic', 1.1, 'kg', 3),
('Butter', 1.8, 'kg', 4),
('Milk', 3.0, 'L', 10),
('Oil', 4.5, 'L', 10);

INSERT INTO restaurant_tables (name) VALUES
('Table 1'),('Table 2'),('Table 3'),
('Table 4'),('Table 5'),('Takeaway');