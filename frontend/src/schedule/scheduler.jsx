import React, { useState, useEffect } from 'react';
import OneToOneAvailabilityForm from './OneToOneAvailabilityForm';
import GroupAvailabilityForm from './GroupAvailabilityForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './scheduler.css';

const TherapistScheduler = ({ userRole, username, accessToken }) => {
  const id = localStorage.getItem('userId') || '';
  const [scheduleData, setScheduleData] = useState(null);
  const [view, setView] = useState('oneOnOne');
  const [therapist, setTherapist] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [groupAvailability, setGroupAvailability] = useState([]);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3500/therapists/userId/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch therapist');
        }
        const therapistData = await response.json();
        setTherapist(therapistData);
        console.log('therapist: ', therapistData)
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch therapist');
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!therapist) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3500/schedule/therapist/${therapist.therapistId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 404) {
          setScheduleData(null); // No schedule found
        } else if (response.ok) {
          const data = await response.json();
          setScheduleData(data);
          setAvailability(data.oneOnOneAvailability || []);
          setGroupAvailability(data.groupAvailability || []);
        } else {
          throw new Error('Failed to fetch schedule');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule:', error);
        setError('Failed to fetch schedule');
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [therapist, accessToken]);

  const handleSubmit = async () => {
    try {
      const formData = {
        therapistId: therapist.therapistId,
        oneOnOneAvailability: availability,
        groupAvailability: groupAvailability,
      };
      console.log('formdata', formData)

      const method = scheduleData ? 'PUT' : 'POST';
      const url = scheduleData
        ? `http://localhost:3500/schedule/${scheduleData.scheduleId}`
        : 'http://localhost:3500/schedule';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${scheduleData ? 'update' : 'create'} schedule`);
      }

      const data = await response.json();
      toast.success(data.message);
      if (!scheduleData) {
        setScheduleData(data.schedule);
      }
    } catch (error) {
      console.error(`Error ${scheduleData ? 'updating' : 'creating'} schedule:`, error);
      toast.error(`Failed to ${scheduleData ? 'update' : 'create'} schedule`);
    }
  };

  return (
    <div className="therapist_scheduler">
      <h1>Therapist Availability Management</h1>
      <div className="switch-container">
        <button
          className={`switch-button ${view === 'oneOnOne' ? 'active' : ''}`}
          onClick={() => setView('oneOnOne')}
        >
          One-on-One Availability
        </button>
        <button
          className={`switch-button ${view === 'group' ? 'active' : ''}`}
          onClick={() => setView('group')}
        >
          Group Availability
        </button>
      </div>
      <div className="form-container">
        {view === 'oneOnOne' ? (
          <OneToOneAvailabilityForm availability={availability} setAvailability={setAvailability} />
        ) : (
          <GroupAvailabilityForm groupAvailability={groupAvailability} setGroupAvailability={setGroupAvailability} />
        )}
      </div>
      <div className="submit-button-container">
        <button className="group-schedule-button" onClick={handleSubmit}>
          {scheduleData ? 'Update Schedule' : 'Create Schedule'}
        </button>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default TherapistScheduler;
