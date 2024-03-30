import { Actor, HttpAgent } from "@dfinity/agent";

// Imports and re-exports candid interface
import { idlFactory } from "./hello_backend.did.js";
export { idlFactory } from "./hello_backend.did.js";

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */

export const mainNetwork = 'https://ic0.app';
export const createActor = (canisterId, host = mainNetwork) => {
  const agent = new HttpAgent({ host: host });

  // Fetch root key for signature certificate validation during development
  if (host) {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

/*
export const host = "http://localhost:4943";
export const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
*/
export const host = mainNetwork;
export const canisterId = "6lqbm-ryaaa-aaaai-qibsa-cai";

export const hello_backend = canisterId ? createActor(canisterId, host) : undefined;

console.log(await hello_backend.greet('be my world'))
