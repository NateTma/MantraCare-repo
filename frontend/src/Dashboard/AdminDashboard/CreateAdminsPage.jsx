import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import './CreateAdminstratorPage.css';

const CreateAdministratorPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('username', formData.username);
    formDataToSubmit.append('password', formData.password);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('dateOfBirth', formData.dateOfBirth);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);

    try {
      const response = await fetch('http://localhost:3500/administrators', {
        method: 'POST',
        body: formDataToSubmit,
      });
      const data = await response.json()
      if (!response.ok) {
        toast.info(data.message);
      }
      if(response.ok)
      {toast.success('Administrator created successfully');}
    } catch (error) {
      toast.error('Failed to create administrator');
    } finally {
      setLoading(false);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <div className="admin-create-admin">
      <ToastContainer />
      <h2>Create Administrator</h2>
      <div className="clip-loader">
        <ClipLoader color="#007bff" loading={loading} css={override} size={35} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-create-admin-form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-admin-form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-admin-form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-admin-form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-admin-form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-create-admin-form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="admin-create-admin-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Administrator'}
        </button>
      </form>
    </div>
  );
};

export default CreateAdministratorPage;
