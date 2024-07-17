import React, { useState } from 'react';
import './AdminDashboard.css';
import PatientsPage from './PatientsPage';
import TherapistsPage from './TherapistsPage';
import CreateAdminsPage from './CreateAdminsPage';
import CreateCustomerSupportPage from './CreateCustomerSupportPage';
import ApprovalPage from './ApprovalPage';
import CustomerSupportPage from './CustomerSupportPage';
import Approve from './Approve';
import { useNavigate } from 'react-router-dom';
import AppointmentsGraph from './AppointmentsGraph'
const AdminDashboard = () => {
  const [selectedPage, setSelectedPage] = useState('patients');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const navigate = useNavigate();

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setSelectedTherapistId(null);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleTherapistSelect = (id) => {
    setSelectedTherapistId(id);
    setSelectedPage('approve');
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const renderSelectedPage = () => {
    if (selectedPage === 'approve' && selectedTherapistId) {
      return <Approve therapistId={selectedTherapistId} onApprovalSuccess={() => handlePageSelect('approvals')} />;
    }
    
    switch (selectedPage) {
      case 'patients':
        return <PatientsPage />;
      case 'therapists':
        return <TherapistsPage />;
      case 'create-admins':
        return <CreateAdminsPage />;
      case 'graphs':
        return <AppointmentsGraph />;
      case 'create-customer-support':
        return <CreateCustomerSupportPage />;
      case 'customer-support':
        return <CustomerSupportPage />;
      case 'approvals':
        return <ApprovalPage onTherapistSelect={handleTherapistSelect} />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('patients')}>Patients</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('graphs')}>Stat</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('therapists')}>Therapists</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('customer-support')}>Customer Support</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('create-admins')}>Create Admins</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('create-customer-support')}>Create Customer Support</button>
        <button className="admin-sidebar-item" onClick={() => handlePageSelect('approvals')}>Approvals</button>
        <button className="admin-sidebar-logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="admin-content">
        <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          &#9776;
        </div>
        {renderSelectedPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;
