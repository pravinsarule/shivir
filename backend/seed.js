import bcrypt from "bcryptjs";
import { pool } from "./src/config/db.js";

async function seed() {
  try {
    const passwordHash1 = await bcrypt.hash("shibir123", 10);
    const passwordHash2 = await bcrypt.hash("admin123", 10);

    const query = `
      INSERT INTO users (name, email, password, role)
      VALUES 
        ('Meera Joshi', 'volunteer@shibir.org', $1, 'Field Volunteer'),
        ('Arjun Deshmukh', 'admin@shibir.org', $2, 'Programme Lead')
      ON CONFLICT (email) DO NOTHING;
    `;

    await pool.query(query, [passwordHash1, passwordHash2]);
    console.log("PostgreSQL seed users inserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
}

seed();
