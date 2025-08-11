# Focus Rail — V1 Requirements (Web‑only)

A single‑page, browser‑only focus tool that helps users complete one task at a time via intent capture, soft switching friction, fast capture, and a brief review loop. Everything runs locally in the browser; no accounts and no third‑party integrations.

---

# 1. Goals & Non‑Goals

## Goals

* Make **unitasking** the default: users work on exactly one Focus Card at a time.
* Provide **gentle friction** (hold‑to‑resume/exit) to reduce impulsive context switches.
* Enable **frictionless capture** of thoughts without leaving Focus Mode.
* Offer a quick **review** that converts captured items into next steps and reinforces progress.
* Work fully **offline** and **private** (local storage only).

## Non‑Goals (V1)

* No extensions, desktop helpers, or OS‑level app control.
* No Slack/Teams/Calendar/Git integrations.
* No accounts or multiplayer/teams.
* No hard website blocking; only soft, self‑controlled friction.

---

# 2. Personas & Primary Use Cases

## Personas

* **Developer/Engineer:** deep coding on a ticket; frequent distracting ideas (todos/links) appear.
* **Designer:** focused on a design task; needs quick capture for references.
* **PM/Writer:** drafting/analysis; benefits from checklists and capture→subtask conversion.

## Use Cases

* Create a **Focus Card** with a definition of done and session length.
* Enter **Focus Mode**, see a minimal HUD and checklist drawer.
* **Capture** notes/todos/links mid‑flow without tab switching.
* Handle an **interruption** (user switches tab/window): auto‑pause and **hold‑to‑resume** gate.
* **Break** automatically when focus timer ends; then resume or end.
* **Review** session; convert captures into checklist items or new cards.
* **Export/Import** data as JSON; toggle theme.

---

# 3. Functional Requirements

## 3.1 Focus Cards & Queue

* Users can **create**, **edit**, **reorder (drag)**, **archive** cards.
* Card fields: `title` (required), `scope/notes` (Markdown), `session length (min)`, `definition of done` (>=1 item → initializes checklist).
* Queue shows: title, checklist count, session length, actions (Start/Edit/Archive).
* Autosave all edits locally.

**Acceptance**

* Creating a card with at least one DoD item places it at the **top** of the queue.
* Reordering persists after reload.
* Archiving hides the card from the default queue list.

## 3.2 Focus Session (HUD)

* Start a session from any card → open **Focus Overlay** with HUD.
* HUD shows: **timer**, **progress ring**, **phase label** (Focus/Break/Paused), **title**, **stats** (captures & interruptions), actions: **Checklist**, **Capture**, **Pause**, **End & Review**, **Fullscreen**.
* Timer runs accurately even when the tab is backgrounded.

**Acceptance**

* Timer drift < 1s/min across 60+ minutes with backgrounding.
* Progress ring updates smoothly (≥10 FPS perceived).

## 3.3 Phases & Cycles

* Default focus/break preset: **50/10**. Alternate via card minutes (25/5 support via quick buttons).
* When Focus reaches 0, phase switches to **Break**, plays a beep, shows notification (if permitted).
* When Break reaches 0, session **auto‑ends (completed)**.

**Acceptance**

* End of Focus triggers break exactly once; end of Break ends session and opens Review.

## 3.4 Interruption Handling (Soft Friction)

* Use Page Visibility to detect leaving the tab. If away > **10s** during Focus, auto‑**pause** and log an **interruption**.
* On return, show **Hold Gate** (configurable seconds; default 3s) to resume.

**Acceptance**

* Interruption count increments after a >10s blur event; smaller blurs are ignored.
* Resuming requires a full hold; releasing early cancels the resume.

## 3.5 Checklist Drawer

* Slide‑over lists current card checklist items with checkboxes.
* Toggle with HUD button; keyboard toggling via Space on focused item.

**Acceptance**

* Checking an item persists instantly and is reflected in queue and review views.

## 3.6 Capture & Session Inbox

* Capture modal opens via HUD button or **J** key.
* Types: **Note**, **To‑do**, **Link**.
* Captures attach to the **active session/card**, stored locally.
* Saving capture updates HUD stats.

**Acceptance**

* Capture modal appears within 150ms; closing it does not affect timer state.
* Empty submission is blocked with a friendly message.

## 3.7 Pause/Resume & Exit Gates

* **Pause** sets phase to Paused; **Resume** requires Hold Gate when invoked from interruption flow.
* **Exit** (⟵) prompts a short **Hold Gate** (2s) to confirm ending early (outcome: `in_progress`).

**Acceptance**

* Early exit records the session with outcome `in_progress` and opens Review.

## 3.8 Review & Conversion

* Review shows: card title, **focused minutes**, **interruptions count**.
* Lists **captures**; each can convert to: → **Checklist item** on the same card, or → **New Card** seeded from capture text.
* Shows card **checklist** for quick completion.

**Acceptance**

* Converting a capture updates state immediately; items disappear from the conversion list after action.

## 3.9 Stats (Local, Today + Lifetime)

* Header chips (Today): **focused minutes**, **sessions**, **interruptions**.
* Sidebar chips (Lifetime): **completed sessions**, **total focused minutes**.

**Acceptance**

* Today metrics reflect sessions that ended (for Focus phase time) and interruptions logged.

## 3.10 Preferences & Theme

* Toggle **light/dark** theme.
* Configure **gate seconds** (1–7), **sound on/off** (beeps), default **focus/break** minutes.

**Acceptance**

