import mongoose, { Connection } from 'mongoose';

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: Connection | null;
        promise: Promise<mongoose.Mongoose> | null;
      };
    }
  }
}

// Extend globalThis type
declare const globalThis: {
  mongoose: {
    conn: Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
} & typeof global;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Tamanho máximo do pool de conexões
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}

export default dbConnect;
