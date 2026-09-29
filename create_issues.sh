#!/usr/bin/env bash
# Creates sprints (milestones), labels and all task issues for the webshop project.
# Requirements: GitHub CLI installed and logged in (gh auth login).
# Safe to run again: issues whose title already exists are skipped.

# ===== EDIT THESE =====
REPO="xenomorpha/verbose-sniffle"
PERSON_A="daniiiil11111"
PERSON_B="xenomorpha"
PROJECT="WEBSHOP GRUPPE PROJEKT"
# ======================

if [ -n "$PERSON_A" ] && [ -n "$PERSON_B" ]; then AB="$PERSON_A,$PERSON_B"; else AB=""; fi

echo "Loading existing issues..."
EXISTING=$(gh issue list --repo "$REPO" --state all --limit 500 --json title --jq '.[].title')

exists() { printf '%s\n' "$EXISTING" | grep -Fxq "$1"; }

S1="Sprint 1 - Setup & skeleton"
S2="Sprint 2 - Product catalog"
S3="Sprint 3 - Cart & checkout"
S4="Sprint 4 - Polish & wrap-up"

echo "Creating milestones..."
for M in "$S1" "$S2" "$S3" "$S4"; do
  gh api "repos/$REPO/milestones" -f title="$M" >/dev/null 2>&1 || echo "  (milestone '$M' may already exist)"
done

echo "Creating labels..."
gh label create "US1 product list"   --repo "$REPO" --color "1d76db" --description "Show all products" --force
gh label create "US2 add to cart"    --repo "$REPO" --color "0e8a16" --description "Add product to cart" --force
gh label create "US3 edit cart"      --repo "$REPO" --color "5319e7" --description "Change quantity / remove" --force
gh label create "US4 checkout"       --repo "$REPO" --color "d93f0b" --description "Place an order" --force
gh label create "US5 docker"         --repo "$REPO" --color "0052cc" --description "Start with one command" --force
gh label create "US6 product detail" --repo "$REPO" --color "c5def5" --description "Product details page" --force
gh label create "scrum"              --repo "$REPO" --color "fbca04" --description "Scrum events and organisation" --force
gh label create "docs"               --repo "$REPO" --color "bfdadc" --description "Documentation" --force
gh label create "optional"           --repo "$REPO" --color "ededed" --description "Only if time allows" --force

# usage: issue "title" "milestone" "labels" "assignees" "owner letter" "estimate h"
issue() {
  if exists "$1"; then echo "  skip (exists): $1"; return 0; fi
  local body="Owner: $5
Estimate: $6 h"
  local args=(--repo "$REPO" --title "$1" --milestone "$2" --label "$3" --body "$body")
  if [ -n "$4" ]; then args+=(--assignee "$4"); fi
  if [ -n "$PROJECT" ]; then args+=(--project "$PROJECT"); fi
  gh issue create "${args[@]}" || echo "  (warning above can be ignored if the issue was created)"
}

# usage: scrum_issue "milestone" "sprint number"
scrum_issue() {
  if exists "Sprint $2: Scrum events"; then echo "  skip (exists): Sprint $2: Scrum events"; return 0; fi
  local body="Recurring Scrum events for this sprint:
- [ ] Sprint Planning (30 min): sprint goal, select and split tasks
- [ ] Daily at the start of each work session (5-10 min), notes written by Scrum Master
- [ ] Code review of each task before moving it to Done
- [ ] Sprint Review (20 min): demo, Product Owner accepts stories
- [ ] Retrospective (20 min): what went well / badly / what we change, notes written"
  local args=(--repo "$REPO" --title "Sprint $2: Scrum events" --milestone "$1" --label "scrum" --body "$body")
  if [ -n "$AB" ]; then args+=(--assignee "$AB"); fi
  if [ -n "$PROJECT" ]; then args+=(--project "$PROJECT"); fi
  gh issue create "${args[@]}" || echo "  (warning above can be ignored if the issue was created)"
}

echo "Creating Sprint 1 issues..."
scrum_issue "$S1" 1
issue "Kick-off meeting: agree on roles and plan"                          "$S1" "scrum" "$AB" "A+B" 0.5
issue "Inform lecturer that the team has 2 members"                        "$S1" "scrum" "$PERSON_B" "B" 0.1
issue "Set up repository: add collaborator, .gitignore, README stub"      "$S1" "scrum" "$PERSON_A" "A" 0.3
issue "Create project board (To Do, In Progress, Review, Done)"           "$S1" "scrum" "$PERSON_A" "A" 0.3
issue "Add user stories and tasks to the board"                           "$S1" "scrum" "$PERSON_A" "A" 0.5
issue "Agree on Definition of Ready and Definition of Done"               "$S1" "scrum" "$AB" "A+B" 0.3
issue "[US5] Install Docker Desktop and verify with hello-world"          "$S1" "US5 docker" "$AB" "each" 0.5
issue "[US5] Install VS Code and configure Git (name, email)"             "$S1" "US5 docker" "$AB" "each" 0.3
issue "[US5] Short Git tutorial: clone, pull, commit, push"               "$S1" "US5 docker" "$AB" "each" 1
issue "[US5] Create folder structure: frontend/, backend/, db/"           "$S1" "US5 docker" "$PERSON_A" "A" 0.2
issue "[US5] Backend: minimal Express server returning Hello + Dockerfile" "$S1" "US5 docker" "$PERSON_A" "A" 1.5
issue "[US5] Frontend: simple index.html + nginx Dockerfile"              "$S1" "US5 docker" "$PERSON_B" "B" 1
issue "[US5] Write docker-compose.yml with frontend, backend, db"         "$S1" "US5 docker" "$PERSON_B" "B" 1
issue "[US5] Connect backend to database with a test query"               "$S1" "US5 docker" "$PERSON_A" "A" 1
issue "[US5] Verify docker-compose up works on both machines"             "$S1" "US5 docker" "$AB" "A+B" 0.5

