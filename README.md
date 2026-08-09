# OrthogonalProof

OrthogonalProof is a reusable GenLayer primitive for claims that must survive a
matrix of independent proof mechanisms rather than a majority of repeated sources.

Policy rows are assertions. Columns are audited proof axes: `ORIGIN`, `DIRECT`,
`INDEPENDENT`, and `TEMPORAL`. Each row declares required axes and a minimum
number of independence groups. Every evaluation creates an immutable matrix
revision.

## Consensus invariant

Every validator independently fetches every configured cell source and rebuilds
the matrix. Acceptance requires exact equality of the ordered cell-state vector,
row-state vector, conflict set, source-status vector, evidence fingerprint,
matrix state, and matrix fingerprint. Agreement on `PROVEN` alone is insufficient.

## StudioNet

- Contract: [`0x57115ADdC1b97F67c33AC7Fdbe0a775019877D23`](https://explorer-studio.genlayer.com/address/0x57115ADdC1b97F67c33AC7Fdbe0a775019877D23)
- Deployment: [`0x2e6275...a27a27`](https://explorer-studio.genlayer.com/tx/0x2e62751eec903a5b0fd5d24f72811127ad3ec766b055965e5eaf1db6f0a27a27)
- Result: `FINALIZED / MAJORITY_AGREE`
- Verified source SHA-256: `c61a55fa21379dca050ede6d9beaf42faacd76916fd2ebdf48977e835d2a6e46`

Security properties:

- multiple hosts in one declared failure domain cannot satisfy independence;
- any required contradiction produces `CONTESTED`, never majority success;
- `UNKNOWN` and `UNAVAILABLE` never count as proof;
- free-form explanations are not stored or used;
- revisions are immutable and `is_durably_proven` requires consecutive `PROVEN`
  revisions, providing flash-proof resistance;
- historical conflicts remain queryable after recovery.

## Live proof

A live 2-row × 4-axis matrix has three consecutive finalized `PROVEN`
revisions. The stored state contains eight `PASS` cells, eight `OK` sources and
four independence groups per row for every revision; the durability gate for
three revisions returns `true`. See [LIVE_PROOF.md](LIVE_PROOF.md).

## Validation

```bash
genvm-lint check contracts/orthogonal_proof.py --json
pytest tests/direct -q
python tools/static_checks.py
npm install
npm run typecheck
```
