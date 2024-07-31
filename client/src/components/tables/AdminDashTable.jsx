import './adminDashTable.css';
import { useGlobalContext } from "../../contexts/GlobalContext";
import { Link } from 'react-router-dom';

export const AdminDashTable = () => {

  const {
    getAll,
    users
  } = useGlobalContext();


 

  return (
    <div className="admin-dash-table-container">
      <button onClick={() => getAll()}>click me</button>
      <div className="container mt-5">
        {
          users &&
          <table className="schedule-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Schedule Type</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Weight(KG)</th>
              <th>Payment Slip</th>
              <th>Workout</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.scheduleType}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.weight}</td>
                <td>{user.paymentSlip.name}</td>
                <td>{user.workout}</td>
                <td>
                  <button>
                    <Link to={`/createworkout/${user._id}`}>More info</Link>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        }
      </div>
    </div>
  );
};
