import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

const address = process.env.CONTRACT_ADDRESS as `0x${string}` | undefined;
if (!address) throw new Error("Set CONTRACT_ADDRESS.");
const contractAddress = address;
const suffix = process.env.PROOF_SUFFIX ?? String(Date.now());
const account = createAccount();
const client = createClient({ chain: studionet, account });
const policyId = `http-status-orthogonal-v3-${suffix}`;
const subjectId = `http-200-ok-${suffix}`;
const axes = ["ORIGIN", "DIRECT", "INDEPENDENT"];
const rows = [
  { id: "http-200", claim: "HTTP status code 200 has the standard reason phrase OK",
    required_axes: axes, critical: true, min_independent_groups: 3 },
];
const urls: Record<string, string> = {
  ORIGIN: "https://www.iana.org/assignments/http-status-codes/http-status-codes-1.csv",
  DIRECT: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200",
  INDEPENDENT: "https://http.dog/200.json",
};
const cells = rows.flatMap((row) => axes.map((axis) => ({
  row: row.id, axis, url: urls[axis],
})));

async function write(functionName: string, args: any[]) {
  const hash = await client.writeContract({ address: contractAddress, functionName, args, account, value: 0n });
  console.log(`${functionName}=${hash}`);
  const receipt = await client.waitForTransactionReceipt({
    hash: hash as never, status: TransactionStatus.FINALIZED, interval: 5000, retries: 180,
  }) as any;
  const executions = receipt.consensus_data?.leader_receipt ?? [];
  const fatal = executions.filter((item: any) => item.execution_result !== "SUCCESS" &&
    item.genvm_result?.error_code !== "CONSENSUS_VALIDATOR_QUORUM_REACHED");
  if (receipt.result_name !== "MAJORITY_AGREE" || fatal.length) {
    throw new Error(`${functionName} failed: ${JSON.stringify({ hash, consensus: receipt.result_name, fatal })}`);
  }
  return { hash, status: receipt.status_name, consensus: receipt.result_name,
    explorer: `https://explorer-studio.genlayer.com/tx/${hash}` };
}

const policyTx = process.env.RESUME_SETUP === "1" ? { resumed: true } :
  await write("register_policy", [policyId, "Durable HTTP registry fact matrix",
    JSON.stringify(rows), JSON.stringify(axes)]);
const subjectTx = process.env.RESUME_SETUP === "1" ? { resumed: true } :
  await write("register_subject", [subjectId, policyId,
    "urn:ietf:http:status:200", JSON.stringify(cells)]);
const revisions = [];
const startRevision = Number(process.env.START_REVISION ?? 1);
for (let revision = startRevision; revision <= 3; revision++) {
  const transaction = await write("evaluate", [subjectId]);
  const matrix = await client.readContract({ address: contractAddress, functionName: "get_matrix", args: [subjectId, revision] });
  revisions.push({ revision, transaction, matrix });
}
const durable = await client.readContract({ address: contractAddress, functionName: "is_durably_proven", args: [subjectId, 3] });
const subject = await client.readContract({ address: contractAddress, functionName: "get_subject", args: [subjectId] });
console.log(JSON.stringify({ contractAddress, policyId, subjectId,
  dimensions: "1 row x 3 proof axes x 3 finalized revisions", policyTx, subjectTx,
  revisions, durable, subject }, null, 2));
