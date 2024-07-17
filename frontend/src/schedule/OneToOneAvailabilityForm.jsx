import React, { useState, useRef } from 'react';
import './scheduler.css';

const OneToOneAvailabilityForm = ({availability, setAvailability}) => {
  
  const [newDay, setNewDay] = useState('');
  const [tempStartTime, setTempStartTime] = useState({});
  const [tempEndTime, setTempEndTime] = useState({});
  const [highlightedDay, setHighlightedDay] = useState('');

  const scrollRef = useRef(null);

  const convertToAMPM = (time) => {
    const [hours, minutes] = time.split(':');
    const hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const adjustedHours = hoursInt % 12 || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const handleAddDay = () => {
    if (newDay) {
      const existingDay = availability.find(slot => slot.day === newDay);
      if (existingDay) {
        setHighlightedDay(newDay);
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setAvailability([...availability, { day: newDay, timeSlots: [] }]);
        setTempStartTime({ ...tempStartTime, [newDay]: '' });
        setTempEndTime({ ...tempEndTime, [newDay]: '' });
        setNewDay('');
      }
    }
  };

  const handleAddTimeSlot = (day) => {
    if (tempStartTime[day] && tempEndTime[day]) {
      const newTimeSlot = `${convertToAMPM(tempStartTime[day])} - ${convertToAMPM(tempEndTime[day])}`;
      setAvailability(availability.map((slot) =>
        slot.day === day ? { ...slot, timeSlots: [...slot.timeSlots, newTimeSlot] } : slot
      ));
      setTempStartTime({ ...tempStartTime, [day]: '' });
      setTempEndTime({ ...tempEndTime, [day]: '' });
    }
  };

  const handleRemoveTimeSlot = (day, timeSlot) => {
    setAvailability(availability.map((slot) =>
      slot.day === day ? { ...slot, timeSlots: slot.timeSlots.filter((ts) => ts !== timeSlot) } : slot
    ));
  };

  const handleStartTimeChange = (day, value) => {
    setTempStartTime({ ...tempStartTime, [day]: value });
  };

  const handleEndTimeChange = (day, value) => {
    setTempEndTime({ ...tempEndTime, [day]: value });
  };

  return (
    <div className="schedule-form-container">
      <h2>One-on-One Availability</h2>
      <div className="schedule-input-group">
        <select value={newDay} onChange={(e) => setNewDay(e.target.value)}>
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <button onClick={handleAddDay}>Add Day</button>
      </div>
      {availability.map((slot, index) => (
        <div key={index} className={`day-container ${slot.day === highlightedDay ? 'highlighted' : ''}`} ref={slot.day === highlightedDay ? scrollRef : null}>
          <h3>{slot.day}</h3>
          {slot.timeSlots.length === 0 && <p>Please add a time slot</p>}
          <ul>
            {slot.timeSlots.map((timeSlot, idx) => (
              <li key={idx}>
                {timeSlot}
                <button onClick={() => handleRemoveTimeSlot(slot.day, timeSlot)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="input-group">
            <input
              type="time"
              value={tempStartTime[slot.day] || ''}
              onChange={(e) => handleStartTimeChange(slot.day, e.target.value)}
              step="1800"
            />
            <input
              type="time"
              value={tempEndTime[slot.day] || ''}
              onChange={(e) => handleEndTimeChange(slot.day, e.target.value)}
              step="1800"
            />
            <button onClick={() => handleAddTimeSlot(slot.day)}>Add Time Slot</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OneToOneAvailabilityForm;
