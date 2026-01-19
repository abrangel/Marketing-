import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthState from './context/auth/AuthState.jsx';
import LeadState from './context/lead/LeadState.jsx';
import EmailState from './context/email/EmailState.jsx';
import MessageState from './context/message/MessageState.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthState>
      <LeadState>
        <EmailState>
          <MessageState>
            <App />
          </MessageState>
        </EmailState>
      </LeadState>
    </AuthState>,
)
