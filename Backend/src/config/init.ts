import { initPool } from "./db";

export async function initDB(): Promise<void> {
  const conn = await initPool.getConnection();

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      sku VARCHAR(100) UNIQUE,
      stock INT DEFAULT 0,
      price DECIMAL(10,2),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS attributes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      data_type ENUM('string', 'number', 'boolean', 'date') NOT NULL
    );
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS product_attributes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      attribute_id INT NOT NULL,
      value_string VARCHAR(255),
      value_number DECIMAL(10,2),
      value_boolean BOOLEAN,
      value_date DATE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (attribute_id) REFERENCES attributes(id)
    );
  `);

  conn.release();
  console.log("Tablas creadas");
}