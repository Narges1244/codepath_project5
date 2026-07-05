import { useState, useEffect } from 'react'
import dnaBackground from './assets/genetics-1783102283624-9142.jpg';
import './App.css'

const GENE_REGION = '7:140400000-141800000';
const BIOTYPE_STYLES = {
  protein_coding: { icon: '🧬', color: '#2563eb', label: 'Protein Coding' },
  lncRNA: { icon: '📜', color: '#7c3aed', label: 'lncRNA' },
  processed_pseudogene: { icon: '👻', color: '#9ca3af', label: 'Pseudogene' },
  unprocessed_pseudogene: { icon: '👻', color: '#9ca3af', label: 'Pseudogene' },
  snRNA: { icon: '⚙️', color: '#059669', label: 'snRNA' },
  misc_RNA: { icon: '⚙️', color: '#059669', label: 'misc RNA' },
  miRNA: { icon: '🔬', color: '#dc2626', label: 'miRNA' },
};
const DEFAULT_STYLE = { icon: '🧫', color: '#374151', label: 'Other'};

function getBiotypeStyle(biotype){
  return BIOTYPE_STYLES[biotype] || DEFAULT_STYLE;
}
function App() {
  const [genes, setGenes] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect (()=> {
    async function fetchGenes(){
      try{
        const response = await fetch(
          `https://rest.ensembl.org/overlap/region/human/${GENE_REGION}?feature=gene;content-type=application/json`
        );
        if (!response.ok){
          throw new Error(`Request failed with status ${response.status}`);
        }
        const data =await response.json();
        setGenes(data);

      } catch(err){
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGenes();

  },[]);

  return (
    <div className="page-bg"
      style={{
        backgroundImage:`linear-gradient(rgba(10, 10, 20, 0.85), rgba(10, 10,20, 0.85)),url(${dnaBackground})`,
      }}
      >
        <div className="App">
      <h1> Chromosom 7 Gene Dashboard</h1>
      <p>Showing {genes.length} genes.</p>
      <table>
        <thead>
          <tr>
            <th>Gene Name</th>
            <th>Type</th>
            <th>Length (bp)</th>
            <th>Strand</th>
          </tr>
        </thead>
        <tbody>
          {genes.map((gene)=>{
            const style = getBiotypeStyle(gene.biotype);
            return(
            <tr key={gene.id}>
              <td>{gene.external_name || gene.gene_id}</td>
              <td>
                <span style={{ color: style.color }}>
                  {gene.biotype}
                </span>
              </td>
              <td>{(gene.end - gene.start).toLocaleString()}</td>
              <td>{gene.strand === 1 ? 'Forward (+)' : 'Revers (-)'}</td>
            </tr>
            );
        })}
        </tbody>
      </table>

      </div>
    </div>
  )
}

export default App
