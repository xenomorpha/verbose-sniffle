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
  -- Shirts
  ('Oversized Tee Bone',         'Shirts',           'Schweres Baumwoll-Jersey, 240 g/m², lockerer Oversized-Schnitt mit überschnittenen Schultern.', 34.90,  '/images/oversized-tee.jpg',   40),
  ('Leinenhemd Sand',            'Shirts',           'Luftiges Hemd aus 100 % Leinen, entspannte Passform, Perlmuttknöpfe.',                          69.00,  '/images/leinenhemd.jpg',      18),
  ('Langarmshirt Navy',          'Shirts',           'Weiches Langarmshirt aus Bio-Baumwolle, schmaler Schnitt, Rundhalsausschnitt.',                 39.00,  '/images/langarmshirt.jpg',    30),
  ('Polo Piqué Forest',          'Shirts',           'Klassisches Poloshirt aus Baumwoll-Piqué, dezente Knopfleiste, formstabil.',                    54.00,  '/images/polo.jpg',            22),
  ('Boxy Tee Washed Black',      'Shirts',           'Kastiges T-Shirt mit Used-Waschung, dicker Jersey, kurzer Schnitt.',                            38.00,  '/images/boxy-tee.jpg',        35),
  ('Flanellhemd Karo Rot',       'Shirts',           'Warmes Flanellhemd mit Karomuster, Brusttasche, lockere Passform.',                             64.00,  '/images/flanellhemd.jpg',     16),

  -- Hoodies & Sweats
  ('Heavy Hoodie Graphite',      'Hoodies & Sweats', 'Gebürstete Innenseite, doppellagige Kapuze, kastiger Schnitt.',                                 89.00,  '/images/hoodie.jpg',          25),
  ('Merino Strick Ecru',         'Hoodies & Sweats', 'Feiner Rundhalspullover aus Merinowolle, temperaturausgleichend und weich.',                   119.00, '/images/strickpullover.jpg',  12),
  ('Crewneck Sweat Grey Melange','Hoodies & Sweats', 'Klassisches Sweatshirt aus schwerem Frottee, Rippbündchen, melierter Look.',                    69.00,  '/images/crewneck.jpg',        28),
  ('Zip Hoodie Olive',           'Hoodies & Sweats', 'Kapuzenjacke mit durchgehendem Reißverschluss, Kängurutasche, innen gebürstet.',                95.00,  '/images/zip-hoodie.jpg',      14),
  ('Half Zip Fleece Sand',       'Hoodies & Sweats', 'Kuscheliger Fleece-Pullover mit kurzem Reißverschluss und Stehkragen.',                          84.00,  '/images/half-zip.jpg',        17),
  ('Zopfstrick Creme',           'Hoodies & Sweats', 'Grobstrick mit Zopfmuster aus Wollmischung, warm und weich.',                                   129.00, '/images/zopfstrick.jpg',       9),

  -- Hosen
  ('Wide Leg Jeans Raw',         'Hosen',            'Weites Bein, hoher Bund, unbehandelter Denim, der mit dir altert.',                             99.00,  '/images/wide-leg-jeans.jpg',  20),
  ('Cargo Pants Olive',          'Hosen',            'Robuster Baumwoll-Twill, aufgesetzte Taschen, verstellbarer Saum.',                             79.00,  '/images/cargo-pants.jpg',     15),
  ('Chino Slim Beige',           'Hosen',            'Elastischer Baumwoll-Twill, schmaler Schnitt, vielseitig kombinierbar.',                        74.00,  '/images/chino.jpg',           24),
  ('Jogger Sweat Anthrazit',     'Hosen',            'Bequeme Jogginghose mit Tunnelzug, Seitentaschen und gerippten Bündchen.',                      59.00,  '/images/jogger.jpg',          30),
  ('Straight Jeans Indigo',      'Hosen',            'Gerader Schnitt, mittlere Waschung, robuster Denim mit etwas Stretch.',                         89.00,  '/images/straight-jeans.jpg',  21),
  ('Leinenhose Natural',         'Hosen',            'Leichte Sommerhose aus Leinen, elastischer Bund, lockerer Fall.',                               82.00,  '/images/leinenhose.jpg',      13),

  -- Jacken
  ('Bomberjacke Black',          'Jacken',           'Wattierte Bomberjacke mit Rippbündchen und matter Nylon-Oberfläche.',                          149.00, '/images/bomberjacke.jpg',      8),
  ('Wolljacke Camel',            'Jacken',           'Kurzer Mantel aus Wollmischung, cleaner Schnitt, verdeckte Knopfleiste.',                      189.00, '/images/wolljacke.jpg',        6),
  ('Jeansjacke Washed Blue',     'Jacken',           'Klassische Trucker-Jacke aus festem Denim, Knopfleiste, zwei Brusttaschen.',                   109.00, '/images/jeansjacke.jpg',      11),
  ('Regenjacke Petrol',          'Jacken',           'Wasserdichte Jacke mit verschweißten Nähten und verstellbarer Kapuze.',                        139.00, '/images/regenjacke.jpg',      10),
  ('Daunenweste Schwarz',        'Jacken',           'Leichte gesteppte Weste mit Recycling-Füllung, Stehkragen, Reißverschlusstaschen.',             99.00,  '/images/daunenweste.jpg',     12),
  ('Coach Jacket Khaki',         'Jacken',           'Leichte Übergangsjacke mit Druckknöpfen und glatter Nylon-Oberfläche.',                        119.00, '/images/coach-jacket.jpg',     9),

  -- Accessoires
  ('Canvas Tote Natural',        'Accessoires',      'Große Tasche aus festem Baumwoll-Canvas mit Innenfach.',                                        29.00,  '/images/tote-bag.jpg',        50),
  ('Rippstrick Beanie Stone',    'Accessoires',      'Weiche Mütze in Rippstrick, umschlagbarer Rand, unisex.',                                       24.90,  '/images/beanie.jpg',          35),
  ('Bucket Hat Schwarz',         'Accessoires',      'Bucket Hat aus robustem Baumwoll-Twill mit breiter Krempe.',                                    32.00,  '/images/bucket-hat.jpg',      27),
  ('Wollschal Grau',             'Accessoires',      'Weicher Schal aus Lammwolle, 180 cm lang, mit Fransenkante.',                                   45.00,  '/images/schal.jpg',           20),
  ('Ledergürtel Braun',          'Accessoires',      'Gürtel aus pflanzlich gegerbtem Leder mit matter Metallschnalle.',                              49.00,  '/images/guertel.jpg',         25),
  ('Crew Socks 3er Pack',        'Accessoires',      'Drei Paar Socken aus Baumwollmischung mit verstärkter Ferse.',                                  19.00,  '/images/socks.jpg',           60);

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
-- ============================================
-- Users (customers): created automatically at checkout, one per e-mail
-- ============================================
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================
-- Orders: each order belongs to one user and has a status
-- ============================================
CREATE TABLE orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER       NOT NULL REFERENCES users(id),
  status     VARCHAR(20)   NOT NULL DEFAULT 'processing'
             CHECK (status IN ('processing', 'shipped', 'delivered')),
  total      NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  created_at TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================
-- Order items: products inside an order
-- ============================================
CREATE TABLE order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER       NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER       NOT NULL REFERENCES products(id),
  quantity   INTEGER       NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL
);

-- ============================================
-- Demo data: two customers with orders in different states
-- ============================================
INSERT INTO users (name, email) VALUES
  ('Anna Muster',  'anna@example.ch'),
  ('Luca Beispiel', 'luca@example.ch');

INSERT INTO orders (user_id, status, total) VALUES
  (1, 'delivered',  178.00),
  (1, 'shipped',     24.90),
  (2, 'processing', 149.00);

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 7,  2, 89.00),
  (2, 26, 1, 24.90),
  (3, 19, 1, 149.00);