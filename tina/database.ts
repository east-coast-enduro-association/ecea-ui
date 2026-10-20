import { createDatabase, createLocalDatabase } from "@tinacms/datalayer";
import { RedisLevel } from "upstash-redis-level";
import { GitHubProvider } from "tinacms-gitprovider-github";

/**
 * Self-hosted TinaCMS content database.
 *
 * - Local dev (`TINA_PUBLIC_IS_LOCAL=true`): reads/writes the local filesystem,
 *   no GitHub token / Redis / auth needed — same as `npm run dev` today.
 * - Production: content lives in the GitHub repo (committed via a token) and is
 *   *indexed* into Upstash Redis so the GraphQL API can query it quickly.
 *
 * Upstash Redis is used (not MongoDB) to match TinaCMS's maintained reference:
 * it's HTTP-based serverless Redis, which avoids the connection-pooling and
 * cold-pause problems a Mongo driver hits inside serverless functions.
 */
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN as string;
const owner = (process.env.GITHUB_OWNER || "east-coast-enduro-association") as string;
const repo = (process.env.GITHUB_REPO || "ecea-ui") as string;
const branch = (process.env.GITHUB_BRANCH || "master") as string;

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({ branch, owner, repo, token }),
      databaseAdapter: new RedisLevel<string, Record<string, unknown>>({
        redis: {
          url: process.env.KV_REST_API_URL as string,
          token: process.env.KV_REST_API_TOKEN as string,
        },
        debug: process.env.DEBUG === "true",
      }),
      namespace: branch,
    });
