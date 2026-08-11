# OrthogonalProof

OrthogonalProof is a reusable GenLayer primitive for claims that must survive a
matrix of independent proof mechanisms rather than a majority of repeated
sources. Policy rows are assertions; columns are audited proof axes: `ORIGIN`,
`DIRECT`, `INDEPENDENT`, and `TEMPORAL`.

## Consensus and independence invariant

Callers submit HTTPS evidence URLs but cannot label their independence. The
contract derives a conservative registrable DNS failure domain from every URL.
Different paths and subdomains under one registrable domain count once. Every
validator independently fetches every cell and rebuilds the complete matrix.
Consensus requires exact equality of cell states, row states, conflicts, source
statuses, the ordered derived-domain vector, per-row coverage, evidence and
matrix fingerprints, and final state. Agreement on `PROVEN` alone is
insufficient.

Contradictions produce `CONTESTED`; `UNKNOWN` and `UNAVAILABLE` never count as
proof. Immutable revisions and `is_durably_proven` provide flash-proof
resistance, while historical conflicts remain queryable.

## Corrected StudioNet deployment

- Contract: [`0xbdC373dB7E9B03E33453A7F79a90C8bcD182605f`](https://explorer-studio.genlayer.com/address/0xbdC373dB7E9B03E33453A7F79a90C8bcD182605f)
- Deployment: [`0x82066c...e7d8c`](https://explorer-studio.genlayer.com/tx/0x82066cf7edf2c42b40a54c33eb439b033b820ba55ec1233cc34d2f122f2e7d8c)
- Source SHA-256: `e046598d77aca19233d9ccb82becb1ec4c65c740a30f3e7d22226ed5be0c014a`

The live proof uses IANA, Mozilla MDN, and HTTP Dog. Three consecutive revisions
store three `PASS` cells, three independently derived domains, no conflicts,
and `PROVEN`; `is_durably_proven(subject, 3)` returns `true`. See
[LIVE_PROOF.md](LIVE_PROOF.md) and [CORRECTION.md](CORRECTION.md).

## Validation

```bash
genvm-lint check contracts/orthogonal_proof.py --json
pytest tests/direct -q
npm run check:discovery
npm run typecheck
```
