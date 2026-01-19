import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import EmailTemplates from './components/EmailTemplates';
import EmailCampaigns from './components/EmailCampaigns';
import SocialMedia from './components/SocialMedia';
import Messaging from './components/Messaging';
import Calls from './components/Calls';
import EmailTemplatePage from './components/EmailTemplatePage';
import EmailCampaignPage from './components/EmailCampaignPage';
import MainLayout from './layout/MainLayout';
import GoogleVoiceChat from './components/GoogleVoiceChat';

function App() {
  console.log('App: Renderizado');
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas */}
        <Route element={<PrivateRoute />}>
            
            {/* AQUÍ ESTÁ LA CORRECCIÓN:
               MainLayout envuelve a las rutas internas.
               React Router inyectará el componente correspondiente dentro del <Outlet /> de MainLayout
            */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/email/templates" element={<EmailTemplatePage />} />
                <Route path="/email/campaigns" element={<EmailCampaignPage />} />
                <Route path="/social" element={<SocialMedia />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/chat" element={<GoogleVoiceChat />} />
                <Route path="/calls" element={<Calls />} />
            </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;