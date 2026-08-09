# Live Durable Matrix Proof

Subject: `matrix-agent-7-1786304488627`

Dimensions: **2 claims × 4 orthogonal proof axes × 3 immutable revisions**.

Each revision stores eight `PASS` cells, eight `OK` source statuses, two
`PROVEN` row states, four distinct independence groups per row, no conflicts,
the full evidence fingerprint, and a canonical matrix fingerprint. The on-chain
consumer gate `is_durably_proven(subject, 3)` returns `true`.

Evidence is pinned to Git commit `f974f3fe690f493690e0a2db532fa4c63fe4102e`.

## Transactions

- Policy: https://explorer-studio.genlayer.com/tx/0x31b7763701b735c51ee8bbc0220dae831ba181777faa9f7420f084ba391d53ac
- Subject/eight-cell matrix: https://explorer-studio.genlayer.com/tx/0x1b1686dd4a4411dacc3aff2b028866bf743749d45ef493cd8e9880a60fb2fc0e
- Revision 1: https://explorer-studio.genlayer.com/tx/0x7f407681dcc2df38496d1c06f7de4c921c500dd960f01ec5a731402b4d9b962e
- Revision 2: https://explorer-studio.genlayer.com/tx/0xe1b9a2f8666addde06ee78bd0ac7c298b73f1df99c8c23509cfd5c16c5d9a5fe
- Revision 3: https://explorer-studio.genlayer.com/tx/0x9c8f6e83966d77cbf2fcd3b7d2bb256e3145985e8fb40f20fbec275239f486b1

All five transactions finalized with `MAJORITY_AGREE` and successful contract
execution. RPC receipt-polling timeouts were independently checked by fetching
the finalized transaction records and reading the stored revisions.
