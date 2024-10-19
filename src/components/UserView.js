import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import '../css/Admincss.css';

const UserView = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [bidCost, setBidCost] = useState('');
  const [notification, setNotification] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  // Fetch tenders from API
  const fetchTenders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tenders');
      console.log(response.data);
      setTenders(response.data);
    } catch (error) {
      console.error("Error fetching tenders:", error);
    }
  };

  useEffect(() => {
    fetchTenders(); // Fetch tenders on component mount
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTenderId) {
      alert("Please select a tender.");
      return;
    }
    if (bidCost <= 0) {
      alert("Please enter a valid bid cost.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/tenders/${selectedTenderId}/bid`, {
        company_name: companyName,
        bid_cost: bidCost,
      });
      setCompanyName(''); // Reset form fields
      setBidCost('');
      setSubmissionMessage("Quotation submitted successfully!");
      await fetchTenders(); // Refresh the tenders list after submission
    } catch (error) {
      console.error("Error submitting quotation:", error);
      setSubmissionMessage("Error submitting quotation.");
    }
  };

  // Notification for tenders about to close
  useEffect(() => {
    const checkNotifications = () => {
      const currentTime = new Date().getTime();
      tenders.forEach(tender => {
        const endTime = new Date(tender.endTime).getTime();
        const bufferTime = tender.bufferTime * 60000; // Convert buffer time to milliseconds
        if (endTime - currentTime <= 5 * 60 * 1000 && endTime - currentTime > 0) {
          setNotification(`Tender "${tender.name}" is ending in less than 5 minutes!`);
        }
      });
    };

    checkNotifications(); // Check immediately on load
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [tenders]);

  // Table columns for react-table
  const columns = useMemo(
    () => [
      {
        Header: 'Tender Name',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Start Time',
        accessor: 'startTime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'End Time',
        accessor: 'endTime',
        Cell: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        Header: 'Lowest Quote',
        accessor: 'lowestBid',
        Cell: ({ value }) => {
          return value ? `$${parseFloat(value).toFixed(2)}` : 'No bids placed yet.';
        },
      },
    ],
    []
  );

  const data = useMemo(() => tenders, [tenders]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    <div className="user-view card" style={{ padding: '20px' }}>
      <h1>Available Tenders</h1>
      {notification && <div className="notification">{notification}</div>}
      {submissionMessage && <div className="submission-message">{submissionMessage}</div>}

      {/* Render tenders table using react-table */}
      <table {...getTableProps()} className="tender-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={column.isSorted ? (column.isSortedDesc ? 'sort-desc' : 'sort-asc') : ''}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ textAlign: 'center' }}>Submit Quotation</h2>

      <form
        onSubmit={handleSubmit}
        className="quotation-form"
        style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
      >
        <div className="row">
          <div className="form-group col-md-3" style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Select Tender:</label>
            <select
              id="tenderSelect"
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
              style={{ width: '150px', height: '39px', borderColor: '#cbcbcb', borderRadius: '3px' }}
            >
              <option value="">Select a tender</option>
              {tenders.map((tender) => (
                <option key={tender.id} value={tender.id}>
                  {tender.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-3" style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Company Name:</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="company-name-input"
              style={{ width: '150px', height: '40px' }}
            />
          </div>
          <div className="form-group col-md-3" style={{ display: 'flex', flexDirection: 'column' }}>
            <label>Bid Cost:</label>
            <input
              type="number"
              value={bidCost}
              onChange={(e) => setBidCost(e.target.value)}
              required
              className="bid-cost-input"
              style={{ width: '150px', height: '40px' }}
            />
          </div>
          <button
            type="submit"
            className="submit-button col-md-3"
            style={{ marginTop: '27px', height: '40px', lineHeight:'20px', borderRadius: '6px' ,backgroundColor:'#0d6efd'}}
          >
            Submit Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserView;
