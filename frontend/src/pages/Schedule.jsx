// import React, { useState } from 'react';
// import { useGlobalState } from '../provider/GlobalStateProvider';

// const CreateScheduleForm = () => {
//     const {accessToken} = useGlobalState()
//     const [formData, setFormData] = useState({
//         therapistId: '',
//         oneOnOneAvailability: [{ day: '', timeSlots: [] }],
//         groupAvailability: [{ title: '', sessionLocation: '', day: '', timeSlots: [] }]
//     });

//     const handleInputChange = (e, index, type) => {
//         const { name, value } = e.target;
//         const updatedData = [...formData[type]];
//         updatedData[index][name] = value;
//         setFormData({ ...formData, [type]: updatedData });
//     };

//     const handleAddSlot = (type) => {
//         setFormData({
//             ...formData,
//             [type]: [...formData[type], { day: '', timeSlots: [] }]
//         });
//     };

//     const handleRemoveSlot = (index, type) => {
//         const updatedData = [...formData[type]];
//         updatedData.splice(index, 1);
//         setFormData({ ...formData, [type]: updatedData });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:3500/schedule', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to create schedule');
//             }

//             alert('Schedule created successfully');
//             // Optionally reset the form or redirect
//         } catch (error) {
//             console.error('Error creating schedule:', error);
//             alert('Failed to create schedule');
//         }
//     };

//     return (
//         <div>
//             <h2>Create Schedule</h2>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="therapistId">Therapist ID:</label><br />
//                 <input type="text" id="therapistId" name="therapistId" value={formData.therapistId} onChange={(e) => setFormData({ ...formData, therapistId: e.target.value })} required /><br /><br />

//                 <div>
//                     <h3>One-on-One Availability:</h3>
//                     {formData.oneOnOneAvailability.map((slot, index) => (
//                         <div key={index}>
//                             <label htmlFor={`oneOnOneDay${index}`}>Day:</label>
//                             <select id={`oneOnOneDay${index}`} name="day" value={slot.day} onChange={(e) => handleInputChange(e, index, 'oneOnOneAvailability')} required>
//                                 <option value="">Select a day</option>
//                                 <option value="Monday">Monday</option>
//                                 <option value="Tuesday">Tuesday</option>
//                                 <option value="Wednesday">Wednesday</option>
//                                 <option value="Thursday">Thursday</option>
//                                 <option value="Friday">Friday</option>
//                             </select><br />

//                             <label htmlFor={`oneOnOneTimeSlots${index}`}>Time Slots:</label><br />
//                             <input type="text" id={`oneOnOneTimeSlots${index}`} name="timeSlots" value={slot.timeSlots} onChange={(e) => handleInputChange(e, index, 'oneOnOneAvailability')} required /><br />

//                             {index > 0 && <button type="button" onClick={() => handleRemoveSlot(index, 'oneOnOneAvailability')}>Remove Slot</button>}
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => handleAddSlot('oneOnOneAvailability')}>Add Slot</button>
//                 </div>

//                 <div>
//                     <h3>Group Availability:</h3>
//                     {formData.groupAvailability.map((slot, index) => (
//                         <div key={index}>
//                             <label htmlFor={`groupTitle${index}`}>Title:</label>
//                             <input type="text" id={`groupTitle${index}`} name="title" value={slot.title} onChange={(e) => handleInputChange(e, index, 'groupAvailability')} required /><br />

//                             <label htmlFor={`groupSessionLocation${index}`}>Session Location:</label>
//                             <input type="text" id={`groupSessionLocation${index}`} name="sessionLocation" value={slot.sessionLocation} onChange={(e) => handleInputChange(e, index, 'groupAvailability')} required /><br />

//                             <label htmlFor={`groupDay${index}`}>Day:</label>
//                             <select id={`groupDay${index}`} name="day" value={slot.day} onChange={(e) => handleInputChange(e, index, 'groupAvailability')} required>
//                                 <option value="">Select a day</option>
//                                 <option value="Monday">Monday</option>
//                                 <option value="Tuesday">Tuesday</option>
//                                 <option value="Wednesday">Wednesday</option>
//                                 <option value="Thursday">Thursday</option>
//                                 <option value="Friday">Friday</option>
//                             </select><br />

//                             <label htmlFor={`groupTimeSlots${index}`}>Time Slots:</label><br />
//                             <input type="text" id={`groupTimeSlots${index}`} name="timeSlots" value={slot.timeSlots} onChange={(e) => handleInputChange(e, index, 'groupAvailability')} required /><br />

//                             {index > 0 && <button type="button" onClick={() => handleRemoveSlot(index, 'groupAvailability')}>Remove Slot</button>}
//                         </div>
//                     ))}
//                     <button type="button" onClick={() => handleAddSlot('groupAvailability')}>Add Slot</button>
//                 </div>

//                 <button type="submit">Create Schedule</button>
//             </form>
//         </div>
//     );
// };

// export default CreateScheduleForm;