echo "Creating Sprint 2 issues..."
scrum_issue "$S2" 2
issue "[US1] Learn SQL basics: CREATE TABLE, INSERT, SELECT"              "$S2" "US1 product list" "$PERSON_B" "B" 1
issue "[US1] Create products table (id, name, price, image, description, stock)" "$S2" "US1 product list" "$PERSON_B" "B" 0.5
issue "[US1] Add 6-10 sample products"                                    "$S2" "US1 product list" "$PERSON_B" "B" 0.5
issue "[US1] Auto-create table and data on container start (init.sql)"    "$S2" "US1 product list" "$PERSON_B" "B" 0.5
issue "[US1] API: GET /api/products returns products from the database"   "$S2" "US1 product list" "$PERSON_A" "A" 1.5
issue "[US1] Frontend: load product list from API (fetch)"                "$S2" "US1 product list" "$PERSON_A" "A" 1
issue "[US1] Product cards layout: name, price, image"                    "$S2" "US1 product list" "$PERSON_B" "B" 1.5
issue "[US1] Find product images or icons"                                "$S2" "US1 product list" "$PERSON_B" "B" 0.3
issue "[US1] Manually test acceptance criteria"                           "$S2" "US1 product list" "$AB" "A+B" 0.3
issue "Swap Product Owner and Scrum Master roles after Sprint Review"     "$S2" "scrum" "$AB" "A+B" 0.1

echo "Creating Sprint 3 issues..."
scrum_issue "$S3" 3
issue "[US2] Decide where the cart is stored (browser)"                   "$S3" "US2 add to cart" "$AB" "A+B" 0.2
issue "[US2] Add to cart button on each product"                          "$S3" "US2 add to cart" "$PERSON_A" "A" 1
issue "[US2] Cart counter in header updates immediately"                  "$S3" "US2 add to cart" "$PERSON_A" "A" 0.5
issue "[US3] Cart page: list of items and total"                          "$S3" "US3 edit cart" "$PERSON_B" "B" 1
issue "[US3] Quantity +/- and remove buttons"                             "$S3" "US3 edit cart" "$PERSON_B" "B" 1
issue "[US3] Recalculate total on every change"                           "$S3" "US3 edit cart" "$PERSON_B" "B" 0.5
issue "[US4] Create orders and order_items tables"                        "$S3" "US4 checkout" "$PERSON_A" "A" 0.5
issue "[US4] API: POST /api/orders saves order to the database"           "$S3" "US4 checkout" "$PERSON_A" "A" 2
issue "[US4] Checkout form: name and email with required-field check"     "$S3" "US4 checkout" "$PERSON_B" "B" 1
issue "[US4] Submit order, clear cart, show confirmation page"            "$S3" "US4 checkout" "$PERSON_B" "B" 1.5
issue "[US4] Verify the order is stored in the database"                  "$S3" "US4 checkout" "$AB" "A+B" 0.3
issue "[US6] API: GET /api/products/:id"                                  "$S3" "US6 product detail,optional" "$PERSON_A" "A" 1
issue "[US6] Product detail page: description, price, stock"              "$S3" "US6 product detail,optional" "$PERSON_B" "B" 1.5

echo "Creating Sprint 4 issues..."
scrum_issue "$S4" 4
issue "Finish stories carried over from Sprint 3 (US4 / US6)"             "$S4" "scrum" "$AB" "A+B" 3
issue "Full test of all stories against acceptance criteria"              "$S4" "scrum" "$AB" "A+B" 1
issue "[US5] Fresh-clone test: clone repo to new folder and run docker-compose up" "$S4" "US5 docker" "$AB" "A+B" 0.5
issue "Fix bugs found during testing"                                     "$S4" "scrum" "$AB" "A+B" 1
issue "Basic styling cleanup (CSS)"                                       "$S4" "scrum" "$PERSON_B" "B" 1
issue "README: description, how to run, tech stack, authors"              "$S4" "docs" "$PERSON_A" "A (SM)" 0.5
issue "Collect Scrum documentation: meeting notes, board screenshot"      "$S4" "docs" "$PERSON_A" "A (SM)" 0.5
issue "Fill in assignment document in German (roles, sprints, stack)"     "$S4" "docs" "$PERSON_B" "B (PO)" 1
issue "Prepare demo: catalog to order confirmation"                       "$S4" "docs" "$PERSON_B" "B (PO)" 0.5
issue "Final project retrospective"                                       "$S4" "scrum" "$AB" "A+B" 0.5

echo "Done! Check the issues and the board on GitHub."