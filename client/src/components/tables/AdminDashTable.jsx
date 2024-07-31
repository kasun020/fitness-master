import './adminDashTable.css';
import { useGlobalContext } from "../../contexts/GlobalContext";

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
            {users.data.map((schedule, index) => (
              <tr key={index}>
                <td>{schedule.name}</td>
                <td>{schedule.scheduleType}</td>
                <td>{schedule.age}</td>
                <td>{schedule.gender}</td>
                <td>{schedule.weight}</td>
                <td>{schedule.paymentSlip.name}</td>
                <td>{schedule.workout}</td>
                <td>
                  <button onClick={() => getAll()}>
                    More info
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
