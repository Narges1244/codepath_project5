import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import GeneDetail from './GeneDetail';
import './App.css';

const GENE_REGION = '7:140400000-141800000';

function App() {
  const [genes, setGenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGenes() {
      try {
        const response = await fetch(
          `https://rest.ensembl.org/overlap/region/human/${GENE_REGION}?feature=gene;content-type=application/json`
        );
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        setGenes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGenes();
  }, []);

  if (loading) return <p>Loading genes...</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
    <Routes>
      <Route path="/" element={<Dashboard genes={genes} />} />
      <Route path="/gene/:id" element={<GeneDetail genes={genes} />} />
    </Routes>
  );
}

export default App;