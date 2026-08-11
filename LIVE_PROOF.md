# Live Durable Cross-Domain Proof

Subject: `http-200-ok-proven-20260811`

Claim: HTTP status code 200 has the standard reason phrase `OK`.

The three proof axes use IANA's registry, Mozilla MDN, and HTTP Dog's explicit
JSON record. The contract derives `dns:iana.org`, `dns:mozilla.org`, and
`dns:http.dog`; callers supplied no independence labels.

Each of three immutable revisions stores three `PASS` cells, three `OK` source
statuses, one `PROVEN` row, all three derived domains, and no conflicts. The
on-chain gate `is_durably_proven(subject, 3)` returns `true`.

## Transactions

- Policy: https://explorer-studio.genlayer.com/tx/0x5f3881e75c05dd3eeae7cd607fac4f5450dd2bdf370f35812b4a71d5dcd23d82
- Subject/three-cell matrix: https://explorer-studio.genlayer.com/tx/0x05833da5100bd96875ea07157594e13e85c037cbc437244992323504c2e4c88b
- Revision 1: https://explorer-studio.genlayer.com/tx/0xc363a524d998948c1f6f5a0e15f9c7ffa2c0705a4110f561f85cf82934fbbc44
- Revision 2: https://explorer-studio.genlayer.com/tx/0x1a743b48524172138a985473baa63bc0ea9138699ce7e507f8ae7c01ff946271
- Revision 3: https://explorer-studio.genlayer.com/tx/0xc3e3950dbda4bd6a7827b531fd546a5c0cd055dce300ab75619c2a1656f81e2a

All transactions finalized with `MAJORITY_AGREE`, the stored matrices are
`PROVEN`, and the three-revision durability gate is `true`.
