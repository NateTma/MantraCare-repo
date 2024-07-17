import React, { useState } from 'react';
import './scheduler.css';

const GroupAvailabilityForm = ({groupAvailability, setGroupAvailability}) => {
  
  const [newSession, setNewSession] = useState({ title: '', sessionLocation: '', day: '' });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  console.log('groupavailablilty',groupAvailability)

  const convertToAMPM = (time) => {
    const [hours, minutes] = time.split(':');
    const hoursInt = parseInt(hours, 10);
    const period = hoursInt >= 12 ? 'PM' : 'AM';
    const adjustedHours = hoursInt % 12 || 12;
    return `${adjustedHours}:${minutes} ${period}`;
  };

  const handleAddSession = () => {
    if (newSession.title && newSession.sessionLocation && newSession.day) {
      setGroupAvailability([...groupAvailability, { ...newSession, timeSlots: [] }]);
      setNewSession({ title: '', sessionLocation: '', day: '' });
    }
  };

  const handleAddTimeSlot = (title, day) => {
    if (startTime && endTime) {
      const newTimeSlot = `${convertToAMPM(startTime)} - ${convertToAMPM(endTime)}`;
      setGroupAvailability(groupAvailability.map((session) =>
        session.title === title && session.day === day
          ? { ...session, timeSlots: [...session.timeSlots, newTimeSlot] }
          : session
      ));
      setStartTime('');
      setEndTime('');
      console.log('groupavail', groupAvailability)
    }
  };

  const handleRemoveTimeSlot = (title, day, timeSlot) => {
    setGroupAvailability(groupAvailability.map((session) =>
      session.title === title && session.day === day
        ? { ...session, timeSlots: session.timeSlots.filter((ts) => ts !== timeSlot) }
        : session
    ));
  };

 

  return (
    <div className="schedule-form-container">
      <h2>Group Availability</h2>
      <div className="schedule-input-group">
        <input
          type="text"
          value={newSession.title}
          onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
          placeholder="Session Title"
        />
        <select
          value={newSession.sessionLocation}
          onChange={(e) => setNewSession({ ...newSession, sessionLocation: e.target.value })}
        >
          <option value="">Select Location</option>
          <option value="online">Online</option>
          <option value="in-person">In-person</option>
        </select>
        <select
          value={newSession.day}
          onChange={(e) => setNewSession({ ...newSession, day: e.target.value })}
        >
          <option value="">Select Day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
        <button className="group-schedule-button" onClick={handleAddSession}>Add Session</button>
      </div>
      {groupAvailability.map((session, index) => (
        <div key={index} className="day-container">
          <h3>{session.title} ({session.sessionLocation}) - {session.day}</h3>
          <ul>
            {session.timeSlots.map((timeSlot, idx) => (
              <li key={idx}>
                {timeSlot}
                <button onClick={() => handleRemoveTimeSlot(session.title, session.day, timeSlot)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="input-group">
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              step="1800"
            />
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              step="1800"
            />
            <button onClick={() => handleAddTimeSlot(session.title, session.day)}>Add Time Slot</button>
          </div>
        </div>
      ))}
      
    </div>
  );
};

export default GroupAvailabilityForm;
