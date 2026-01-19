# Lead CRM & Messaging System

Este proyecto es una solución CRM y de mensajería **de código abierto**, diseñada para democratizar el marketing online. Permite a emprendedores y a quienes se inician en el mundo del marketing enviar mensajes de texto y correos electrónicos de forma similar a las grandes empresas, pero de manera accesible. El objetivo principal es ofrecer herramientas para gestionar el marketing digital, incluyendo la posibilidad de realizar llamadas gratuitas (a través de la integración con Google Voice), facilitando así el desarrollo de estrategias online sin grandes inversiones.

¡Tu ayuda es bienvenida! Si deseas contribuir a completar y mejorar este proyecto, tu colaboración sería fantástica.

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
*   ![proyecto](https://github.com/user-attachments/assets/3604f5a6-2aab-4e0d-83f1-6de2a658c56d)


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
*Runs on http://localhost:5173 (o similar)*

## ⚠️ Important Note on Google Voice
This project uses an IMAP polling technique to detect incoming Google Voice SMS messages forwarded to Gmail. Ensure your Google Voice account is configured to forward messages to your Gmail, and that you have enabled "Less Secure Apps" or (preferably) created an **App Password** for your Google account to use in the `.env` file.

## 📄 License
[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)
