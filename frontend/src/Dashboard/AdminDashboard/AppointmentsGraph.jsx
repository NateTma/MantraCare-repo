import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useGlobalState } from '../../provider/GlobalStateProvider';

// Register the necessary scales
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AppointmentsGraph = () => {
    const [appointmentsData, setAppointmentsData] = useState([]);
    const {accessToken} = useGlobalState()

    useEffect(() => {
        fetchAppointmentsCount();
    }, []);

    const fetchAppointmentsCount = async () => {
        try {
            const response = await fetch('http://localhost:3500/bookings/count', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch appointments count');
            }
            const data = await response.json();
            setAppointmentsData(data);
        } catch (error) {
            console.error('Error fetching appointments count:', error);
        }
    };

    const formatDateLabels = (appointmentsData) => {
        return appointmentsData.map(entry => entry._id);
    };

    const formatDataValues = (appointmentsData) => {
        return appointmentsData.map(entry => entry.count);
    };

    const data = {
        labels: formatDateLabels(appointmentsData),
        datasets: [
            {
                label: 'Appointments',
                data: formatDataValues(appointmentsData),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div>
            <h2>Appointments Over Time</h2>
            <Line data={data} />
        </div>
    );
};

export default AppointmentsGraph;


// import React, { useEffect, useState } from 'react';
// import { Line, Pie } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { useGlobalState } from '../../provider/GlobalStateProvider';

// // Register the necessary scales
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

// const AppointmentsGraph = () => {
//     const [appointmentsData, setAppointmentsData] = useState([]);
//     const [sessionTypesData, setSessionTypesData] = useState([]);
//     const { accessToken } = useGlobalState();

//     useEffect(() => {
//         fetchAppointmentsCount();
//         fetchSessionTypesCount();
//     }, []);

//     const fetchAppointmentsCount = async () => {
//         try {
//             const response = await fetch('http://localhost:3500/bookings/count', {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch appointments count');
//             }
//             const data = await response.json();
//             setAppointmentsData(data);
//         } catch (error) {
//             console.error('Error fetching appointments count:', error);
//         }
//     };

//     const fetchSessionTypesCount = async () => {
//         try {
//             const response = await fetch('http://localhost:3500/bookings/by-type', {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to fetch session types count');
//             }
//             const data = await response.json();
//             setSessionTypesData(data);
//         } catch (error) {
//             console.error('Error fetching session types count:', error);
//         }
//     };

//     const formatDateLabels = (data) => {
//         return data.map(entry => entry._id);
//     };

//     const formatDataValues = (data) => {
//         return data.map(entry => entry.count);
//     };

//     const appointmentsChartData = {
//         labels: formatDateLabels(appointmentsData),
//         datasets: [
//             {
//                 label: 'Appointments',
//                 data: formatDataValues(appointmentsData),
//                 fill: false,
//                 borderColor: 'rgb(75, 192, 192)',
//                 tension: 0.1,
//             },
//         ],
//     };

//     const sessionTypesLabels = sessionTypesData.map(entry => entry._id);
//     const sessionTypesCounts = sessionTypesData.map(entry => entry.count);

//     const sessionTypesChartData = {
//         labels: sessionTypesLabels,
//         datasets: [
//             {
//                 label: 'Session Types',
//                 data: sessionTypesCounts,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(75, 192, 192, 0.7)',
//                     'rgba(153, 102, 255, 0.7)',
//                 ],
//                 borderColor: [
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                 ],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                 {/* Line Chart */}
//                 <div style={{ width: '48%' }}>
//                     <h2>Appointments Over Time</h2>
//                     <Line data={appointmentsChartData} />
//                 </div>

//                 {/* Pie Chart */}
//                 <div style={{ width: '48%' }}>
//                     <h2>Session Types</h2>
//                     <Pie data={sessionTypesChartData} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AppointmentsGraph;
