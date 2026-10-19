// Shared Amazon Creators API client. Credentials come from the environment only
// (.env is gitignored) — never hardcode them here. See .env.example.
import { ApiClient, TypedDefaultApi } from "amazon-creators-api";

const REQUIRED = ["AMAZON_CREATORS_CLIENT_ID", "AMAZON_CREATORS_CLIENT_SECRET", "AMAZON_CREATORS_PARTNER_TAG"];

export function createClient() {
  for (const name of REQUIRED) {
    if (!process.env[name]) {
      console.error(`Missing required environment variable: ${name} (copy .env.example to .env)`);
      process.exit(1);
    }
  }
  const client = new ApiClient();
  client.credentialId = process.env.AMAZON_CREATORS_CLIENT_ID;
  client.credentialSecret = process.env.AMAZON_CREATORS_CLIENT_SECRET;
  client.version = process.env.AMAZON_CREATORS_VERSION || "3.1";
  client.marketplace = process.env.AMAZON_CREATORS_MARKETPLACE || "www.amazon.com";
  return { client, api: new TypedDefaultApi(client), partnerTag: process.env.AMAZON_CREATORS_PARTNER_TAG };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
