import dns from "dns";
import mongoose from "mongoose";
import { env } from "./env";

// Some ISPs / corporate networks / VPNs return ECONNREFUSED on the SRV lookup
// required by `mongodb+srv://` URIs. Forcing well-known public DNS resolvers
// avoids that failure mode without changing the connection string.
const PUBLIC_DNS_SERVERS = ["8.8.8.8", "1.1.1.1", "8.8.4.4"];

const ensurePublicDnsServers = (): void => {
  try {
    const current = dns.getServers();
    const hasPublic = current.some((server) => PUBLIC_DNS_SERVERS.includes(server));
    if (!hasPublic) {
      dns.setServers([...PUBLIC_DNS_SERVERS, ...current]);
    }
  } catch {
    // dns.setServers throws on invalid input only; ignore otherwise.
  }
};

export const connectDB = async (): Promise<void> => {
  ensurePublicDnsServers();

  try {
    await mongoose.connect(env.mongoUrl, {
      dbName: env.dbName,
      serverSelectionTimeoutMS: 15000
    });
  } catch (error) {
    if (error instanceof Error && /querySrv|ECONNREFUSED|ENOTFOUND/.test(error.message)) {
      throw new Error(
        `MongoDB DNS lookup failed for "${env.mongoUrl}". ` +
          "Check your network/DNS (the SRV record could not be resolved). " +
          `Underlying error: ${error.message}`
      );
    }
    throw error;
  }
};
