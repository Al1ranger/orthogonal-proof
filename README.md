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

- Contract: [`0x51C1a30bc5AB6c4Aa6aC46D7ad06967E8b72f537`](https://explorer-studio.genlayer.com/address/0x51C1a30bc5AB6c4Aa6aC46D7ad06967E8b72f537)
- Deployment: [`0xbb61b4...533676`](https://explorer-studio.genlayer.com/tx/0xbb61b46ec2bd86f91eebd32fa99cf23de5c2d34a5f6dac9899846a56d1533676)
- Result: `FINALIZED / MAJORITY_AGREE`
- Verified source SHA-256: `29ec702e650b0a9e3593456a624ed2b6d69d9bdc5982638a8496c71a3eb30fa6`

Security properties:

- multiple hosts in one declared failure domain cannot satisfy independence;
- any required contradiction produces `CONTESTED`, never majority success;
- `UNKNOWN` and `UNAVAILABLE` never count as proof;
- free-form explanations are not stored or used;
- revisions are immutable and `is_durably_proven` requires consecutive `PROVEN`
  revisions, providing flash-proof resistance;
- historical conflicts remain queryable after recovery.

## Validation

```bash
genvm-lint check contracts/orthogonal_proof.py --json
pytest tests/direct -q
python tools/static_checks.py
npm install
npm run typecheck
```
