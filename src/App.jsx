import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analysis from './pages/Analysis';
import SavingPlan from './pages/SavingPlan';
import FinBot from './pages/FinBot';
import TimeMachine from './pages/TimeMachine';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="saving-plan" element={<SavingPlan />} />
          <Route path="finbot" element={<FinBot />} />
          <Route path="time-machine" element={<TimeMachine />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
