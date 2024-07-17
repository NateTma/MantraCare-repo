import { FaPaperPlane } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import './textChat.css';

const TextChat2 = ({ socket, accessToken, username, userRole }) => {
  const { roomId } = useParams();
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [supports, setSupport] = useState([]);
  const [textSessions, setTextSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupportLoading, setIsSupportLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(true);
  let supportData;
  
  const [page, setPage] = useState(1);
  const limit = 10; // Number of messages to fetch per request
  const chatContainerRef = useRef(null);
  console.log(username);

  const baseUrl = `http://localhost:3500`;

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);
  
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  
  useEffect(() => {
    socket.emit('join-chat-room', roomId);

    return () => {
      socket.off('receive-message');
    };
  }, [socket, roomId]);

  useEffect(() => {
    socket.on('receive-message', (receivedData) => {
      setMessageList((prevMessageList) => [...prevMessageList, receivedData]);
      scrollToBottom();
    });
  }, [socket]);

  useEffect(() => {
    setMessageList([])
    fetchMessages();
    scrollToBottom();
  }, [page, roomId]);

  useEffect(() => {
    fetchSessions();
  }, [roomId]);

  const fetchMessages = async () => {
    try {
      setIsMessagesLoading(true);
      const url = `${baseUrl}/messages/session/${roomId}?page=${page}&limit=${limit}`;

      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(url, requestOptions);

      if (response.status === 200) {
        const data = await response.json();
        setMessageList((prevMessageList) => [...data.reverse(), ...prevMessageList]);
        scrollToBottom();
      } else if (response.status === 204) {
        // Do nothing if no messages are found
      } else {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to fetch messages', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setIsMessagesLoading(false);
    } catch (error) {
      toast.error('Failed to fetch messages', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsMessagesLoading(false);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message !== '') {
      const messageData = {
        messageContent: message,
        sessionId: roomId,
        senderUserName: username,
        timeStamp: new Date(),
      };
      setMessage('');
      setMessageList((prevMessageList) => [...prevMessageList, messageData]);

      await socket.emit('send-message', messageData);
      await saveMessageToDB(messageData);

      scrollToBottom();
    }
  };

  const saveMessageToDB = async (messageData) => {
    try {
      const url = `${baseUrl}/messages`;

      const requestOptions = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      };

      const response = await fetch(url, requestOptions);

      if (response.status !== 201) {
        const errorMessages = await response.json();
        toast.error(errorMessages.message || 'Failed to send message', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error('Failed to send message', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const fetchSessions = async () => {
    setIsSupportLoading(true);
    try {
      let url1 = `${baseUrl}/customerAndCrisisSupportSession/${roomId}`;

      setTextSessions([]);

      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };

      let sessionData;
      

      const response1 = await fetch(url1, requestOptions);

      if (response1.status === 200) {
        sessionData = await response1.json();
        setTextSessions(sessionData);
        
      } else {
        const errorMessages = 'error while fetching data';
        toast(errorMessages, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

     
      await fetchIndividualUsers(sessionData);
      setIsSupportLoading(false);
    } catch (error) {
      toast.error('Failed to fetch session data', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsSupportLoading(false);
    }
  };

  const fetchIndividualUsers = async (sessionData) => {
    try {
      console.log('hiiiiiiiiiiiii')
      if(userRole == 'Patient') {
      const patientUrl = `${baseUrl}/patients/userId/${sessionData.userId}`;
      
      const patientResponse = await fetch(patientUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (patientResponse.status === 200) {
        const patientData = await patientResponse.json();
        const supportUrl = `${baseUrl}/customerAndCrisisSupport/${sessionData.customerSupportId}`;
        const supportResponse = await fetch(supportUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (supportResponse.status === 200) {
          console.log('byeeeeeeeeeeee')
          supportData = await supportResponse.json();
          
          // Save patient and therapist in states
          setPatients([patientData]);
          setSupport([supportData]);
          console.log('supportData',supportData)
        } else {
          throw new Error('Failed to fetch support data');
        }
      } else {
        throw new Error('Failed to fetch patient data');
      }
    } else {
      console.group('cccccccccccccc')
      const therapistUrl = `${baseUrl}/therapists/userId/${sessionData.userId}`;
      const therapistResponse = await fetch(therapistUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('111', therapistResponse.status)
      if (therapistResponse.status === 200) {
        
        const therapistData = await therapistResponse.json();
        setTherapists([therapistData]);
        const supportUrl = `${baseUrl}/customerAndCrisisSupport/${sessionData.customerSupportId}`;
        const supportResponse = await fetch(supportUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('support resonse', supportResponse.status)
        if (supportResponse.status === 200) {
          console.log('byeeeeeeeeeeeefdsafaf')
          supportData = await supportResponse.json();
          console.log('response', supportData)
        
          setSupport([supportData]);
          console.log('123')
          console.log('supportData',supportData)
        } else {
          throw new Error('Failed to fetch support data');
        }

      } else {
        throw new Error('Failed to fetch therapist data');
      }}
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const setProfilePicData =  (data) => {
    if (!data || !data.profilePic) {
      return null;
    }
  
    console.log("Profile picture data:", data.profilePic);
    console.log("Type of profilePic.data:", typeof data.profilePic.data);
  
    if (typeof data.profilePic.data === 'string') {
      const base64Image = `data:${data.profilePic.contentType};base64,${data.profilePic.data}`;
      console.log("Base64 image string (string):", base64Image);
      return base64Image;
    } else if (data.profilePic.data instanceof ArrayBuffer) {
      const base64Image = `data:${data.profilePic.contentType};base64,${arrayBufferToBase64(data.profilePic.data)}`;
      console.log("Base64 image string (buffer):", base64Image);
      return base64Image;
    } else {
      console.error("Unknown type of profilePic.data:", data.profilePic.data);
      return null;
    }
  };
  

  const arrayBufferToBase64 = (buffer) => {
    console.log("Buffer data:", buffer);
    if (!buffer) return '';

    let binary = '';
    const bytes = new Uint8Array(buffer);
    console.log('Uint8Array:', bytes);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    console.log('Binary string:', binary);
    return window.btoa(binary);
  };

  const getSenderProfilePic = (message) => {
    const isPatient = patients.some((patient) => patient.username === message.senderUserName);
    const isTherapist = therapists.some((therapist) => therapist.username === message.senderUserName);
    if (isPatient) {
      console.log('patient')
      const patient = patients.find((patient) => patient.username === message.senderUserName);
      return  patient ? setProfilePicData(patient) : null;
    } else if (isTherapist) {
      console.log('therapst')
      const therapist = therapists.find((therapist) => therapist.username === message.senderUserName);
      return  therapist ? setProfilePicData(therapist) : null;
    } else {
      console.log('customer')
      return  supports ? setProfilePicData(supports) : null;
    }
  };

  let supportProfile = supports.length > 0 ? setProfilePicData(supports[0]) : null;
  console.log('rofile pic', supportProfile)

  console.log('supports', supports[0])

  return (
    <div className='text-page-container'>
      {isSupportLoading || isMessagesLoading ?(
        <div className="loader-container">
        <ClipLoader color={'#0426FA'} loading={true} size={100} aria-label="Loading Spinner" />
        </div>
      ) : (
        <>
        
          <div id='support-info-container'>
            
            {supports.length > 0 && (
              <div className='support-box'>
                <div className='image-container'>
                <img src={supportProfile} alt="" />
                </div>
                <p>name: {supports[0].name}</p>
                <p><span>Support Type:</span> {textSessions.supportType}</p>
              </div>
            )}
          </div> 
          <div className="text-chat-container">
            <ToastContainer />
            <div className="text-chat-header">
            <div className='image-container'>
                <img src={supportProfile} alt="" />
            </div >
            <div className='header-info'> <p></p></div>        
            </div>
            <div className="text-chat-body" ref={chatContainerRef}>
              <div>
                {messageList.map((message, index) => {
                  const profilePicSrc = getSenderProfilePic(message);
                  return (
                    <div
                      className={`
                      ${username === message.senderUserName ? 'sent-message' : 'received-message'}`}
                      key={index}
                    >
                      <div className='message-box'>
                      <div className="message-profile-pic">
                        {username !== message.senderUserName && profilePicSrc && (
                          <img
                            className='image-bubble'
                            src={profilePicSrc}
                            alt="p"
                            onLoad={() => scrollToBottom()}
                          />
                        )}
                      </div>
                      <div className='message-content-box'>
                      <div className='message-content'>
                        <p>{message.messageContent}</p>
                      </div>
                      <div className='message-date'>{new Date(message.timeStamp).toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'})}</div>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-chat-footer">
              <input
                type="text"
                value={message}
                autoFocus 
                placeholder="Write a message..."
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <button onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TextChat2;
