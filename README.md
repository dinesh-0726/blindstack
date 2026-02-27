# SkillSphere — Peer Learning & Mentor Matching Platform

Full-stack web application:
- **Frontend**: Next.js 14 (React)
- **Backend**: Spring Boot 3.2
- **Database**: SQLite (via Hibernate Community Dialects)

---

## 📁 Project Structure

```
skillsphere/
├── backend/               ← Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/skillsphere/
│       ├── SkillSphereApplication.java
│       ├── WebConfig.java
│       ├── entity/
│       │   ├── User.java
│       │   ├── Skill.java
│       │   ├── SkillOffered.java
│       │   ├── SkillNeeded.java
│       │   └── LearningRequest.java
│       ├── repository/
│       │   └── Repositories.java
│       ├── service/
│       │   └── MatchingService.java
│       ├── controller/
│       │   ├── UserController.java
│       │   ├── SkillController.java
│       │   ├── SkillOfferedController.java
│       │   ├── SkillNeededController.java
│       │   ├── MatchController.java
│       │   └── LearningRequestController.java
│       └── dto/
│           └── MatchResult.java
│
└── frontend/              ← Next.js
    ├── package.json
    ├── next.config.js
    ├── lib/
    │   └── api.js
    ├── styles/
    │   └── globals.css
    ├── components/
    │   ├── Layout.jsx
    │   └── UI.jsx
    └── pages/
        ├── _app.js
        ├── index.js        ← Dashboard
        ├── users.js
        ├── skills.js
        ├── offered.js
        ├── needed.js
        ├── match.js
        └── requests.js
```

---

## 🚀 Setup & Run

### 1. Start the Backend

**Prerequisites**: Java 17+, Maven

```bash
cd backend
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.
SQLite database file (`skillsphere.db`) is auto-created in the working directory.

### 2. Start the Frontend

**Prerequisites**: Node.js 18+

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

---

## 🔧 API Reference

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | /users                      | Create user                         |
| GET    | /users                      | List all users                      |
| POST   | /skills                     | Create skill                        |
| GET    | /skills                     | List all skills                     |
| POST   | /skills/offered             | Add offered skill (with level)      |
| GET    | /skills/offered/{userId}    | Get skills offered by user          |
| POST   | /skills/needed              | Add needed skill                    |
| GET    | /skills/needed/{userId}     | Get skills needed by user           |
| GET    | /match/{userId}             | Get mentor matches for user         |
| POST   | /requests                   | Send a learning request             |
| GET    | /requests/{userId}          | Get all requests for user           |
| PUT    | /requests/{id}              | Update request status               |

---

## 🧠 Matching Logic

`GET /match/{userId}`:
1. Fetch all `SkillNeeded` records for the user.
2. For each needed skill, find all `SkillOffered` entries with matching `skill_id`.
3. Exclude the requesting user from results.
4. Sort by proficiency: `ADVANCED → INTERMEDIATE → BEGINNER`.
5. Return list of `MatchResult` (mentor, skill, level).

---

## 📊 Database Schema

Auto-created by Hibernate on first run:

```sql
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE);
CREATE TABLE skills (id INTEGER PRIMARY KEY, name TEXT UNIQUE);
CREATE TABLE skill_offered (id INTEGER PRIMARY KEY, user_id INT, skill_id INT, level TEXT);
CREATE TABLE skill_needed (id INTEGER PRIMARY KEY, user_id INT, skill_id INT);
CREATE TABLE learning_request (id INTEGER PRIMARY KEY, learner_id INT, mentor_id INT, skill_id INT, status TEXT);
```

---

## ✅ MVP Checklist

- [x] Create users
- [x] Create skills library
- [x] Add skills offered (with level: BEGINNER / INTERMEDIATE / ADVANCED)
- [x] Add skills needed
- [x] Matching API (sorted by level)
- [x] Send learning request
- [x] Accept / Reject request
- [x] CORS configured for localhost:3000
- [x] SQLite auto-schema creation

---

## 💡 Tips

- The `skillsphere.db` file is created in whichever directory you run `mvn spring-boot:run` from.
- CORS is set to allow `http://localhost:3000`. Change `WebConfig.java` for production.
- Lombok is used in entities — make sure your IDE has the Lombok plugin installed.
