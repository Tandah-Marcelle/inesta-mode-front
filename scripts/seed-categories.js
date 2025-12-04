import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'inesta_mode',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const categories = [
  {
    name: 'Mariage',
    description: 'Tenues élégantes et raffinées pour les mariages et événements formels',
    color: '#8B4B8C',
    isActive: true,
  },
  {
    name: 'Casual',
    description: 'Vêtements confortables pour le quotidien avec style',
    color: '#4B8B8B',
    isActive: true,
  },
  {
    name: 'Bureau',
    description: 'Tenues professionnelles et sophistiquées pour le monde du travail',
    color: '#2D4A6B',
    isActive: true,
  },
  {
    name: 'Soirée',
    description: 'Créations glamour pour vos soirées spéciales',
    color: '#6B2D4A',
    isActive: true,
  },
  {
    name: 'Sport',
    description: 'Vêtements de sport et activewear pour rester active',
    color: '#4A6B2D',
    isActive: true,
  },
  {
    name: 'Accessoires',
    description: 'Bijoux, sacs et accessoires pour compléter votre look',
    color: '#B8860B',
    isActive: true,
  },
];

async function seedCategories() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting categories seeding...');
    
    // Check if categories already exist
    const existingCategories = await client.query('SELECT COUNT(*) FROM categories');
    const count = parseInt(existingCategories.rows[0].count);
    
    if (count > 0) {
      console.log(`ℹ️  Found ${count} existing categories. Skipping seeding.`);
      return;
    }
    
    // Insert categories
    for (const category of categories) {
      const result = await client.query(
        'INSERT INTO categories (name, description, color, is_active) VALUES ($1, $2, $3, $4) RETURNING id, name',
        [category.name, category.description, category.color, category.isActive]
      );
      
      console.log(`✅ Created category: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }
    
    console.log('🎉 Categories seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await seedCategories();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
main();

export { seedCategories };
