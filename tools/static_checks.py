from pathlib import Path


source = Path("contracts/orthogonal_proof.py").read_text(encoding="utf-8")


def require(value: bool, message: str) -> None:
    if not value:
        raise AssertionError(message)


require(source.startswith('# { "Depends": "py-genlayer:'), "runner is not pinned")
require("run_nondet_unsafe" in source, "custom validator missing")
for field in ("cell_states_json", "row_states_json", "conflicts_json", "source_statuses_json",
              "evidence_fingerprint", "matrix_state", "matrix_fingerprint"):
    require(f'leader["{field}"] == validator["{field}"]' in source, f"unbound field: {field}")
require("explanation:" not in source and "summary:" not in source, "free-form state forbidden")
require("is_durably_proven" in source, "temporal durability gate missing")
print("static checks passed")
