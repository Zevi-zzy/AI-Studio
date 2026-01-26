import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import HomePage from '@/pages/HomePage';
import InspirationPage from '@/pages/InspirationPage';
import CreatePage from '@/pages/CreatePage';
import MaterialsPage from '@/pages/MaterialsPage';
import ProfilePage from '@/pages/ProfilePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="inspiration" element={<InspirationPage />} />
          <Route path="create" element={<CreatePage />} />
          <Route path="create/:id" element={<CreatePage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
