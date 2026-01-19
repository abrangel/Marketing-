# Lead CRM & Messaging System

A comprehensive CRM and Messaging solution that integrates Email Marketing and SMS capabilities (via Google Voice & TextBee). This project allows users to manage leads, send email campaigns, and handle 2-way SMS conversations directly from the dashboard.

## 🚀 Features

*   **Lead Management:** Add, edit, and organize leads with their contact information.
*   **Email Marketing:**
    *   Create and save Email Templates.
    *   Schedule and send bulk Email Campaigns.
    *   Track campaign status.
*   **SMS Messaging:**
    *   Integration with **Google Voice** (via IMAP/SMTP workarounds) and **TextBee**.
    *   Real-time 2-way SMS chat interface.
    *   Inbox monitoring for incoming SMS.
*   **Authentication:** Secure user registration and login using JWT (JSON Web Tokens).

## 🛠️ Tech Stack

### Backend
*   **Node.js & Express:** server framework.
*   **PostgreSQL:** Relational database for storing users, leads, campaigns, and messages.
*   **Nodemailer & IMAP:** For handling email sending and reading Google Voice email notifications.
*   **TextBee API:** For programmatic SMS sending.
*   **JWT:** For secure authentication.

### Frontend
*   **React (Vite):** Fast and modern frontend framework.
*   **Material UI (MUI):** For a polished and responsive user interface.
*   **React Router:** For navigation.

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v16+ recommended)
*   PostgreSQL installed and running.

### 1. Database Setup
Create a PostgreSQL database (e.g., `lead_crm_db`) and run the schema script located in `backend/lead-crm-schema.sql`.

```bash
# Example using psql
psql -U postgres -d lead_crm_db -f backend/lead-crm-schema.sql
```

### 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configuration:**
    *   Copy the `.env.example` file to a new file named `.env`.
    *   Fill in your actual credentials (Database, Gmail, Google Voice, TextBee).
    ```bash
    cp .env.example .env
    ```

### 3. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Project

You need to run both the backend and frontend servers.

**1. Start Backend:**
```bash
cd backend
npm start
```
*Runs on http://localhost:3001*

**2. Start Frontend:**
```bash
cd frontend
npm run dev
```
*Runs on http://localhost:5173 (or similar)*

## ⚠️ Important Note on Google Voice
This project uses an IMAP polling technique to detect incoming Google Voice SMS messages forwarded to Gmail. Ensure your Google Voice account is configured to forward messages to your Gmail, and that you have enabled "Less Secure Apps" or (preferably) created an **App Password** for your Google account to use in the `.env` file.

## 📄 License
[ISC](https://opensource.org/licenses/ISC)
