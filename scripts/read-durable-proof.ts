import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const address = "0x57115ADdC1b97F67c33AC7Fdbe0a775019877D23" as `0x${string}`;
const subjectId = process.env.SUBJECT_ID ?? "matrix-agent-7-1786304488627";
const client = createClient({ chain: studionet });
const subject = await client.readContract({ address, functionName: "get_subject", args: [subjectId] });
const durable = await client.readContract({ address, functionName: "is_durably_proven", args: [subjectId, 3] });
const revisions = [];
for (let revision = 1; revision <= 3; revision++) {
  const matrix = await client.readContract({ address, functionName: "get_matrix", args: [subjectId, revision] });
  revisions.push({ revision, matrix });
}
console.log(JSON.stringify({ contractAddress: address, subjectId, durable, subject, revisions }, null, 2));
