import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import './ApprovalPage.css';

const ApprovalPage = ({ onTherapistSelect }) => {
  const [unapprovedTherapists, setUnapprovedTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnapprovedTherapists = async () => {
      try {
        const response = await fetch('http://localhost:3500/therapists/unapproved');
        if (response.status === 204) {
          setUnapprovedTherapists([]);
        } else if (response.ok) {
          const data = await response.json();
          setUnapprovedTherapists(data);
        }
      } catch (error) {
        console.error('Failed to fetch unapproved therapists', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedTherapists();
  }, []);

  const setProfilePicData = (data) => {
    if (!data || !data.profilePic) {
      return null;
    }

    if (typeof data.profilePic.data === 'string') {
      const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
      return base64Image;
    } else if (data.profilePic.data instanceof ArrayBuffer) {
      const base64Image = `data:${data.profilePic.contentType};base64,${arrayBufferToBase64(data.profilePic.data)}`;
      return base64Image;
    } else {
      return null;
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    if (!buffer) return '';

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!unapprovedTherapists.length) {
    return <div>No unapproved therapists found</div>;
  }

  return (
    <div className="approval-page">
      <h2>Unapproved Therapists</h2>
      <div className="therapist-list">
        {unapprovedTherapists.map((therapist) => (
          <div key={therapist.therapistId} className="therapist-card" onClick={() => onTherapistSelect(therapist.therapistId)}>
            <div className="profile-pic">
              {therapist.profilePic ? (
                <img src={setProfilePicData(therapist)} alt="Profile Pic" />
              ) : (
                <div className="placeholder-pic">No Image</div>
              )}
            </div>
            <div className="therapist-details">
              <p><strong>Name:</strong> {therapist.name}</p>
              <p><strong>Email:</strong> {therapist.email}</p>
              <p><strong>Specialization:</strong> {therapist.specialization}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalPage;
