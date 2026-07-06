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
  const [genes, setGenes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBiotype, setSelectedBiotype] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAbout, setShowabout] = useState(false);
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
  const filteredGenes = genes.filter((gene) => {
    const name = gene.external_name  || gene.gene_id;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBiotype = selectedBiotype === 'all' || gene.biotype === selectedBiotype;
    return matchesSearch && matchesBiotype;
});
  
  const uniqueBiotypes = [...new Set(genes.map((gene) => gene.biotype))];
  const totalCount = filteredGenes.length;

  const averageLength = 
  filteredGenes.length >0
  ? Math.round(
    filteredGenes.reduce((sum, gene) => sum +(gene.end -gene.end - gene.start), 0)/ filteredGenes.length
  )
  :0;
  // most common biotype
  const biotypeCounts = filteredGenes.reduce((counts, gene) => {
    counts[gene.biotype] = (counts[gene.biotype] || 0) +1;
    return counts;
  }, {});
  const mostCommonBiotype = 
  Object.keys(biotypeCounts).length > 0
  ? Object.entries(biotypeCounts).sort((a,b) => b[1] - a[1])[0][0] : 'N/A'
  return (
    <div className="page-bg"
      style={{
        backgroundImage:`linear-gradient(rgba(10, 10, 20, 0.85), rgba(10, 10,20, 0.85)),url(${dnaBackground})`,
      }}
      >
        <div className="App">
      <h1> Chromosom 7 Gene Dashboard</h1>
      <button className="about-button" onClick={() => setShowabout(true)}>
        About this dashboard
      </button>
      <p>Showing {filteredGenes.length} of {genes.length} genes.</p>
      <div className="stats">
        <div className="stat-card">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">Genes Shown</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{averageLength.toLocaleString()} bp</span>
          <span className="stat-label">Avg. Gene Length</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{getBiotypeStyle(mostCommonBiotype).icon} {getBiotypeStyle(mostCommonBiotype).label}</span>
          <span className="stat-label">Most Common Type</span>
        </div>
      </div>
      <input 
      type="text"
      placeholder="Search By Gene name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={selectedBiotype}
        onChange={(e) => setSelectedBiotype(e.target.value)}      
      >
       <option value="all">All types</option>
          {uniqueBiotypes.map((biotype) => (
       <option key={biotype} value={biotype}>
        {getBiotypeStyle(biotype).label}
       </option>
        ))}
      </select>
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
          {filteredGenes.map((gene)=>{
            const style = getBiotypeStyle(gene.biotype);
            return(
            <tr key={gene.id}>
              <td>{gene.external_name || gene.gene_id}</td>
              <td>
                <span style={{ color: style.color }}>
                  {style.icon} {style.label}
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
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowabout(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <h2>About This Dashboard</h2>
      <p>
        This dashboard explores genes located on human chromosome 7,
        pulled live from the Ensembl genome database. Each row represents
        one gene — its symbol, biological type, length in base pairs, and
        which DNA strand it's found on.
      </p>
      <p>
        Use the search box to find a gene by name, and the dropdown to
        narrow results down to a specific gene type. The stats above the
        table update live to reflect whatever's currently visible.
      </p>
      <button onClick={() => setShowAbout(false)}>Close</button>
    </div>
  </div>
)}
    </div>
  )
}

export default App
