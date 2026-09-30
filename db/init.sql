-- ============================================
-- Webshop database: initial setup
-- Runs automatically on the FIRST start of the database container.
-- ============================================

-- Products table
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)   NOT NULL,
  category    VARCHAR(50)    NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  image_url   VARCHAR(255),
  stock       INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

-- Sample products
INSERT INTO products (name, category, description, price, image_url, stock) VALUES
  ('Oversized Tee Bone',      'Shirts',          'Schweres Baumwoll-Jersey, 240 g/m², lockerer Oversized-Schnitt mit überschnittenen Schultern.', 34.90,  '/images/oversized-tee.jpg',   40),
  ('Leinenhemd Sand',         'Shirts',          'Luftiges Hemd aus 100 % Leinen, entspannte Passform, Perlmuttknöpfe.',                          69.00,  '/images/leinenhemd.jpg',      18),
  ('Heavy Hoodie Graphite',   'Hoodies & Sweats', 'Gebürstete Innenseite, doppellagige Kapuze, kastiger Schnitt.',                                89.00,  '/images/hoodie.jpg',          25),
  ('Merino Strick Ecru',      'Hoodies & Sweats', 'Feiner Rundhalspullover aus Merinowolle, temperaturausgleichend und weich.',                   119.00, '/images/strickpullover.jpg',  12),
  ('Wide Leg Jeans Raw',      'Hosen',            'Weites Bein, hoher Bund, unbehandelter Denim, der mit dir altert.',                           99.00,  '/images/wide-leg-jeans.jpg',  20),
  ('Cargo Pants Olive',       'Hosen',            'Robuster Baumwoll-Twill, aufgesetzte Taschen, verstellbarer Saum.',                           79.00,  '/images/cargo-pants.jpg',     15),
  ('Bomberjacke Black',       'Jacken',           'Wattierte Bomberjacke mit Rippbündchen und matter Nylon-Oberfläche.',                         149.00, '/images/bomberjacke.jpg',      8),
  ('Wolljacke Camel',         'Jacken',           'Kurzer Mantel aus Wollmischung, cleaner Schnitt, verdeckte Knopfleiste.',                     189.00, '/images/wolljacke.jpg',        6),
  ('Canvas Tote Natural',     'Accessoires',      'Große Tasche aus festem Baumwoll-Canvas mit Innenfach.',                                       29.00,  '/images/tote-bag.jpg',        50),
  ('Rippstrick Beanie Stone', 'Accessoires',      'Weiche Mütze in Rippstrick, umschlagbarer Rand, unisex.',                                      24.90,  '/images/beanie.jpg',          35);


  CREATE TABLE IF NOT EXISTS orders (
  id             SERIAL PRIMARY KEY,
  customer_name  VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  total          NUMERIC(10,2) NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL
);