import { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Board from './components/Board/Board';
import { status, priorities } from './utils/data';

function App() {
  // State variables to store tickets and users data
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  // Retrieve selected group and order from local storage
  const defaultGroup = localStorage.getItem('selectedGroup');
  const defaultOrder = localStorage.getItem('selectedOrder');

  // State variables to manage grouping and ordering, with default values
  const [group, setGroup] = useState(defaultGroup ? defaultGroup : 'status');
  const [order, setOrder] = useState(defaultOrder ? defaultOrder : 'priority');

  // Handler to update group and save selected group to local storage
  const handleGroupChange = (groupSelected) => {
    setGroup(groupSelected);
    localStorage.setItem("selectedGroup", groupSelected);
  };

  // Handler to update order and save selected order to local storage
  const handleOrderChange = (orderSelected) => {
    setOrder(orderSelected);
    localStorage.setItem("selectedOrder", orderSelected);
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Async function to fetch tickets and users data from an API
  const fetchData = async () => {
    try {
      const res = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await res.json();
      setTickets(data.tickets); // Set the fetched tickets data
      setUsers(data.users);     // Set the fetched users data
    } catch (error) {
      console.log("Unable to fetch data! ", error);
    }
  };

  return (
    <div className="App scroll-container">
      {/* Navbar component with props for grouping and ordering */}
      <Navbar group={group} order={order} onGroupchange={handleGroupChange} onOrderChange={handleOrderChange} />

      <div className='boards_container'>
        <div className='app_boards'>
          {/* Render Board components based on the selected group */}
          {
            group === 'status' && status.map((opt, id) => (
              <Board order={order} data={opt} key={id} tickets={tickets} users={users} group={group} />
            ))
          }
          {
            group === 'user' && users.map((opt) => (
              <Board order={order} data={opt} key={opt.id} tickets={tickets} users={users} group={group} userId={opt?.id} />
            ))
          }
          {
            group === 'priority' && priorities.map((opt, id) => (
              <Board order={order} data={opt} level={id} key={id} tickets={tickets} users={users} group={group} />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
