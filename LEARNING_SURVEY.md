# Learning survey and results

The optional **Learning Survey** measures climate knowledge, climate justice understanding, confidence and intention to act. It is separate from the existing System Usability Scale (SUS), module quizzes and certificates.

## Where to find it

- Learners: the **Learning survey** card near the top of the dashboard, the desktop sidebar, or the mobile learning menu. The direct route is `/learning-survey`.
- Administrators: open **Admin → View learning results**. The results panel has **Export learning results to Excel** and **Download presentation summary (PDF)**.
- Old baseline/endline bookmarks at `/assessment` redirect to the new survey. `/assessment?type=sus` continues to open the existing SUS form.

## Learner flow

1. A learner with no recorded learning activity can complete a before-course response. They must confirm that they have not started the lessons or quizzes. Completed lessons waiting in browser storage also prevent the form from presenting a new response as a true baseline.
2. After the server confirms all required lessons and passing module quizzes, the after-course response becomes available.
3. The form has four sections: four knowledge questions, four more knowledge questions, four confidence ratings, and one intention rating. An optional after-course comment asks what the learner wants to apply. Every scale has written labels and the form supports English and Kiswahili.
4. An account-specific browser draft preserves answers when navigating away or after a failed submission. A response is confirmed as saved only after the server acknowledges it. Reconnect and retry if a submission fails; this is not an automatic background-sync queue.
5. A learner who already started cannot submit a late baseline. A course completer without a baseline can submit current results and, optionally, remembered before-course confidence and intention ratings. These recalled ratings are shown separately.

Participation is voluntary. Skipping a survey or answering incorrectly does not affect grades or certificate eligibility. Consent is explicit and recorded with a server timestamp. Learners can withdraw their saved survey responses from the same page; previously downloaded copies may need a separate removal request.

## What the results mean

| Measure | Scoring | Change displayed |
| --- | --- | --- |
| Climate knowledge | Eight multiple-choice questions, one point each; percentage correct | Percentage points |
| Climate justice | Two questions within the eight-question knowledge score; descriptive subscore | Percentage points |
| Confidence to act | Mean of four ratings, each 1–5 | Scale points |
| Intention to act | One rating, 1–5, about the next 30 days | Scale points |

The instrument ID is `ncj-outcomes-1`. It is a short project-developed assessment, not a validated standardised literacy scale or an unchanged reproduction of a longer proposal instrument. Question wording and coding are versioned in `shared/learningOutcomes.ts`; correct-answer rules are server-side. Wording or scoring changes require a new version so incompatible forms are not pooled. Review the bilingual wording with educators and pilot the questions before making broader research claims.

Only the same learner's before and after responses to this version contribute to matched change estimates. The admin panel gives the sample size, before-only and after-only counts, and language-switch counts. Missing measurements remain blank / “No data yet”; they are not zero scores. Current levels, recalled confidence and measured changes remain separate. Intention is not evidence of a completed community action. Without a comparison group, before/after changes alone do not establish causation. No responses, scores, learners or graphs are seeded for production.

## Exports for a presentation

The two-page PDF uses plain black and grey charts and includes sample counts, scoring units and interpretation. It can be shown directly to professors or used alongside the slides. Charts remain empty when no matched responses exist.

The Excel workbook contains five sheets:

1. **Summary:** the sample counts and headline comparisons.
2. **Matched learners:** one coded row for each learner with both responses.
3. **All responses:** phase, language, submission date, raw answers, calculated scores and optional comments.
4. **Item results:** matched changes for each knowledge and confidence item.
5. **Question guide:** wording, answer coding and interpretation rules.

Names, emails, tokens and raw account IDs are excluded from these exports. Codes are pseudonymous, not irreversibly anonymous. Keep the workbook restricted, check optional comments before sharing them, and present aggregate figures. Each export is calculated from actual saved responses at its displayed snapshot time.

## API and storage

| Method | Route | Access |
| --- | --- | --- |
| GET | `/api/v1/learning-outcomes/status` | Signed-in learner, own status and scores |
| POST | `/api/v1/learning-outcomes/responses` | Signed-in learner; server validates phase, answers and completion |
| DELETE | `/api/v1/learning-outcomes/responses` | Signed-in learner, withdraw own responses |
| GET | `/api/v1/admin/learning-outcomes` | Admin summary |
| GET | `/api/v1/admin/export/learning-outcomes.xlsx` | Admin Excel download |
| GET | `/api/v1/admin/export/learning-outcomes.pdf` | Admin PDF download |

The additive `learning_outcome_responses` table is created by the existing `setupDb()` process. No existing tables or records are rewritten. The table has unique user/version/phase and user/submission-ID indexes, with a cascading user foreign key. Server authentication determines ownership. First saved responses remain immutable and retries do not create another row. Client-supplied scores are ignored. Privacy-sensitive endpoints return `Cache-Control: no-store`.

Deploy the frontend, backend and root `shared/` folder together. No new packages or secrets are required. Continue using the existing persistent SQLite disk and `SQLITE_DB_PATH`. Back up the existing database before deployment using the normal operational process. This change does not migrate old assessment or SUS records into the new instrument.

## Verification

Run from the repository root:

```bash
npm --prefix server test -- --runInBand
npm --prefix client test
npm --prefix client run build
npm --prefix client run lint
```

The new tests check grading and matching, missing and recalled data, authentication and admin export restrictions, phase eligibility, ownership, immutable retries, withdrawal, account deletion, browser drafts, Kiswahili wording, failed submissions and export file types.

## Design references

- CDC. (2024). *CDC Program Evaluation Framework, 2024*. https://www.cdc.gov/mmwr/volumes/73/rr/rr7306a1.htm
- UNESCO. (2024). *Greening curriculum guidance: Teaching and learning for climate action*. https://www.unesco.org/en/articles/greening-curriculum-guidance-teaching-and-learning-climate-action
- University of Nevada, Reno Extension. *Results from a workplace health and wellness program* (retrospective pre/post method example). https://extension.unr.edu/publication.aspx?PubID=2516

These sources inform the evaluation design and the separation of knowledge, confidence and action. They do not validate this particular questionnaire or certify the application's effects.
