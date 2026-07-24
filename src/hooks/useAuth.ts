import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useAuth(activeDialog: string | null, setActiveDialog: (val: string | null) => void) {
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string; isAdmin: boolean } | null>(null);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.email) {
                setCurrentUser({
                    username: 'Utilisateur',
                    email: data.email,
                    isAdmin: false
                });
                setShowLanding(false);
            } else {
                localStorage.removeItem('token');
            }
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Assuming simple login without password if needed, or keeping it as is
    // For now, let's keep it simple as requested previously
    setCurrentUser({
        username: 'Utilisateur',
        email: 'user@example.com',
        isAdmin: false
    });
    setShowLanding(false);
    toast.success("Connexion réussie !");
  };

  const handleEmailLogIn = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        setCurrentUser({
            username: 'Utilisateur',
            email: email,
            isAdmin: false
        });
        setShowLanding(false);
        toast.success("Connexion réussie !");
    } else {
        const data = await response.json();
        toast.error(`Erreur de connexion : ${data.error || 'Erreur inconnue'}`);
    }
  };

  const handleEmailSignUp = async (email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        toast.success("Compte créé avec succès !");
        setAuthMode('login');
    } else {
        toast.error("Erreur lors de la création du compte");
    }
  };

  const handleLogOut = async () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setShowLanding(true);
    setActiveDialog(null);
  };
    
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [profileName, setProfileName] = useState(() => localStorage.getItem('profile_name') || 'Utilisateur');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('profile_email') || 'user@example.com');
  const [editName, setEditName] = useState(profileName);
  const [editEmail, setEditEmail] = useState(profileEmail);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailSignUp(authEmail, authPassword);
  };
  const handleSaveProfile = (e: React.FormEvent) => { e.preventDefault(); toast.success("Profil mis à jour !"); setActiveDialog(null); };

  return {
    currentUser,
    showLanding,
    authMode, setAuthMode,
    authUsername, setAuthUsername,
    authEmail, setAuthEmail,
    authPassword, setAuthPassword,
    userIp: '192.168.1.1',
    profileName, profileEmail,
    editName, setEditName,
    editEmail, setEditEmail,
    handleSignUp,
    handleLogIn,
    handleEmailLogIn,
    handleEmailSignUp,
    handleLogOut,
    handleSaveProfile
  };
}
