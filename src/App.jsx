import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Presentation from './pages/Presentation';
import STP1Detail from './pages/STP1Detail';
import STP2Detail from './pages/STP2Detail';
import STP3Detail from './pages/STP3Detail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/stp1" element={<STP1Detail />} />
        <Route path="/stp2" element={<STP2Detail />} />
        <Route path="/stp3" element={<STP3Detail />} />
      </Routes>
    </Router>
  );
}
