import { MongoClient } from 'mongodb';

let client;

export async function connectToDb() {
  if (client && client.topology && client.topology.isConnected()) {
    return client.db('resume_analyzer');
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  client = new MongoClient(mongoUri);
  await client.connect();
  return client.db('resume_analyzer');
}
