# SE2020 Project Submission Guide

This document converts the `SE2020 Assignment Submission Guidelines.pdf` rules into a project-specific guide for the Yatara Ceylon mobile application.

## Project Repository

GitHub repository:

```text
https://github.com/sahansbandara/Yatara-Ceylon-Mobile-App
```

The GitHub repository contains the required source-code structure:

```text
Yatara-Ceylon-Mobile-App/
├── frontend/       React Native Expo mobile app
├── backend/        Node.js + Express API
├── docs/           Assignment documentation, diagrams, member files
├── agent/          Project tracking notes
├── README.md       Main GitHub setup/deployment guide
└── package.json    Root convenience scripts
```

## Assignment Stack Compliance

| PDF Requirement | Yatara Implementation |
| --- | --- |
| Frontend: React Native | `frontend/` Expo React Native app |
| Backend: Node.js + Express.js | `backend/` Express REST API |
| Database: MongoDB | MongoDB Atlas database `yatara-mobile` with Mongoose |
| Authentication | Register, login, bcrypt password hashing, JWT bearer auth |
| Protected routes | Backend auth middleware and frontend route guards |
| Hosted backend | Render/Railway deployment guide and `backend/render.yaml` |
| No localhost final demo | Frontend uses `EXPO_PUBLIC_API_URL` for hosted API |
| File upload | Expo ImagePicker + Multer uploads |
| No hardcoded data | Entity lists load from the Express API |

## GitHub Folder Requirement

The guideline says the GitHub repo must include:

- `frontend`
- `backend`
- proper structure

This project satisfies that requirement:

| Required Folder | Current Folder | Status |
| --- | --- | --- |
| `frontend` | `frontend/` | Complete |
| `backend` | `backend/` | Complete |
| proper structure | `docs/`, `agent/`, root scripts, env examples | Complete |

## Required Documentation Files For ZIP

The LMS ZIP must contain documentation only. Do not include source code in the ZIP.

Required ZIP folder:

```text
SE2020_Group_<GroupNumber>_Submission/
├── Problem_Statement.pdf
├── System_Architecture_Diagram.png
├── Database_Schema_Diagram.png
├── API_Endpoint_Table.pdf
├── Team_Responsibility.pdf
└── README.txt
```

Required ZIP file name:

```text
WDDS01_Group_<GroupNumber>_Submission.zip
```

## Project Files To Export

| Required ZIP File | Source In This Repo | Export Action |
| --- | --- | --- |
| `Problem_Statement.pdf` | `docs/MOBILE-FINAL-REPORT.md` or `docs/MOBILE-CONVERSION-PLAN.md` | Export relevant problem/scope section as PDF |
| `System_Architecture_Diagram.png` | `docs/diagrams/mobile_architecture.html` | Open and export/screenshot as PNG or PDF |
| `Database_Schema_Diagram.png` | `docs/diagrams/mobile_schema.html` | Open and export/screenshot as PNG or PDF |
| `API_Endpoint_Table.pdf` | `docs/MOBILE-API.md` | Export as PDF |
| `Team_Responsibility.pdf` | `docs/MOBILE-TEAM-BREAKDOWN.md` and member docs | Export as PDF |
| `README.txt` | `docs/submission/README.txt` | Fill final values and copy into ZIP |

## README.txt Template

Use:

```text
docs/submission/README.txt
```

Before submission, update:

- `Group Number: XX`
- `Backend URL: https://yatara-ceylon-mobile-app.onrender.com/api`
- `Health Check URL: https://yatara-ceylon-mobile-app.onrender.com/api/health`

## Team Responsibility

| Member | Student ID | Name | Module |
| --- | --- | --- | --- |
| Member 1 | IT24100923 | Nawarathna K.M.G.D.I. | Authentication and Profile |
| Member 2 | IT24100559 | Wasala W.M.S.S.B. | Packages and Content Management |
| Member 3 | IT24102016 | Melisha L.R.L. | Vehicle Fleet Management |
| Member 4 | IT24100220 | Sanujan N. | Booking and Reservation Management |
| Member 5 | IT24102586 | Luxsana S. | Destination Management |
| Member 6 | IT24101070 | Muthubadiwila M.W.H.A. | Supplier / Partner Management |

Detailed member documents are in:

```text
docs/yatara_member_md_files/
```

## Final Submission Checklist

- [ ] GitHub repo link opens publicly.
- [ ] GitHub repo shows `frontend/` and `backend/` folders.
- [ ] Backend is deployed online.
- [ ] Frontend `.env` uses hosted backend URL for final demo.
- [ ] MongoDB Atlas database is `yatara-mobile`.
- [ ] `README.txt` contains group number, members, GitHub URL, and backend URL.
- [ ] ZIP contains documentation only.
- [ ] ZIP does not contain `frontend/`, `backend/`, `node_modules/`, `.env`, or source code.
- [ ] All six members can explain their module for viva.

## Local Verification Commands

Run before final GitHub submission:

```bash
npm run install:all
npm run check
```

Expected result:

- Backend JavaScript syntax check passes.
- Frontend TypeScript check passes.
- Frontend lint passes.
