# Failure-domain correction

The rejected version accepted a caller-provided `group` string for each proof
cell. A caller could label URLs on the same domain differently and inflate
independence.

The corrected contract derives a conservative registrable DNS failure domain
from every HTTPS URL. Different paths and subdomains under one registrable
domain collapse to one identity. Common compound suffixes such as `co.uk` are
handled; userinfo, IP literals, localhost-style hosts, and malformed authorities
are rejected. Caller `group` properties are discarded and never stored or
counted.

Every revision stores the ordered `failure_domains_json` vector and per-row
coverage. Both are required to match the validator's independent recomputation.

The Python static-check helper was removed. `npm run check:discovery` proves
that `contracts/orthogonal_proof.py` is the sole contract-like Python source.
Ten direct tests cover attacker aliases, same-domain subdomains, compound
suffixes, unavailable evidence, contradictions, validator disagreement,
immutability, and durability.
