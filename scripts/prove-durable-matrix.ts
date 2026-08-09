import { createAccount, createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { TransactionStatus } from "genlayer-js/types";

const address = "0x57115ADdC1b97F67c33AC7Fdbe0a775019877D23" as `0x${string}`;
const evidenceCommit = process.env.EVIDENCE_COMMIT;
if (!evidenceCommit) throw new Error("Set EVIDENCE_COMMIT.");
const suffix = process.env.PROOF_SUFFIX ?? String(Date.now());
const account = createAccount();
const client = createClient({ chain: studionet, account });
const policyId = `agent-orthogonal-v2-${suffix}`;
const subjectId = `matrix-agent-7-${suffix}`;
const axes = ["ORIGIN", "DIRECT", "INDEPENDENT", "TEMPORAL"];
const rows = [
  { id: "identity", claim: "The public agent identifier is matrix-agent-7",
    required_axes: axes, critical: true, min_independent_groups: 3 },
  { id: "capability", claim: "The agent exposes capability analyze-v2",
    required_axes: axes, critical: true, min_independent_groups: 3 },
];
const groups: Record<string, string> = {
  ORIGIN: "publisher-domain", DIRECT: "runtime-domain",
  INDEPENDENT: "external-registry-domain", TEMPORAL: "checkpoint-domain",
};
const base = `https://raw.githubusercontent.com/Al1ranger/orthogonal-proof/${evidenceCommit}/evidence/agent-matrix`;
const cells = rows.flatMap((row) => axes.map((axis) => ({
  row: row.id, axis, group: groups[axis], url: `${base}/${row.id}-${axis.toLowerCase()}.json`,
})));

async function write(functionName: string, args: any[]) {
  const hash = await client.writeContract({ address, functionName, args, account, value: 0n });
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

const policyTx = await write("register_policy", [policyId, "Durable agent identity and capability matrix",
  JSON.stringify(rows), JSON.stringify(axes)]);
const subjectTx = await write("register_subject", [subjectId, policyId,
  "agent://matrix-agent-7/analyze-v2", JSON.stringify(cells)]);
const revisions = [];
for (let revision = 1; revision <= 3; revision++) {
  const transaction = await write("evaluate", [subjectId]);
  const matrix = await client.readContract({ address, functionName: "get_matrix", args: [subjectId, revision] });
  revisions.push({ revision, transaction, matrix });
}
const durable = await client.readContract({ address, functionName: "is_durably_proven", args: [subjectId, 3] });
const subject = await client.readContract({ address, functionName: "get_subject", args: [subjectId] });
console.log(JSON.stringify({ contractAddress: address, evidenceCommit, policyId, subjectId,
  dimensions: "2 rows x 4 proof axes x 3 finalized revisions", policyTx, subjectTx,
  revisions, durable, subject }, null, 2));
