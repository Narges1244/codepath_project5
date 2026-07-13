import dnaBackground from './assets/genetics-1783102283624-9142.jpg'

function PageBackground({ children }) {
    return (
      <div
        className="page-bg"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 10, 20, 0.85), rgba(10, 10, 20, 0.85)), url(${dnaBackground})`,
        }}
      >
        {children}
      </div>
    );
  }
  
  export default PageBackground;