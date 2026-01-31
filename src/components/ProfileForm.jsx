import { useState, useEffect } from 'react';
import './ProfileForm.css';

function ProfileForm({ profile, onChange }) {
  // Safely initialize state with defaults
  const getSafeProfile = (prof) => {
    if (!prof || typeof prof !== 'object') {
      return {
        goal: '',
        caloriesTarget: '',
        dietaryStyle: ''
      };
    }
    return {
      goal: prof.goal || '',
      caloriesTarget: prof.caloriesTarget || '',
      dietaryStyle: prof.dietaryStyle || ''
    };
  };

  const [localProfile, setLocalProfile] = useState(() => getSafeProfile(profile));

  // Update local state when prop changes
  useEffect(() => {
    if (profile) {
      setLocalProfile(getSafeProfile(profile));
    }
  }, [profile]);

  const handleChange = (field, value) => {
    try {
      // Validate field name
      const validFields = ['goal', 'caloriesTarget', 'dietaryStyle'];
      if (!validFields.includes(field)) {
        console.error('Invalid field name:', field);
        return;
      }

      // Validate value type
      if (value !== null && value !== undefined && typeof value !== 'string') {
        console.warn('Invalid value type for field:', field, value);
        value = String(value);
      }

      const updated = { 
        ...localProfile, 
        [field]: value || '' 
      };
      
      setLocalProfile(updated);
      
      // Safely call onChange
      if (typeof onChange === 'function') {
        onChange(updated);
      } else {
        console.warn('onChange is not a function');
      }
    } catch (error) {
      console.error('Error handling profile change:', error);
    }
  };

  return (
    <div className="profile-form">
      <h2 className="form-section-title">Profile</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="goal" className="form-label">
            Goal
          </label>
          <select
            id="goal"
            className="form-select"
            value={localProfile.goal}
            onChange={(e) => {
              try {
                handleChange('goal', e?.target?.value || '');
              } catch (error) {
                console.error('Error in goal change handler:', error);
              }
            }}
          >
            <option value="">Select a goal</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="weight-gain">Weight Gain</option>
            <option value="maintenance">Maintain Weight</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="general-health">General Health</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="caloriesTarget" className="form-label">
            Daily Calories Target
          </label>
          <input
            id="caloriesTarget"
            type="number"
            className="form-input"
            placeholder="e.g., 2000"
            value={localProfile.caloriesTarget}
            onChange={(e) => {
              try {
                const value = e?.target?.value || '';
                // Validate numeric input
                if (value === '' || (!isNaN(value) && !isNaN(parseFloat(value)))) {
                  handleChange('caloriesTarget', value);
                }
              } catch (error) {
                console.error('Error in calories target change handler:', error);
              }
            }}
            min="1000"
            max="5000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dietaryStyle" className="form-label">
            Dietary Style
          </label>
          <select
            id="dietaryStyle"
            className="form-select"
            value={localProfile.dietaryStyle}
            onChange={(e) => {
              try {
                handleChange('dietaryStyle', e?.target?.value || '');
              } catch (error) {
                console.error('Error in dietary style change handler:', error);
              }
            }}
          >
            <option value="">Select dietary style</option>
            <option value="omnivore">Omnivore</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="pescatarian">Pescatarian</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="mediterranean">Mediterranean</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;
