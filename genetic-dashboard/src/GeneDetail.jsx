import { useParams, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageBackground from './PageBackground';

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

function GeneDetail({ genes }) {
  const { id } = useParams();
  const gene = genes.find((g) => g.id === id);

  if (!gene) {
    return (
        <PageBackground>
      <div className="App">
        <p>Gene not found.</p>
        <Link to="/">← Back to dashboard</Link>
      </div>
      </PageBackground>
    );
  }
  const style = getBiotypeStyle(gene.biotype);
  const length = Math.abs(gene.end - gene.start);
  const ensemblUrl = `https://www.ensembl.org/Homo_sapiens/Gene/Summary?g=${gene.gene_id}`;

  return (
    <PageBackground>
    <div className="App">
      <Sidebar />
      <Link to="/" className="back-link">← Back to dashboard</Link>

      <h1>
        {style.icon} {gene.external_name || gene.gene_id}
      </h1>
      <p className="detail-subtitle" style={{ color: style.color }}>
        {style.label}
      </p>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Ensembl Gene ID</span>
          <span className="detail-value">{gene.gene_id}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Length</span>
          <span className="detail-value">{length.toLocaleString()} bp</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Strand</span>
          <span className="detail-value">
            {gene.strand === 1 ? 'Forward (+)' : 'Reverse (-)'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Chromosome Position</span>
          <span className="detail-value">
            chr{gene.seq_region_name}:{gene.start.toLocaleString()}–{gene.end.toLocaleString()}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Source</span>
          <span className="detail-value">{gene.source}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Canonical Transcript</span>
          <span className="detail-value">{gene.canonical_transcript || 'N/A'}</span>
        </div>
      </div>
      {gene.description && (
        <div className="detail-description">
          <h3>Description</h3>
          <p>{gene.description}</p>
        </div>
      )}

      <a href={ensemblUrl} target="_blank" rel="noopener noreferrer" className="ensembl-link">
        View full record on Ensembl.org ↗
      </a>
    </div>
    </PageBackground>
  );
}

export default GeneDetail;


