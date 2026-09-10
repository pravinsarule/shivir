import pg from "pg";
import { config } from "./index.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  // Remote managed PostgreSQL instances commonly reject unencrypted clients.
  ...(config.databaseSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});

export async function initDb() {
  const queries = [
    // 1. Users table
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        phone VARCHAR(30),
        city VARCHAR(100),
        status VARCHAR(20) DEFAULT 'Active',
        is_reiki_skilled BOOLEAN DEFAULT FALSE,
        can_drive_4w BOOLEAN DEFAULT FALSE,
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 2. Contacts table
    `CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(150),
        area VARCHAR(100),
        category VARCHAR(50) DEFAULT 'Warm',
        designation VARCHAR(100),
        samaj VARCHAR(100),
        social_group VARCHAR(100),
        relationship_note TEXT,
        sourced_by_id INT REFERENCES users(id),
        met_by_id INT REFERENCES users(id),
        is_archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 3. Contact Interactions
    `CREATE TABLE IF NOT EXISTS contact_interactions (
        id SERIAL PRIMARY KEY,
        contact_id INT REFERENCES contacts(id) ON DELETE CASCADE,
        user_id INT REFERENCES users(id),
        notes TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'Meeting',
        interaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 4. Resources table
    `CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        quantity INT DEFAULT 1,
        requires_driver BOOLEAN DEFAULT FALSE,
        requires_reiki BOOLEAN DEFAULT FALSE
    );`,

    // 5. Demos / Sessions table
    `CREATE TABLE IF NOT EXISTS demo_sessions (
        id SERIAL PRIMARY KEY,
        contact_id INT REFERENCES contacts(id),
        param_mitra_id INT REFERENCES users(id),
        session_type VARCHAR(100) NOT NULL,
        session_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        expected_crowd INT DEFAULT 0,
        location TEXT NOT NULL,
        area_type VARCHAR(50) DEFAULT 'Across Delhi',
        travel_buffer_minutes INT DEFAULT 90,
        status VARCHAR(30) DEFAULT 'HOLD',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 6. 15-Minute Soft Holds table
    `CREATE TABLE IF NOT EXISTS booking_holds (
        id SERIAL PRIMARY KEY,
        session_id INT REFERENCES demo_sessions(id) ON DELETE CASCADE,
        param_mitra_id INT REFERENCES users(id),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        status VARCHAR(20) DEFAULT 'ACTIVE'
    );`,

    // 7. Follow-ups table
    `CREATE TABLE IF NOT EXISTS follow_ups (
        id SERIAL PRIMARY KEY,
        contact_id INT REFERENCES contacts(id),
        param_mitra_id INT REFERENCES users(id),
        demo_session_id INT REFERENCES demo_sessions(id),
        title VARCHAR(150) NOT NULL,
        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_minutes INT DEFAULT 15,
        status VARCHAR(30) DEFAULT 'Pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 8. Cards & Inventory table
    `CREATE TABLE IF NOT EXISTS card_books (
        id SERIAL PRIMARY KEY,
        param_mitra_id INT REFERENCES users(id),
        assigned_count INT DEFAULT 0,
        given_count INT DEFAULT 0,
        returned_count INT DEFAULT 0,
        in_hand_count INT DEFAULT 0,
        lost_count INT DEFAULT 0
    );`,

    // 9. Card Registrations & Tokens
    `CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        token_number VARCHAR(50) UNIQUE NOT NULL,
        contact_id INT REFERENCES contacts(id),
        param_mitra_id INT REFERENCES users(id),
        card_type VARCHAR(50) DEFAULT 'Entry Card',
        card_number VARCHAR(50),
        amount NUMERIC(10,2) DEFAULT 0.00,
        payment_mode VARCHAR(50) DEFAULT 'Cash',
        payment_status VARCHAR(30) DEFAULT 'Paid',
        card_collection_status VARCHAR(30) DEFAULT 'Collected',
        registered_name VARCHAR(120),
        verification_status VARCHAR(30) DEFAULT 'Not Verified',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 10. Online payment requests. The token registration is created only after
    // a verified Easebuzz success callback.
    `CREATE TABLE IF NOT EXISTS payment_links (
        id SERIAL PRIMARY KEY,
        transaction_id VARCHAR(40) UNIQUE NOT NULL,
        contact_id INT NOT NULL REFERENCES contacts(id),
        param_mitra_id INT REFERENCES users(id),
        amount NUMERIC(10,2) NOT NULL CHECK (amount >= 1),
        card_type VARCHAR(50) DEFAULT 'Entry Card',
        card_number VARCHAR(50),
        registered_name VARCHAR(120),
        status VARCHAR(30) DEFAULT 'Pending',
        easebuzz_id VARCHAR(100),
        easebuzz_response JSONB,
        payment_url TEXT,
        registration_id INT REFERENCES registrations(id),
        paid_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`,

    // 11. Responsibilities & Duties
    `CREATE TABLE IF NOT EXISTS duties (
        id SERIAL PRIMARY KEY,
        param_mitra_id INT REFERENCES users(id),
        title VARCHAR(150) NOT NULL,
        duty_type VARCHAR(50) DEFAULT 'Responsibility',
        due_date DATE,
        status VARCHAR(30) DEFAULT 'Pending',
        notes TEXT
    );`,

    // 12. Meals table
    `CREATE TABLE IF NOT EXISTS meal_preferences (
        id SERIAL PRIMARY KEY,
        param_mitra_id INT REFERENCES users(id) UNIQUE,
        standing_preference VARCHAR(50) DEFAULT 'Vegetarian',
        today_breakfast_opted BOOLEAN DEFAULT TRUE,
        today_lunch_opted BOOLEAN DEFAULT TRUE,
        daily_override_note VARCHAR(150),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully.");
    for (const q of queries) {
      await client.query(q);
    }
    // Column upgrades for existing tables
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_reiki_skilled BOOLEAN DEFAULT FALSE;`);
    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS can_drive_4w BOOLEAN DEFAULT FALSE;`);
    await client.query(`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email VARCHAR(150);`);
    console.log("Full Param Mitra PostgreSQL database schema initialized.");
    client.release();
  } catch (err) {
    console.error("FATAL: PostgreSQL connection failed:", err.message);
  }
}
