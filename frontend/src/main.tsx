import { createRoot } from 'react-dom/client'
import Root from './pages/Root.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';

createRoot(document.getElementById("root")!).render(<AuthProvider><Root /></AuthProvider>);
