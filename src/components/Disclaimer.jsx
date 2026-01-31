import { useState } from 'react';
import './Disclaimer.css';

function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="disclaimer">
      <div className="disclaimer-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="disclaimer-icon">⚠️</span>
        <span className="disclaimer-title">Important Information & Limitations</span>
        <span className="disclaimer-toggle">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="disclaimer-content">
          <div className="disclaimer-section">
            <h4>⚠️ Medical Disclaimer</h4>
            <p>
              <strong>This meal plan is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</strong> 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary needs.
            </p>
          </div>

          <div className="disclaimer-section">
            <h4>🔒 Privacy & Data</h4>
            <p>
              <strong>Your data is not stored.</strong> All information you provide (goals, preferences, allergies) is processed in real-time and immediately discarded. 
              No personal data is saved, logged, or shared with third parties. Your privacy is protected.
            </p>
          </div>

          <div className="disclaimer-section">
            <h4>📋 Limitations</h4>
            <ul>
              <li>Meal plans are generated from a limited knowledge base and may not include all available foods</li>
              <li>Nutritional values are approximate and may vary based on preparation methods and brands</li>
              <li>Individual caloric needs may differ based on age, activity level, metabolism, and health conditions</li>
              <li>This tool does not account for specific medical conditions, medications, or nutritional deficiencies</li>
              <li>Always verify allergen information with food labels and restaurant staff</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h4>✅ Best Practices</h4>
            <ul>
              <li>Consult with a registered dietitian or nutritionist for personalized meal planning</li>
              <li>Double-check all allergen information, especially for severe allergies</li>
              <li>Adjust portion sizes based on your individual needs and activity level</li>
              <li>Monitor your body's response and adjust as needed</li>
              <li>This tool is a starting point, not a definitive meal plan</li>
            </ul>
          </div>

          <div className="disclaimer-section">
            <h4>🚫 Not Suitable For</h4>
            <p>
              This tool is not suitable for individuals with:
            </p>
            <ul>
              <li>Severe food allergies or anaphylaxis risk</li>
              <li>Complex medical conditions requiring specialized diets</li>
              <li>Eating disorders or disordered eating patterns</li>
              <li>Pregnancy or breastfeeding without medical supervision</li>
              <li>Children under 18 without parental and medical supervision</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Disclaimer;
