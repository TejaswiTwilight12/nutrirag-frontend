import { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import PrivacyNotice from './components/PrivacyNotice';
import AllergyWarning from './components/AllergyWarning';
import ProfileForm from './components/ProfileForm';
import PreferencesForm from './components/PreferencesForm';
import DaysSelector from './components/DaysSelector';
import MealPlanResults from './components/MealPlanResults';
import Footer from './components/Footer';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [profile, setProfile] = useState({
    goal: '',
    caloriesTarget: '',
    dietaryStyle: ''
  });
  const [preferences, setPreferences] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [days, setDays] = useState(7);
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProfileChange = (updatedProfile) => {
    try {
      // Validate profile object
      if (!updatedProfile || typeof updatedProfile !== 'object') {
        console.error('Invalid profile data received');
        return;
      }
      
      // Ensure profile has required structure
      const safeProfile = {
        goal: updatedProfile.goal || '',
        caloriesTarget: updatedProfile.caloriesTarget || '',
        dietaryStyle: updatedProfile.dietaryStyle || ''
      };
      
      setProfile(safeProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating your profile. Please try again.');
    }
  };

  const handlePreferencesChange = ({ preferences: prefs, allergies: all }) => {
    try {
      // Validate preferences array
      const safePreferences = Array.isArray(prefs) ? prefs : [];
      
      // Validate allergies string
      const safeAllergies = typeof all === 'string' ? all : '';
      
      setPreferences(safePreferences);
      setAllergies(safeAllergies);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('An error occurred while updating your preferences. Please try again.');
    }
  };

  const handleGenerateMealPlan = async () => {
    try {
      // Validation with specific field messages
      const missingFields = [];
      if (!profile || !profile.goal) missingFields.push('Goal');
      if (!profile || !profile.caloriesTarget) missingFields.push('Daily Calories Target');
      if (!profile || !profile.dietaryStyle) missingFields.push('Dietary Style');
      
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Validate calories target is within range
      const calories = parseInt(profile.caloriesTarget);
      if (isNaN(calories) || calories < 1000 || calories > 5000) {
        setError('Daily calories target must be between 1000 and 5000');
        return;
      }

      // Validate days
      const numDays = parseInt(days) || 7;
      if (isNaN(numDays) || numDays < 1 || numDays > 30) {
        setError('Number of days must be between 1 and 30');
        return;
      }

      setLoading(true);
      setError(null);
      setMealPlan(null);

      // Safely parse and sanitize allergies
      let allergiesArray = [];
      try {
        if (allergies && typeof allergies === 'string') {
          // Limit length and sanitize
          const maxLength = 500;
          const sanitized = allergies.slice(0, maxLength);
          allergiesArray = sanitized
            .split(',')
            .map(a => a.trim().slice(0, 100)) // Limit each allergy to 100 chars
            .filter(a => a.length > 0)
            .slice(0, 50); // Limit to 50 allergies
        } else if (Array.isArray(allergies)) {
          allergiesArray = allergies
            .slice(0, 50)
            .filter(a => typeof a === 'string')
            .map(a => a.trim().slice(0, 100));
        }
      } catch (parseError) {
        console.warn('Error parsing allergies:', parseError);
        allergiesArray = [];
      }

      // Validate API URL
      const apiUrl = API_BASE_URL || 'http://localhost:3000';
      if (!apiUrl || typeof apiUrl !== 'string') {
        throw new Error('Invalid API URL configuration');
      }

      // Safely stringify request body with size check
      let requestBody;
      try {
        const requestData = {
          profile: profile || {},
          preferences: Array.isArray(preferences) ? preferences.slice(0, 20) : [],
          allergies: allergiesArray,
          days: numDays
        };
        
        requestBody = JSON.stringify(requestData);
        
        // Check payload size (10KB limit)
        if (requestBody.length > 10 * 1024) {
          throw new Error('Request data too large. Please reduce input size.');
        }
      } catch (stringifyError) {
        throw new Error('Failed to prepare request data. Please check your input.');
      }

      const response = await fetch(`${apiUrl}/api/mealplan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        let errorMessage = `Failed to generate meal plan (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        } catch {
          // If response is not JSON, try text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Use default error message
          }
        }
        throw new Error(errorMessage);
      }

      // Parse response with error handling
      let data;
      try {
        const responseText = await response.text();
        if (!responseText) {
          throw new Error('Empty response from server');
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid response format from server. Please try again.');
      }
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid meal plan data received from server');
      }
      
      if (!data.meals || !Array.isArray(data.meals)) {
        throw new Error('Meal plan data is missing required meals array');
      }
      
      // Validate each meal has required structure
      const validatedMeals = data.meals.map((day, index) => {
        if (!day || typeof day !== 'object') {
          console.warn(`Invalid day data at index ${index}`);
          return {
            day: index + 1,
            breakfast: null,
            lunch: null,
            dinner: null,
            snacks: []
          };
        }
        return {
          day: day.day || index + 1,
          breakfast: day.breakfast || null,
          lunch: day.lunch || null,
          dinner: day.dinner || null,
          snacks: Array.isArray(day.snacks) ? day.snacks : []
        };
      });
      
      const validatedMealPlan = {
        days: data.days || validatedMeals.length,
        meals: validatedMeals,
        summary: data.summary || {
          totalCalories: 0,
          averageDailyCalories: 0
        }
      };
      
      setMealPlan(validatedMealPlan);
    } catch (err) {
      // Handle network errors and API errors
      let errorMessage = 'An error occurred while generating your meal plan';
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please make sure the backend is running on http://localhost:3000';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Meal plan generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = profile.goal && profile.caloriesTarget && profile.dietaryStyle;

  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main className="main-content">
          <div className="container">
            <Disclaimer />
            <PrivacyNotice />
            <AllergyWarning allergies={allergies} />
            
            <div className="form-section">
              <ProfileForm profile={profile} onChange={handleProfileChange} />
              <PreferencesForm 
                preferences={preferences} 
                allergies={allergies}
                onChange={handlePreferencesChange} 
              />
              <DaysSelector 
                days={days} 
                onChange={(newDays) => {
                  try {
                    const numDays = parseInt(newDays);
                    if (!isNaN(numDays) && numDays >= 3 && numDays <= 7) {
                      setDays(numDays);
                    } else {
                      console.warn('Invalid days value:', newDays);
                    }
                  } catch (error) {
                    console.error('Error updating days:', error);
                    setError('An error occurred while updating meal plan duration.');
                  }
                }} 
              />
              
              <div className="submit-section">
                <button 
                  className="generate-button"
                  onClick={handleGenerateMealPlan}
                  disabled={!isFormValid || loading}
                  type="button"
                >
                  {loading ? 'Generating...' : 'Generate Meal Plan'}
                </button>
              </div>
            </div>

            <MealPlanResults 
              mealPlan={mealPlan} 
              loading={loading} 
              error={error} 
            />
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
