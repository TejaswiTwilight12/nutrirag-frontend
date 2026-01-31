import './DaysSelector.css';

const DAY_OPTIONS = [3, 5, 7];

function DaysSelector({ days, onChange }) {
  // Safely validate days prop
  const safeDays = (typeof days === 'number' && days >= 3 && days <= 7) 
    ? days 
    : 7;

  const handleDayChange = (dayCount) => {
    try {
      // Validate dayCount
      if (!DAY_OPTIONS.includes(dayCount)) {
        console.warn('Invalid day option:', dayCount);
        return;
      }

      // Safely call onChange
      if (typeof onChange === 'function') {
        onChange(dayCount);
      } else {
        console.warn('onChange is not a function');
      }
    } catch (error) {
      console.error('Error changing days:', error);
    }
  };

  return (
    <div className="days-selector">
      <h2 className="form-section-title">Meal Plan Duration</h2>
      <div className="days-options">
        {DAY_OPTIONS.map((dayCount) => (
          <button
            key={dayCount}
            className={`day-button ${safeDays === dayCount ? 'active' : ''}`}
            onClick={() => handleDayChange(dayCount)}
            type="button"
          >
            {dayCount} {dayCount === 1 ? 'Day' : 'Days'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DaysSelector;
