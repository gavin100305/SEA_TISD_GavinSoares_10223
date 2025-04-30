🌐 TISD Website: Tracking Innovation & Sustainable Development
Full Stack Web Platform for Project Documentation, Collaboration & SDG Monitoring
***

Introduction
***
 
The TISD (Tracking Innovation & Sustainable Development) Website is a web-based platform built as a part of our Full Stack Development course at Fr. Conceicao Rodrigues College of Engineering (Computer Engineering, Sem 4). It is designed to:

* Systematically track student projects across departments and academic years

* Promote SDG alignment, project visibility, and innovation

* Facilitate faculty and NGO mentorships through intelligent matching

* Support collaboration among students, faculty, NGOs, and industry mentors

* Provide real-time progress monitoring and institutional insights

 ---


🎥 Demo and PPT
---
👉 [Include your video demo link here]

👉 [Download PPT Presentation](https://drive.google.com/file/d/1m1CsQIu3UkefCNPSk1NJn_JBPbWSdz6P/view?usp=drive_link)

***

Features
***
👉1. Viewers (Public, NGOs, Industry Experts)
---
* Explore academic projects categorized by:



  * Department


  * Academic year


  * SDG goals


* View project details, mentors, student teams, and collaborators


* Filter projects by SDG, department, project status, etc.


* Add comments/testimonials on projects


* Express interest in mentoring or collaborating
---

👉2. Students (Project Teams / Innovators)
---
* Create & manage personal or group projects


* Upload:


 *  Descriptions, objectives, deliverables


  * Reports, PPTs, demo videos


* Map projects to relevant SDGs


* Connect with faculty mentors and external collaborators


* Track progress, receive mentor feedback


* Use meeting scheduler to organize check-ins


* Collaborate with peers using the collaborator connect system


* Receive automated reminders and mentor updates


* View project analytics, SDG contribution, and performance insights


* Full search and filter support across platform
  ---

👉3. Faculty (Project Guides / TISD Coordinators)
---
* Add, review, and mentor student projects


* Map projects to relevant SDGs and academic objectives


* Connect with NGOs/Industry Experts for real-world guidance


* View collaborator activities with their mentees


* Send feedback or reminders via email


* Participate in scheduled meetings with students and collaborators


👉4. Admins (College Moderators / Incubation Cell)
---
* Approve, edit, and manage:


  * Projects


 * Users (students, faculty, collaborators)


 * NGOs/industry collaborators


* Generate advanced reports using Gemini API


 * SDG impact charts


 * Department-wise analytics


 * Student participation trends


* View charts & data visualizations using integrated data science tools


* Monitor registered users and their activities


* Moderate testimonials/comments


* View meetings, track mentor-student-collaborator engagements


* Send platform-wide notifications or updates


👉5. Management (Institutional Heads / Accreditation Bodies)
---
* Get macro-level insights on:


 * Project innovation trends


 * SDG impact


 * Collaboration ratios


* Track mentor-student engagement metrics


* Evaluate departmental performance and sustainability focus


* Download institutional reports for audits and accreditations




 Key Functional Requirements
 ***
* Project Creation & Management
*  SDG Mapping & Impact Analysis
*  Faculty & Collaborator Mentorship
*  NGO/Industry Collaboration Module
*  roup & Personal Project Uploads
*  mart Charts & Reports (via Gemini API)
*  Meeting Scheduler
*  Commenting & Testimonials
*  Student-Collaborator-Mentor Connection
*  Advanced Search and Filters in All Sections
*  Role-Based Access Control
*  Email Notifications (Nodemailer)
*  eal-Time Progress Tracking
---

Technology Stack
---
* Frontend
  * React.js

   * Django Templates (HTML)

  * Tailwind CSS

  * Chart.js

* Backend
  * Django (Python)

  * Gemini API (for data analytics & report generation)

  * GitHub API (for project repository insights)

* Data & Analytics
  * NumPy (numerical computations)

  * pandas (data processing)

* Database
  * SQLite3 (default Django DB)

* Storage & Authentication

  * Django Auth (built-in user authentication)

***

⚙️Installation & Setup
---
* Prerequisites
  * Python ≥ 3.8

  * Node.js ≥ 16 (for React frontend only)

  * SQLite3 (bundled with Django)

  * Gemini API Key

  * GitHub API Token

  * SMTP credentials (configured in Django settings)
 ---

1. Clone the Repository
---

```bash
git clone https://github.com/gavin100305/SEA_TISD_GavinSoares_10223.git
```
--- 

### 2. Backend (Django)
---

```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate      # Linux/Mac
venv\Scripts\activate         # Windows
```

# Install dependencies and run the server
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
python manage.py runserver
```

### 3. Frontend (React)
---

```bash
cd frontend
npm i
npm run dev
```




  


