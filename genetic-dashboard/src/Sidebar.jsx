import {useState} from 'react';
import {Link} from 'react-router-dom';

function Sidebar() {
    const [showAbout, setShowAbout] = useState(false);

    return (
        <div className="sidebar">
            <Link to="/" className="sidebar-title">
                Chromosome 7 Explorer
            </Link>
            <button className="sidebar-title" onClick={() => setShowAbout(true)}>
                About
            </button>
            {showAbout && (
                <div className="modal-overlay" onClick={() => setShowAbout(false)}>
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
                    narrow results down to a specific gene type. Click any gene name
                    to see more detail about it.
                    </p>
                    <button onClick={() => setShowAbout(false)}>Close</button>
                </div>
                </div>
            )}
            </div>
        );
        }

export default Sidebar;
       
    

