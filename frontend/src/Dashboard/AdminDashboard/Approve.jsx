import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Approve.css';

const Approve = ({ therapistId, onApprovalSuccess }) => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await fetch(`http://localhost:3500/therapists/unapproved/${therapistId}`);
        if (response.ok) {
          const data = await response.json();
          setTherapist(data);
        } else {
          toast.error('Failed to fetch therapist');
        }
      } catch (error) {
        toast.error('Error fetching therapist');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [therapistId]);

  const approveTherapist = async () => {
    try {
      const response = await fetch(`http://localhost:3500/therapists/approve/${therapistId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        toast.success('Therapist approved successfully');
        onApprovalSuccess();  // Call the callback function to navigate back to the approval list
      } else {
        toast.error('Failed to approve therapist');
      }
    } catch (error) {
      toast.error('Error approving therapist');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (!therapist) {
    return <div>Therapist not found</div>;
  }

  return (
    <div className="approve-page">
      <ToastContainer />
      <h2>Approve Therapist</h2>
      <div className="therapist-details">
        <div className="profile-pic">
          {therapist.profilePic ? (
            <img src={`data:${therapist.profilePic.contentType};base64,${therapist.profilePic.data}`} alt="Profile Pic" />
          ) : (
            <div className="placeholder-pic">No Image</div>
          )}
        </div>
        <p><strong>Name:</strong> {therapist.name}</p>
        <p><strong>Email:</strong> {therapist.email}</p>
        <p><strong>Specialization:</strong> {therapist.specialization}</p>
        <p><strong>Experience:</strong> {therapist.experience}</p>
        <p><strong>Education:</strong> {therapist.education}</p>
        {therapist.educationCertificate && (
          <div className="certificate">
            <strong>Education Certificate:</strong>
            <img src={`data:${therapist.educationCertificate.contentType};base64,${therapist.educationCertificate.data}`} alt="Education Certificate" />
          </div>
        )}
        {therapist.license && (
          <div className="license">
            <strong>License:</strong>
            <img src={`data:${therapist.license.contentType};base64,${therapist.license.data}`} alt="License" />
          </div>
        )}
        <button className="approve-btn" onClick={approveTherapist}>Approve</button>
      </div>
    </div>
  );
};

export default Approve;
