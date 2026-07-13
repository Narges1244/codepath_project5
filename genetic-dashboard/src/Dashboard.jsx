import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBackground from './PageBackground';
import Sidebar from './Sidebar';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
  } from 'recharts';

const BIOTYPE_STYLES = {
  protein_coding: { icon: '🧬', color: '#2563eb', label: 'Protein Coding' },
  lncRNA: { icon: '📜', color: '#7c3aed', label: 'lncRNA' },
  processed_pseudogene: { icon: '👻', color: '#9ca3af', label: 'Pseudogene' },
  unprocessed_pseudogene: { icon: '👻', color: '#9ca3af', label: 'Pseudogene' },
  snRNA: { icon: '⚙️', color: '#059669', label: 'snRNA' },
  misc_RNA: { icon: '⚙️', color: '#059669', label: 'misc RNA' },
  miRNA: { icon: '🔬', color: '#dc2626', label: 'miRNA' },
};
const DEFAULT_STYLE = { icon: '🧫', color: '#374151', label: 'Other' };

function getBiotypeStyle(biotype) {
  return BIOTYPE_STYLES[biotype] || DEFAULT_STYLE;
}

function Dashboard({ genes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBiotype, setSelectedBiotype] = useState('all');
  const [showAbout, setShowAbout] = useState(false);

  const filteredGenes = genes.filter((gene) => {
    const name = gene.external_name || gene.gene_id;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBiotype = selectedBiotype === 'all' || gene.biotype === selectedBiotype;
    return matchesSearch && matchesBiotype;
  });

  const uniqueBiotypes = [...new Set(genes.map((gene) => gene.biotype))];

  const totalCount = filteredGenes.length;

  const averageLength =
    filteredGenes.length > 0
      ? Math.round(
          filteredGenes.reduce((sum, gene) => sum + Math.abs(gene.end - gene.start), 0) /
            filteredGenes.length
        )
      : 0;

  const biotypeCounts = filteredGenes.reduce((counts, gene) => {
    counts[gene.biotype] = (counts[gene.biotype] || 0) + 1;
    return counts;
  }, {});

  const mostCommonBiotype =
    Object.keys(biotypeCounts).length > 0
      ? Object.entries(biotypeCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A';

  // Chart 1 data: count of genes per biotype
const biotypeChartData = Object.entries(biotypeCounts).map(([biotype, count]) => ({
    name: getBiotypeStyle(biotype).label,
    count,
    color: getBiotypeStyle(biotype).color,
  }));
  
  // Chart 2 data: top 10 longest genes
  const longestGenes = [...genes]
    .sort((a, b) => Math.abs(b.end - b.start) - Math.abs(a.end - a.start))
    .slice(0, 10)
    .map((gene) => ({
      name: gene.external_name || gene.gene_id,
      length: Math.abs(gene.end - gene.start),
    }));    

  return (
        <PageBackground>
      <div className="App">
        <Sidebar/>
        <h1>Chromosome 7 Gene Dashboard</h1>
       

        <p>Showing {totalCount} of {genes.length} genes.</p>

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
            <span className="stat-value">
              {getBiotypeStyle(mostCommonBiotype).icon} {getBiotypeStyle(mostCommonBiotype).label}
            </span>
            <span className="stat-label">Most Common Type</span>
          </div>
        </div>
        <div className="charts">
            <div className="chart-card">
                <h3>Genes by Type</h3>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={biotypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" tick={{ fill: '#f1f1f1', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#f1f1f1' }} allowDecimals={false} />
                    <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: 'none', color: '#f1f1f1' }}
                    />
                    <Bar dataKey="count">
                    {biotypeChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <h3>Top 10 Longest Genes</h3>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={longestGenes} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" tick={{ fill: '#f1f1f1' }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#f1f1f1', fontSize: 12 }} width={90} />
                    <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: 'none', color: '#f1f1f1' }}
                    />
                    <Bar dataKey="length" fill="#7c3aed" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>

        <input
          type="text"
          placeholder="Search By Gene name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedBiotype} onChange={(e) => setSelectedBiotype(e.target.value)}>
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
            {filteredGenes.map((gene) => {
              const style = getBiotypeStyle(gene.biotype);
              return (
                <tr key={gene.id}>
                  <td>
                    <Link to={`/gene/${gene.id}`} className="gene-link">
                      {gene.external_name || gene.gene_id}
                    </Link>
                  </td>
                  <td>
                    <span style={{ color: style.color }}>
                      {style.icon} {style.label}
                    </span>
                  </td>
                  <td>{Math.abs(gene.end - gene.start).toLocaleString()}</td>
                  <td>{gene.strand === 1 ? 'Forward (+)' : 'Reverse (-)'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        
          
      </div>
      </PageBackground>
  
  );
}

export default Dashboard;