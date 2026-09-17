# BRIEFING — 2026-09-16T18:17:00+05:30

## Mission
Systematically review, verify, and correct 20-teerthankar-puja (श्री विद्यमान बीस तीर्थंकर पूजा) in E:/JainJinvani/public/modules/ritual_data.js and sync with build/modules/ritual_data.js.

## 🔒 My Identity
- Archetype: Project Orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: E:\JainJinvani\.agents\orchestrator_1
- Original parent: parent
- Original parent conversation ID: 5f778e14-7f35-46d3-a777-de03efdc9cc7

## 🔒 My Workflow
- **Pattern**: Project Pattern (Survey -> Decompose -> Direct Iteration Loop or Delegate)
- **Scope document**: E:\JainJinvani\.agents\orchestrator_1\PROJECT.md
1. **Decompose**: Survey ritual_data.js for 20-teerthankar-puja structure, canonical text requirements, missing anatomy (Sthapana, Tek, Jaimala, Sanskrit Vibhakti), and decompose into execution milestones.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate check.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical; auditor is non-skippable)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: At 16 spawns, write handoff.md, kill timers, spawn successor.
- **Work items**:
  1. Survey & Map 20-teerthankar-puja current state vs Canonical Requirements [in-progress]
  2. Implement corrections & anatomy completion [pending]
  3. Verify syntax, markup, canon, and synchronize public/ & build/ [pending]
- **Current phase**: 1 (Survey & Plan)
- **Current focus**: Survey current 20-teerthankar-puja in ritual_data.js and verify canonical sources

## 🔒 Key Constraints
- NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- NEVER investigate or explore the problem at the code level — dispatch Explorers for technical investigation.
- You MAY use file-editing tools ONLY for metadata/state files (.md) in your .agents/ folder.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.
- Strict one-puja-at-a-time execution protocol.

## Current Parent
- Conversation ID: 5f778e14-7f35-46d3-a777-de03efdc9cc7
- Updated: 2026-09-16T18:17:00+05:30

## Key Decisions Made
- Focus specifically on the first target: '20-teerthankar-puja' (श्री विद्यमान बीस तीर्थंकर पूजा).
- Dispatch parallel Explorers to assess canonical accuracy, current code structure, and missing components.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|---|---|---|---|---|
| explorer_survey_1 | teamwork_preview_explorer | Codebase Architecture & Schema (replaced) | errored | 67b908a5-858f-463a-b931-2aa33932ae72 |
| explorer_survey_1_repl | teamwork_preview_explorer | Codebase Architecture & Schema | completed | 72177765-8af3-45c2-bfaf-543eedbc0a63 |
| explorer_survey_2 | teamwork_preview_explorer | Canonical Texts & Mantra Research | completed | c8ebba5f-78b5-497b-9337-4c5a83cd9244 |
| explorer_survey_3 | teamwork_preview_explorer | Gap Analysis & Node Validation | completed | b458c7ec-a66e-4749-8c73-681fad09dce7 |
| test_writer_1 | teamwork_preview_test_writer | Node.js Test Suite & Lint Script | in-progress | 5337f52d-e218-4df4-a1fa-81f8e4b5995a |
| reviewer_1 | teamwork_preview_reviewer | Canonical Liturgical Review | in-progress | b296e77e-f8aa-43ee-836a-f8e6e5e3cec1 |
| reviewer_2 | teamwork_preview_reviewer | Schema & HTML Hygiene Review | in-progress | 0b154074-dadc-442a-9f54-423e7ec718b0 |

## Succession Status
- Succession required: no
- Spawn count: 7 / 16
- Pending subagents: 5337f52d-e218-4df4-a1fa-81f8e4b5995a, b296e77e-f8aa-43ee-836a-f8e6e5e3cec1, 0b154074-dadc-442a-9f54-423e7ec718b0
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 0e2fd15a-23a9-4d64-87a2-8a794360d301/task-18
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run `manage_task(Action="list")` — re-create if missing

## Artifact Index
- E:\JainJinvani\.agents\ORIGINAL_REQUEST.md — Original User Request
- E:\JainJinvani\.agents\orchestrator_1\DISPATCH.md — Dispatch log from parent
- E:\JainJinvani\.agents\orchestrator_1\BRIEFING.md — Working memory and status
- E:\JainJinvani\.agents\orchestrator_1\progress.md — Liveness signal and task progress
