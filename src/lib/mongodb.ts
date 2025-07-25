import mongoose, { Connection } from 'mongoose';
import { databaseConfig } from '@/config';

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

const MONGODB_URI = databaseConfig.uri;

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
      maxPoolSize: databaseConfig.connection.maxPoolSize,
      minPoolSize: databaseConfig.connection.minPoolSize,
      maxIdleTimeMS: databaseConfig.connection.maxIdleTimeMS,
      serverSelectionTimeoutMS: databaseConfig.connection.serverSelectionTimeoutMS,
      socketTimeoutMS: databaseConfig.connection.socketTimeoutMS,
      connectTimeoutMS: databaseConfig.connection.connectTimeoutMS,
      heartbeatFrequencyMS: databaseConfig.connection.heartbeatFrequencyMS,
      retryWrites: databaseConfig.retry.retryWrites,
      retryReads: databaseConfig.retry.retryReads,
    };

    if (databaseConfig.debug.enabled) {
      console.log('🔗 MongoDB: Conectando ao banco de dados...');
      console.log('⚙️  MongoDB: Configurações de conexão:', {
        maxPoolSize: opts.maxPoolSize,
        serverSelectionTimeoutMS: opts.serverSelectionTimeoutMS,
        debug: databaseConfig.debug.enabled
      });
    }

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      if (databaseConfig.debug.enabled) {
        console.log('✅ MongoDB: Conectado com sucesso');
      }
      return mongooseInstance;
    }).catch((error) => {
      if (databaseConfig.debug.enabled) {
        console.error('❌ MongoDB: Erro na conexão:', error);
      }
      throw error;
    });
  }
  
  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;
  return cached.conn;
}

export default dbConnect;
