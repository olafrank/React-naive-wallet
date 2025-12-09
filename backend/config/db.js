import {neon} from '@neondatabase/serverless';

import "dotenv/config";

// Create a connection pool to the Neon database
export const sql = neon(process.env.DATABASE_URL);