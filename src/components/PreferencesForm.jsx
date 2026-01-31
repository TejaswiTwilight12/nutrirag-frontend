import { useState, useEffect } from 'react';
import './PreferencesForm.css';

const PREFERENCE_OPTIONS = [
  'Low Carb',
  'High Protein',
  'Low Fat',
  'Gluten Free',
  'Dairy Free',
  'Nut Free',
  'Soy Free',
  'High Fiber',
  'Low Sodium',
  'Organic Preferred'
];

function PreferencesForm({ preferences, allergies, onChange }) {
  // Safely initialize state
  const getSafePreferences = (prefs) => {
    return Array.isArray(prefs) ? [...prefs] : [];
  };

  const getSafeAllergies = (all) => {
    return typeof all === 'string' ? all : '';
  };

  const [selectedPreferences, setSelectedPreferences] = useState(() => 
    getSafePreferences(preferences)
  );
  const [localAllergies, setLocalAllergies] = useState(() => 
    getSafeAllergies(allergies)
  );

  // Update state when props change
  useEffect(() => {
    setSelectedPreferences(getSafePreferences(preferences));
  }, [preferences]);

  useEffect(() => {
    setLocalAllergies(getSafeAllergies(allergies));
  }, [allergies]);

  const handlePreferenceToggle = (pref) => {
    try {
      // Validate preference option
      if (!pref || typeof pref !== 'string') {
        console.error('Invalid preference option:', pref);
        return;
      }

      if (!PREFERENCE_OPTIONS.includes(pref)) {
        console.warn('Unknown preference option:', pref);
        return;
      }

      const updated = selectedPreferences.includes(pref)
        ? selectedPreferences.filter(p => p !== pref)
        : [...selectedPreferences, pref];
      
      setSelectedPreferences(updated);
      
      // Safely call onChange
      if (typeof onChange === 'function') {
        onChange({ 
          preferences: updated, 
          allergies: localAllergies 
        });
      } else {
        console.warn('onChange is not a function');
      }
    } catch (error) {
      console.error('Error toggling preference:', error);
    }
  };

  const handleAllergiesChange = (value) => {
    try {
      // Validate value
      const safeValue = typeof value === 'string' ? value : String(value || '');
      
      setLocalAllergies(safeValue);
      
      // Safely call onChange
      if (typeof onChange === 'function') {
        onChange({ 
          preferences: selectedPreferences, 
          allergies: safeValue 
        });
      } else {
        console.warn('onChange is not a function');
      }
    } catch (error) {
      console.error('Error updating allergies:', error);
    }
  };

  return (
    <div className="preferences-form">
      <h2 className="form-section-title">Preferences & Allergies</h2>
      
      <div className="form-group">
        <label className="form-label">Dietary Preferences</label>
        <div className="preferences-grid">
          {PREFERENCE_OPTIONS.map((pref) => (
            <label key={pref} className="preference-checkbox">
              <input
                type="checkbox"
                checked={selectedPreferences.includes(pref)}
                onChange={() => {
                  try {
                    handlePreferenceToggle(pref);
                  } catch (error) {
                    console.error('Error in preference checkbox handler:', error);
                  }
                }}
              />
              <span className="checkbox-label">{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="allergies" className="form-label">
          Allergies (comma-separated)
        </label>
        <input
          id="allergies"
          type="text"
          className="form-input"
          placeholder="e.g., peanuts, shellfish, eggs"
          value={localAllergies}
          onChange={(e) => {
            try {
              handleAllergiesChange(e?.target?.value || '');
            } catch (error) {
              console.error('Error in allergies input handler:', error);
            }
          }}
        />
        <small className="form-hint">
          List any food allergies or intolerances
        </small>
      </div>
    </div>
  );
}

export default PreferencesForm;
