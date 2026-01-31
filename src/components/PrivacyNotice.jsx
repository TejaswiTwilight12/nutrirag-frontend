import './PrivacyNotice.css';

function PrivacyNotice() {
  return (
    <div className="privacy-notice">
      <div className="privacy-icon">🔒</div>
      <div className="privacy-content">
        <strong>Privacy Protected:</strong> Your information is processed in real-time and never stored. 
        No data is saved, logged, or shared.
      </div>
    </div>
  );
}

export default PrivacyNotice;
