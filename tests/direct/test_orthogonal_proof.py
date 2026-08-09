import json


CONTRACT = "contracts/orthogonal_proof.py"
AXES = ["ORIGIN", "DIRECT"]
ROWS = [
    {"id": "identity", "claim": "Agent identifier is agent-7", "required_axes": AXES,
     "critical": True, "min_independent_groups": 2},
    {"id": "capability", "claim": "Agent exposes capability analyze-v2", "required_axes": AXES,
     "critical": True, "min_independent_groups": 2},
]


def cells(groups=("publisher", "runtime", "publisher", "external")):
    result = []
    index = 0
    for row in ROWS:
        for axis in AXES:
            result.append({"row": row["id"], "axis": axis,
                "url": f"https://evidence.example/cell-{index}", "group": groups[index]})
            index += 1
    return result


def setup(contract, groups=("publisher", "runtime", "publisher", "external")):
    contract.register_policy("agent-capability-v1", "Agent capability matrix", json.dumps(ROWS), json.dumps(AXES))
    contract.register_subject("agent-7", "agent-capability-v1", "https://agent.example/agent-7", json.dumps(cells(groups)))


def mock_sources(direct_vm, missing_index=None):
    for index in range(4):
        direct_vm.mock_web(rf"evidence\.example/cell-{index}", {
            "status": 404 if index == missing_index else 200,
            "body": "not found" if index == missing_index else
                ("agent-7 identity verified" if index < 2 else "analyze-v2 capability verified"),
        })


def mock_states(direct_vm, states):
    direct_vm.mock_llm(r"reconstructing an orthogonal proof matrix",
        json.dumps({"cell_states": states, "explanation": "ignored"}))


def test_registers_canonical_policy_and_subject(direct_deploy):
    contract = direct_deploy(CONTRACT)
    setup(contract)
    assert contract.get_policy("agent-capability-v1").active is True
    assert contract.get_subject("agent-7").latest_revision == 0
    assert contract.counts() == "policies=1;subjects=1;revisions=0"


def test_proven_matrix_binds_cells_rows_and_sources(direct_vm, direct_deploy):
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS"] * 4)
    contract = direct_deploy(CONTRACT)
    setup(contract)
    contract.evaluate("agent-7")
    matrix = contract.get_latest("agent-7")
    assert matrix.cell_states_json == '["PASS","PASS","PASS","PASS"]'
    assert matrix.row_states_json == '["PROVEN","PROVEN"]'
    assert matrix.source_statuses_json == '["OK","OK","OK","OK"]'
    assert matrix.conflicts_json == "[]"
    assert matrix.matrix_state == "PROVEN"
    assert contract.is_proven("agent-7") is True
    assert contract.is_durably_proven("agent-7", 2) is False


def test_same_failure_domain_is_not_independent_proof(direct_vm, direct_deploy):
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS"] * 4)
    contract = direct_deploy(CONTRACT)
    setup(contract, ("acme", "acme", "publisher", "external"))
    contract.evaluate("agent-7")
    assert contract.get_latest("agent-7").row_states_json == '["INSUFFICIENT","PROVEN"]'
    assert contract.is_proven("agent-7") is False


def test_critical_fail_dominates_pass_majority(direct_vm, direct_deploy):
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS", "FAIL", "PASS", "PASS"])
    contract = direct_deploy(CONTRACT)
    setup(contract)
    contract.evaluate("agent-7")
    matrix = contract.get_latest("agent-7")
    assert matrix.matrix_state == "CONTESTED"
    assert matrix.conflicts_json == "[1]"
    assert contract.has_historical_conflict("agent-7") is True


def test_missing_required_cell_forces_insufficient(direct_vm, direct_deploy):
    mock_sources(direct_vm, missing_index=2)
    mock_states(direct_vm, ["PASS"] * 4)
    contract = direct_deploy(CONTRACT)
    setup(contract)
    contract.evaluate("agent-7")
    matrix = contract.get_latest("agent-7")
    assert matrix.cell_states_json == '["PASS","PASS","UNAVAILABLE","PASS"]'
    assert matrix.matrix_state == "INSUFFICIENT"


def test_validator_rejects_suppressed_failure(direct_vm, direct_deploy):
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS"] * 4)
    contract = direct_deploy(CONTRACT)
    setup(contract)
    contract.evaluate("agent-7")
    direct_vm.clear_mocks()
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS", "FAIL", "PASS", "PASS"])
    assert direct_vm.run_validator() is False


def test_three_consecutive_revisions_are_durable_and_immutable(direct_vm, direct_deploy):
    mock_sources(direct_vm)
    mock_states(direct_vm, ["PASS"] * 4)
    contract = direct_deploy(CONTRACT)
    setup(contract)
    contract.evaluate("agent-7")
    first = contract.get_matrix("agent-7", 1).matrix_fingerprint
    contract.evaluate("agent-7")
    contract.evaluate("agent-7")
    assert contract.is_durably_proven("agent-7", 3) is True
    assert contract.get_matrix("agent-7", 1).matrix_fingerprint == first


def test_only_creator_can_revoke(direct_vm, direct_deploy, direct_bob):
    contract = direct_deploy(CONTRACT)
    setup(contract)
    with direct_vm.prank(direct_bob):
        with direct_vm.expect_revert("EXPECTED: only policy creator can revoke"):
            contract.revoke_policy("agent-capability-v1")
