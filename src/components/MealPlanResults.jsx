import './MealPlanResults.css';

function MealPlanResults({ mealPlan, loading, error }) {
  // Safely validate props
  const isLoading = loading === true;
  const hasError = error && typeof error === 'string';
  const hasMealPlan = mealPlan && 
                      typeof mealPlan === 'object' && 
                      Array.isArray(mealPlan.meals) && 
                      mealPlan.meals.length > 0;

  if (isLoading) {
    return (
      <div className="meal-plan-results">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Generating your personalized meal plan...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="meal-plan-results">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Generate Meal Plan</h3>
          <p className="error-message">{error}</p>
          <div className="error-help">
            <p>Please try:</p>
            <ul>
              <li>Check that all required fields are filled</li>
              <li>Verify your preferences and allergies are correct</li>
              <li>Ensure the backend server is running</li>
              <li>Try adjusting your dietary restrictions if no foods match</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!hasMealPlan) {
    return (
      <div className="meal-plan-results">
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No Meal Plan Yet</h3>
          <p>Fill out the form above and click "Generate Meal Plan" to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-plan-results">
      <div className="results-header">
        <h2 className="results-title">Your Meal Plan</h2>
        {mealPlan.summary && (
          <div className="summary-badge">
            <span className="summary-label">Avg Daily Calories:</span>
            <span className="summary-value">{mealPlan.summary.averageDailyCalories}</span>
          </div>
        )}
      </div>

      {mealPlan.safetyWarning && (
        <div className="safety-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">
            <strong>Safety Notice:</strong> {mealPlan.safetyWarning}
          </div>
        </div>
      )}

      {mealPlan.disclaimer && (
        <div className="results-disclaimer">
          <p>
            <strong>Note:</strong> {mealPlan.disclaimer.message} 
            {mealPlan.disclaimer.knowledgeBase && ` ${mealPlan.disclaimer.knowledgeBase}`}
          </p>
          {mealPlan.disclaimer.limitations && mealPlan.disclaimer.limitations.length > 0 && (
            <ul className="disclaimer-limitations">
              {mealPlan.disclaimer.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="meals-grid">
        {mealPlan.meals.map((day, index) => {
          try {
            // Safely validate day object
            if (!day || typeof day !== 'object') {
              console.warn(`Invalid day data at index ${index}`);
              return null;
            }

            const dayNumber = day.day || index + 1;
            const safeDay = {
              day: dayNumber,
              breakfast: day.breakfast || null,
              lunch: day.lunch || null,
              dinner: day.dinner || null,
              snacks: Array.isArray(day.snacks) ? day.snacks.filter(s => s) : []
            };

            return (
              <div key={`day-${dayNumber}-${index}`} className="day-card">
                <div className="day-header">
                  <h3 className="day-title">Day {dayNumber}</h3>
                </div>

                <div className="meals-list">
                  {safeDay.breakfast && <MealCard meal={safeDay.breakfast} type="Breakfast" />}
                  {safeDay.lunch && <MealCard meal={safeDay.lunch} type="Lunch" />}
                  {safeDay.dinner && <MealCard meal={safeDay.dinner} type="Dinner" />}
                  
                  {safeDay.snacks.length > 0 && (
                    <div className="snacks-section">
                      <h4 className="snacks-title">Snacks</h4>
                      {safeDay.snacks.map((snack, snackIndex) => (
                        snack && (
                          <MealCard 
                            key={`snack-${dayNumber}-${snackIndex}`} 
                            meal={snack} 
                            type="Snack" 
                          />
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          } catch (error) {
            console.error(`Error rendering day ${index}:`, error);
            return (
              <div key={`error-day-${index}`} className="day-card">
                <div className="day-header">
                  <h3 className="day-title">Day {index + 1}</h3>
                </div>
                <p className="meal-message">Unable to display this day's meals.</p>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

function MealCard({ meal, type }) {
  // Handle null/undefined meal gracefully
  if (!meal) {
    return (
      <div className="meal-card meal-card-missing">
        <div className="meal-header">
          <span className="meal-type">{type}</span>
          <span className="meal-calories">Not available</span>
        </div>
        <h4 className="meal-name">No meal data available</h4>
        <p className="meal-message">Unable to generate this meal with current preferences.</p>
      </div>
    );
  }

  // Ensure all required properties exist with defaults
  const mealData = {
    name: meal.name || 'Unknown',
    calories: meal.calories ?? 0,
    protein: meal.protein ?? 0,
    carbs: meal.carbs ?? 0,
    fats: meal.fats ?? 0
  };

  return (
    <div className="meal-card">
      <div className="meal-header">
        <span className="meal-type">{type}</span>
        <span className="meal-calories">{mealData.calories} cal</span>
      </div>
      <h4 className="meal-name">{mealData.name}</h4>
      <div className="meal-nutrition">
        <div className="nutrition-item">
          <span className="nutrition-label">Protein:</span>
          <span className="nutrition-value">{mealData.protein}g</span>
        </div>
        <div className="nutrition-item">
          <span className="nutrition-label">Carbs:</span>
          <span className="nutrition-value">{mealData.carbs}g</span>
        </div>
        <div className="nutrition-item">
          <span className="nutrition-label">Fats:</span>
          <span className="nutrition-value">{mealData.fats}g</span>
        </div>
      </div>
    </div>
  );
}

export default MealPlanResults;
