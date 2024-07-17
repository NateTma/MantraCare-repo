import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';
import './CustomerSupportPage.css';

const CustomerAndCrisisSupportPage = () => {
  const [supports, setSupports] = useState([]);
  const [supportCount, setSupportCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSupports = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3500/customerandcrisissupport');
        const data = await response.json();
        setSupports(data.customerAndCrisisSupport);
        setSupportCount(data.count);
        
        toast.success('Customer and Crisis Support fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch customer and crisis support');
        console.error('Failed to fetch customer and crisis support', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupports();
  }, []);

  const handleDelete = async (supportId) => {
    try {
      await fetch(`http://localhost:3500/customerandcrisissupport/${supportId}`, { method: 'DELETE' });
      setSupports(supports.filter(support => support.customerSupportId !== supportId));
      setSupportCount(supportCount - 1);
      toast.success('Customer and Crisis Support deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete customer and crisis support');
      console.error('Failed to delete customer and crisis support', error);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <div className="admin-support-page">
      <h2>Customer and Crisis Support ({supportCount})</h2>
      <div className="clip-loader">
        <ClipLoader color="#007bff" loading={loading} css={override} size={35} />
      </div>
      <div className="admin-support-list">
        {supports.map(support => (
          <div key={support.customerSupportId} className="admin-support-item">
            <div className="admin-support-item-info">
              <p><strong>Username:</strong> {support.username}</p>
              <p><strong>Email:</strong> {support.email}</p>
              <p><strong>User ID:</strong> {support.userId}</p>
              <p><strong>Phone Number:</strong> {support.phoneNumber}</p>
              <p><strong>Role:</strong> {support.role}</p>
            </div>
            <button
              className="admin-support-delete-button"
              onClick={() => handleDelete(support.customerSupportId)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CustomerAndCrisisSupportPage;