* Theme and preferences persist across reloads.

## 3.11 Data Export/Import

* Export full state (cards, sessions, captures, settings) to **JSON** file.
* Import from JSON; basic validation.

**Acceptance**

* Import replaces current state only on valid structure; otherwise show error toast.

## 3.12 PWA & Offline (Nice‑to‑Have Within V1 Scope if feasible)

* App functions offline after first load.
* (If added later as enhancement) `manifest.json` & service worker to enable **Install** prompt.

**Acceptance**

* With network disabled after initial load, users can create cards, run sessions, capture, review, and export.

---

# 4. Non‑Functional Requirements

## Privacy & Security

* All data kept **locally** (LocalStorage in V1 implementation; IndexedDB acceptable for growth). No network calls beyond loading static assets.
* No third‑party analytics.

## Performance

* UI interactions < **50ms** median.
* Timer uses `performance.now()` and animation frame loop; resilient to background throttling.

## Reliability

* Session state is resilient to reloads/crashes: on refresh during a session, app restores to Focus Overlay with correct elapsed and paused time.

## Accessibility (WCAG‑AA target)

* All interactive elements keyboard‑operable; focus styles visible.
* ARIA labels for HUD controls; reduced‑motion respect.
* Color contrast meets AA.

## Browser Support

* Latest **Chrome**, **Edge**, **Firefox**, **Safari** (desktop). Mobile support is best‑effort.

---

# 5. Information Architecture

* **Home / Queue:** cards list, actions, today chips.
* **Card Modal:** create/edit card (title, scope, DoD, minutes).
* **Focus Overlay (HUD):** timer/progress, actions, checklist drawer, capture modal.
* **Gate:** hold to resume/exit.
* **Review:** outcome summary, capture conversion, checklist.
* **Settings:** theme, gate seconds, sounds, defaults, import/export.

---

# 6. Data Model (Conceptual)

```json
{
  "Card": {
    "id": "uuid",
    "title": "string",
    "scope": "markdown",
    "minutes": 50,
    "doneDefinition": ["string"],
    "checklist": [ { "id": "uuid", "text": "string", "done": false } ],
    "tags": ["string"],
    "createdAt": "ISO",
    "archivedAt": "ISO | null"
  },
  "Session": {
    "id": "uuid",
    "cardId": "uuid",
    "start": "ISO",
    "end": "ISO | null",
    "plannedMinutes": 50,
    "phase": "focus | break | paused",
    "elapsedMs": 0,
    "pausedMs": 0,
    "interruptions": [ { "at": "ISO", "durationSec": 12, "reason": null } ],
    "captures": ["captureId"],
    "outcome": "completed | in_progress | blocked | null"
  },
  "Capture": {
    "id": "uuid",
    "cardId": "uuid",
    "sessionId": "uuid",
    "type": "note | todo | link",
    "content": "string",
    "createdAt": "ISO",
    "convertedTo": { "type": "checklist | card | null", "id": "uuid | null" }
  },
  "Settings": {
    "theme": "light | dark | system",
    "focusMin": 50,
    "breakMin": 10,
    "gateSeconds": 3,
    "sound": true
  },
  "Today": { "focusedMs": 0, "sessions": 0, "interruptions": 0 }
}
```

---

# 7. State & Logic Details

## Timer Logic

* Compute `remaining = plannedMs − (now − start − pausedMs)` for Focus.
* On Focus end → set `focusEndAt = now`, switch to Break.
* On Break end → auto‑end session (`outcome = completed`).

## Interruption Logic

* Record interruption when `document.visibilityState === 'hidden'` for >10s during Focus.
* On `focus` event, open Hold Gate to resume; gate duration = settings.gateSeconds.

## Hold Gate

* Visual progress fills a circular track during hold (pointerdown).
* Cancel on pointerup/leave/cancel; commit on full duration.

## Persistence

* Save on every meaningful interaction (debounced for text inputs).
* Export/Import full state as JSON.

---

# 8. Keyboard Shortcuts

* **N** — New Card
* **S** — Start first card in queue
* **J** — Capture
* **Space** — Toggle focused checklist item

(Shortcuts inactive when typing into inputs/textareas.)

---

# 9. Edge Cases & Error Handling

* **Empty DoD:** block save with toast: “Add at least one definition of done item.”
* **Import invalid JSON:** show toast “Import failed.” (no state change)
* **Multiple tabs:** only one active session is expected; V1 may allow duplicates, but the most recent tab’s actions win.
* **Notification permissions:** degrade gracefully; app functions without notifications.

---

# 10. QA Checklist (Acceptance Tests)

* **Timer accuracy:** 65‑minute run; drift < 1s/min with backgrounding.
* **Crash/refresh:** during active session, reload restores active HUD with correct times.
* **Capture speed:** modal opens <150ms and saves reliably even if the tab is closed immediately after save.
* **Accessibility:** keyboard‑only pass for all flows; screen reader announces timer and buttons.
* **Offline:** after initial load, airplane mode → all primary flows work.
* **Large data:** 1,000 cards & 10,000 captures → interactions remain <50ms median.

---

# 11. Out of Scope (Explicit)

* URL allow/deny lists, site blocking, tab killing
* Team presence/status, shared templates
* AI assistance (summaries/plans)
* Accounts, sync, cloud backup

---

# 12. Success Metrics (Local‑Only Proxies)

* % sessions finished without any interruptions
* Avg interruptions per focus hour
* Capture‑to‑checklist conversion rate
* Daily focused minutes and streaks
