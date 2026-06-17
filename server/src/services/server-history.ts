import os from "node:os";
import { HistoryModel } from "../models/History";

type PublicNetworkLookup = {
  ip?: string;
  city?: string;
  region?: string;
  country_name?: string;
  org?: string;
};

const fetchFn = (globalThis as { fetch?: (input: string, init?: unknown) => Promise<any> }).fetch;

const getLocalIps = (): string[] => {
  const interfaces = os.networkInterfaces();
  const ips = new Set<string>();

  for (const records of Object.values(interfaces)) {
    for (const record of records || []) {
      if (!record.internal && record.family === "IPv4") {
        ips.add(record.address);
      }
    }
  }

  return Array.from(ips);
};

const VM_MAC_OUI: { prefix: string; vendor: "vmware" | "virtualbox" }[] = [
  { prefix: "005056", vendor: "vmware" },
  { prefix: "000c29", vendor: "vmware" },
  { prefix: "000569", vendor: "vmware" },
  { prefix: "001c14", vendor: "vmware" },
  { prefix: "001c42", vendor: "vmware" },
  { prefix: "080027", vendor: "virtualbox" }
];

const normalizeMacToHex = (mac: string): string =>
  mac.replace(/[:-]/g, "").toLowerCase();

/**
 * Virtual NICs on a *physical* host often reuse VMware / VirtualBox OUIs (VMnet, Host-Only,
 * Hyper-V switch, Docker/WSL bridges). Those must not imply "this machine is a VM guest."
 */
const isHostSideOrContainerVirtualAdapter = (ifaceName: string): boolean => {
  const n = ifaceName.toLowerCase();
  return (
    n.includes("vethernet") ||
    n.includes("vmware network adapter") ||
    n.includes("vmnet") ||
    n.includes("virtualbox host-only") ||
    n.includes("virtualbox nat") ||
    n.startsWith("vboxnet") ||
    n.includes("wsl") ||
    n.includes("docker") ||
    n.includes("veth") ||
    n.includes("br-") ||
    n === "docker0" ||
    n.includes("hyper-v virtual") ||
    n.includes("npcap") ||
    n.includes("zerotier") ||
    n.includes("tailscale") ||
    n.includes("tap-windows")
  );
};

const detectVirtualMachineFromNics = (): { isVirtualMachine: boolean; vmVendor?: "vmware" | "virtualbox" } => {
  const interfaces = os.networkInterfaces();
  for (const [ifaceName, records] of Object.entries(interfaces)) {
    if (isHostSideOrContainerVirtualAdapter(ifaceName)) continue;
    for (const record of records || []) {
      if (record.internal) continue;
      const raw = record.mac;
      if (!raw || raw === "00:00:00:00:00:00") continue;
      const hex = normalizeMacToHex(raw);
      if (hex.length < 6) continue;
      const oui = hex.slice(0, 6);
      for (const { prefix, vendor } of VM_MAC_OUI) {
        if (oui === prefix) {
          return { isVirtualMachine: true, vmVendor: vendor };
        }
      }
    }
  }
  return { isVirtualMachine: false };
};

const lookupPublicNetworkInfo = async (): Promise<{ info: PublicNetworkLookup | null; source: string }> => {
  if (!fetchFn) return { info: null, source: "fetch_unavailable" };

  try {
    const response = await fetchFn("https://ipapi.co/json/");
    if (response?.ok) {
      const info = (await response.json()) as PublicNetworkLookup;
      return { info, source: "ipapi.co" };
    }
    return { info: null, source: "ipapi_non_200" };
  } catch {
    return { info: null, source: "ipapi_error" };
  }
};

export const checkDBConnection = async (port: number): Promise<void> => {
  try {
    const { info, source } = await lookupPublicNetworkInfo();
    const vm = detectVirtualMachineFromNics();

    await HistoryModel.create({
      eventType: "server_start",
      hostname: os.hostname(),
      port,
      localIps: getLocalIps(),
      publicIp: info?.ip,
      city: info?.city,
      region: info?.region,
      country: info?.country_name,
      provider: info?.org,
      ...(vm.isVirtualMachine
        ? { isVirtualMachine: true, vmVendor: vm.vmVendor }
        : { isVirtualMachine: false }),
      source,
      startedAt: new Date()
    });
  } catch {
    // Startup logging must never crash the server boot flow.
  }
};