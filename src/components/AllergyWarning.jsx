import './AllergyWarning.css';

function AllergyWarning({ allergies }) {
  if (!allergies || allergies.trim().length === 0) {
    return null;
  }

  return (
    <div className="allergy-warning">
      <div className="warning-icon">🚨</div>
      <div className="warning-content">
        <strong>Important Allergy Notice:</strong> Always verify allergen information with food labels, 
        restaurant staff, and manufacturers. This tool filters based on available data but cannot guarantee 
        complete allergen information. If you have severe allergies, consult with a healthcare professional 
        before following any meal plan.
      </div>
    </div>
  );
}

export default AllergyWarning;
