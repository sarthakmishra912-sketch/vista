import { Pool, PoolClient } from 'pg';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Database configuration
const dbConfig = {
  host: process.env.EXPO_PUBLIC_DB_HOST || 'localhost',
  port: parseInt(process.env.EXPO_PUBLIC_DB_PORT || '5432'),
  database: process.env.EXPO_PUBLIC_DB_NAME || 'rideapp',
  user: process.env.EXPO_PUBLIC_DB_USER || 'postgres',
  password: process.env.EXPO_PUBLIC_DB_PASSWORD || 'password',
  ssl: process.env.EXPO_PUBLIC_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create connection pool
const pool = new Pool(dbConfig);

// Database connection class
export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
    this.setupErrorHandling();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private setupErrorHandling() {
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    this.pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });
  }

  // Get a client from the pool
  public async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      console.error('Error getting database client:', error);
      throw error;
    }
  }

  // Execute a query
  public async query(text: string, params?: any[]): Promise<any> {
    const client = await this.getClient();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Execute a transaction
  public async transaction(callback: (client: PoolClient) => Promise<any>): Promise<any> {
    const client = await this.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // Close the connection pool
  public async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0].health === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// Database utility functions
export class DatabaseUtils {
  private static db = Database.getInstance();

  // Insert with returning
  static async insert(table: string, data: Record<string, any>): Promise<any> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');

    const query = `
      INSERT INTO ${table} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  // Update with returning
  static async update(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>
  ): Promise<any> {
    const dataKeys = Object.keys(data);
    const dataValues = Object.values(data);
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);

    const setClause = dataKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const whereClause = whereKeys
      .map((key, index) => `${key} = $${dataValues.length + index + 1}`)
      .join(' AND ');

    const query = `
      UPDATE ${table}
      SET ${setClause}, updated_at = NOW()
      WHERE ${whereClause}
      RETURNING *
    `;

    const result = await this.db.query(query, [...dataValues, ...whereValues]);
    return result.rows[0];
  }

  // Select with conditions
  static async select(
    table: string,
    columns: string = '*',
    where?: Record<string, any>,
    orderBy?: string,
    limit?: number,
    offset?: number
  ): Promise<any[]> {
    let query = `SELECT ${columns} FROM ${table}`;
    const values: any[] = [];

    if (where) {
      const whereKeys = Object.keys(where);
      const whereClause = whereKeys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }

    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    if (limit) {
      query += ` LIMIT ${limit}`;
    }

    if (offset) {
      query += ` OFFSET ${offset}`;
    }

    const result = await this.db.query(query, values);
    return result.rows;
  }

  // Delete with conditions
  static async delete(table: string, where: Record<string, any>): Promise<boolean> {
    const whereKeys = Object.keys(where);
    const whereValues = Object.values(where);
    const whereClause = whereKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');

    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    const result = await this.db.query(query, whereValues);
    return result.rowCount > 0;
  }

  // Count records
  static async count(table: string, where?: Record<string, any>): Promise<number> {
    let query = `SELECT COUNT(*) FROM ${table}`;
    const values: any[] = [];

    if (where) {
      const whereKeys = Object.keys(where);
      const whereClause = whereKeys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }

    const result = await this.db.query(query, values);
    return parseInt(result.rows[0].count);
  }

  // Check if record exists
  static async exists(table: string, where: Record<string, any>): Promise<boolean> {
    const count = await this.count(table, where);
    return count > 0;
  }
}

// Real-time subscription simulation (since we don't have Supabase real-time)
export class RealtimeManager {
  private static subscriptions: Map<string, Set<(data: any) => void>> = new Map();
  private static pollIntervals: Map<string, NodeJS.Timeout> = new Map();

  static subscribe(
    table: string,
    callback: (data: any) => void,
    filter?: Record<string, any>
  ): () => void {
    const key = `${table}_${JSON.stringify(filter || {})}`;
    
    if (!this.subscriptions.has(key)) {
      this.subscriptions.set(key, new Set());
      this.startPolling(table, filter, key);
    }

    this.subscriptions.get(key)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscriptions.get(key);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.stopPolling(key);
          this.subscriptions.delete(key);
        }
      }
    };
  }

  private static async startPolling(
    table: string,
    filter: Record<string, any> | undefined,
    key: string
  ) {
    let lastCheck = new Date();

    const poll = async () => {
      try {
        // Query for changes since last check
        let query = `SELECT * FROM ${table} WHERE updated_at > $1`;
        const values = [lastCheck];

        if (filter) {
          const filterKeys = Object.keys(filter);
          const filterClause = filterKeys
            .map((k, i) => `${k} = $${i + 2}`)
            .join(' AND ');
          query += ` AND ${filterClause}`;
          values.push(...Object.values(filter));
        }

        const result = await Database.getInstance().query(query, values);
        
        if (result.rows.length > 0) {
          const callbacks = this.subscriptions.get(key);
          if (callbacks) {
            result.rows.forEach((row: any) => {
              callbacks.forEach(callback => callback(row));
            });
          }
        }

        lastCheck = new Date();
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Poll every 2 seconds
    const interval = setInterval(poll, 2000);
    this.pollIntervals.set(key, interval);
  }

  private static stopPolling(key: string) {
    const interval = this.pollIntervals.get(key);
    if (interval) {
      clearInterval(interval);
      this.pollIntervals.delete(key);
    }
  }

  static cleanup() {
    this.pollIntervals.forEach(interval => clearInterval(interval));
    this.pollIntervals.clear();
    this.subscriptions.clear();
  }
}

// Initialize database
export const db = Database.getInstance();
export default db;