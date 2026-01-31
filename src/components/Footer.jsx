import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          <strong>Responsible AI:</strong> This application uses a knowledge base to generate meal plans. 
          It does not use machine learning models or store personal data. All recommendations are based on 
          filtered food data and should be verified with healthcare professionals.
        </p>
        <p className="footer-text">
          <strong>No Data Storage:</strong> Your information is processed in real-time and immediately discarded. 
          We do not collect, store, or share any personal data.
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} NutriRAG - For informational purposes only
        </p>
      </div>
    </footer>
  );
}

export default Footer;
