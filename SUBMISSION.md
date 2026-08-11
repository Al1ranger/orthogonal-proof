# Corrected Portal Submission

## Title

OrthogonalProof — Validator-Derived Independence Certificates

## Notes / Description

OrthogonalProof is a reusable GenLayer primitive for claims requiring independent proof mechanisms rather than source majority. Callers provide assertion rows, proof axes and HTTPS evidence URLs, but cannot declare independence. The contract derives a conservative registrable DNS failure domain for every URL; paths and subdomains under one domain count once. Validators independently fetch every cell and require exact equality of cell states, row states, conflicts, source statuses, derived-domain vectors, coverage, fingerprints and final state—not merely PROVEN. Contradictions dominate and unavailable evidence never passes. Immutable revisions support durable-proof gates. A live IANA × MDN × HTTP Dog matrix stored three consecutive PROVEN revisions with three PASS cells, three derived domains and no conflicts; is_durably_proven(...,3) returns true. GenVM lint, 10 adversarial tests, source discovery and exact deployed-source verification pass.

## Evidence

- Repository: https://github.com/Al1ranger/orthogonal-proof
- Correction: https://github.com/Al1ranger/orthogonal-proof/blob/master/CORRECTION.md
- Contract: https://explorer-studio.genlayer.com/address/0xbdC373dB7E9B03E33453A7F79a90C8bcD182605f
- Deployment: https://explorer-studio.genlayer.com/tx/0x82066cf7edf2c42b40a54c33eb439b033b820ba55ec1233cc34d2f122f2e7d8c
- Final durable revision: https://explorer-studio.genlayer.com/tx/0xc3e3950dbda4bd6a7827b531fd546a5c0cd055dce300ab75619c2a1656f81e2a
