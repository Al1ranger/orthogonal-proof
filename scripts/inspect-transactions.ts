import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const client = createClient({ chain: studionet });
for (const hash of process.argv.slice(2)) {
  const tx = await client.getTransaction({ hash: hash as never });
  const data = tx as any;
  console.log(JSON.stringify({ hash, status: data.statusName, consensus: data.result_name,
    calldata: data.data?.calldata?.readable ?? null,
    executions: (data.consensus_data?.leader_receipt ?? []).map((item: any) => ({
      result: item.execution_result, code: item.genvm_result?.error_code ?? null,
    })) }, null, 2));
}
