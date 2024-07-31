import './adminDashTable.css';
import { useGlobalContext } from "../../contexts/GlobalContext";
import { Link } from 'react-router-dom';
import { Buffer } from 'buffer';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons'


export const AdminDashTable = () => {
  const { getAll, users } = useGlobalContext();
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const toggleFullScreen = (imageSrc) => {
    setFullScreenImage(imageSrc);
  };

  const closeFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="admin-dash-table-container">
      <button onClick={() => getAll()}>Refresh</button>
      <div className="container mt-5">
        {users && (
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Schedule Type</th>
                <th>Mobile Number</th>
                <th>Payment Slip</th>
                <th>Comfirmation</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user, index) => {
                const paymentSlipBase64 = Buffer.from(
                  user.paymentSlip.img.data
                ).toString("base64");
                const paymentSlipSrc = `data:${user.paymentSlip.img.contentType};base64,${paymentSlipBase64}`;

                return (
                  <tr key={index}>
                    <td>{user.name}</td>
                    <td>{user.scheduleType}</td>
                    <td>{user.whatsappNumber}</td>
                    <td>
                      <button onClick={() => toggleFullScreen(paymentSlipSrc)}>
                        <img
                          src={paymentSlipSrc}
                          alt="payment-slip"
                          style={{ height: '50px', width: '50px' }}
                        />
                      </button>
                    </td>
                    <td style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      {

                        user.workouts[0] ? 
                        <FontAwesomeIcon icon={faCircleCheck} color='green'/>: <FontAwesomeIcon icon={faCircleXmark} color='red'/>
                      }
                    </td>
                    <td>
                      <button>
                        <Link to={`/createworkout/${user._id}`}>More info</Link>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {fullScreenImage && (
          <div className="fullscreen-overlay" onClick={closeFullScreen}>
            <img src={fullScreenImage} alt="Full Screen" className="fullscreen-image" />
          </div>
        )}
      </div>
    </div>
  );
};
