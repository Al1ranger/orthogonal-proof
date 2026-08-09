# Portal Submission

## Title

OrthogonalProof — Multi-Dimensional Consensus Certificates

## Notes / Description

OrthogonalProof is a reusable GenLayer primitive for claims requiring independent proof mechanisms rather than source majority. Builders define assertion rows and ORIGIN, DIRECT, INDEPENDENT and TEMPORAL axes, with required coverage and minimum failure-domain groups per row. Validators independently fetch every cell and rebuild the matrix. Consensus binds cell and row states, conflicts, source statuses, evidence and matrix fingerprints, group coverage and final state—not merely PROVEN. Same-domain sources cannot satisfy independence; contradictions dominate; missing evidence never passes. Immutable revisions support durable-proof gates. A live 2×4 matrix finalized three consecutive PROVEN revisions: each stores eight PASS cells, eight OK sources, four groups per row and no conflicts; is_durably_proven(...,3) returns true. GenVM lint, eight adversarial tests and exact deployed-source verification pass.

## Evidence

- Repository: https://github.com/Al1ranger/orthogonal-proof
- Contract: https://explorer-studio.genlayer.com/address/0x57115ADdC1b97F67c33AC7Fdbe0a775019877D23
- Deployment: https://explorer-studio.genlayer.com/tx/0x2e62751eec903a5b0fd5d24f72811127ad3ec766b055965e5eaf1db6f0a27a27
- Final durable revision: https://explorer-studio.genlayer.com/tx/0x9c8f6e83966d77cbf2fcd3b7d2bb256e3145985e8fb40f20fbec275239f486b1
