# Portal Submission

## Title

OrthogonalProof — Multi-Dimensional Consensus Certificates

## Notes / Description

OrthogonalProof is a reusable GenLayer primitive for claims that require independent proof mechanisms rather than source majority. Builders define a matrix whose rows are assertions and columns are ORIGIN, DIRECT, INDEPENDENT and TEMPORAL proof axes. Each row specifies required axes and minimum independence groups. Validators independently fetch every cell source and rebuild the complete matrix. Consensus requires exact equality of cell states, row states, conflicts, source statuses, evidence fingerprint, matrix state and matrix fingerprint—not merely the final PROVEN label. Sources sharing one failure domain cannot satisfy independence; any required contradiction yields CONTESTED; UNKNOWN or UNAVAILABLE never count as proof. Immutable revisions preserve history, expose historical conflicts and support is_durably_proven gates requiring consecutive successful revisions. Eight adversarial tests, GenVM lint, static checks and exact deployed-source verification pass.

## Evidence

- Repository: https://github.com/Al1ranger/orthogonal-proof
- Contract: https://explorer-studio.genlayer.com/address/0x51C1a30bc5AB6c4Aa6aC46D7ad06967E8b72f537
- Deployment: https://explorer-studio.genlayer.com/tx/0xbb61b46ec2bd86f91eebd32fa99cf23de5c2d34a5f6dac9899846a56d1533676
