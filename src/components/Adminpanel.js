import React, { useState, useEffect, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';
import { createTender, getTenders, getBids } from '../services/api';
import '../css/Admincss.css';

const AdminPanel = () => {
  const [tenders, setTenders] = useState([]);
  const [bids, setBids] = useState([]);
  const [newTender, setNewTender] = useState({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    bufferTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [loadingBids, setLoadingBids] = useState(true);
  const [message, setMessage] = useState('');
  const [view, setView] = useState('create');
  const tableRef = useRef();

  useEffect(() => {
    fetchTenders();
    fetchBids();
  }, []);

  useEffect(() => {
    if (view === 'view' && tenders.length > 0) {
      $(tableRef.current).DataTable().clear().destroy();
      $(tableRef.current).DataTable({
        data: tenders,
        columns: [
          { title: 'Tender Name', data: 'name' },
          { title: 'Description', data: 'description' },
          { title: 'Start Time', data: 'startTime', render: (data) => new Date(data).toLocaleString() },
          { title: 'End Time', data: 'endTime', render: (data) => new Date(data).toLocaleString() },
          { title: 'Buffer Time (minutes)', data: 'bufferTime' },
        ],
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: true,
      });
    }
  }, [view, tenders]);

  useEffect(() => {
    if (view === 'bids' && bids.length > 0) {
      //alert("hii");
      $(tableRef.current).DataTable().clear().destroy();
      $(tableRef.current).DataTable({
        data: bids,
        columns: [
          { title: 'Company Name', data: 'company_name' },
          { title: 'Tender Name', data: 'tender_name' }, // Add Tender Name here
          { title: 'Bid Time', data: 'bid_time', render: (data) => new Date(data).toLocaleString() },
          { title: 'Bid Cost', data: 'bid_cost' },
          { title: 'Placed in Last 5 Minutes', data: 'placedInLast5Minutes', render: (data) => (data ? 'Yes' : 'No') }
        ],
        destroy: true,
        paging: true,
        searching: true,
        ordering: true,
        info: true,
      });
    }
  }, [view, bids]);

  const fetchTenders = async () => {
    try {
      const { data } = await getTenders();
      console.log('Fetched Tenders:', data);
      setTenders(data);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const { data } = await getBids();
      console.log('Fetched Bids:', data);
      setBids(data.bids || []); // Update to use structured response
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setLoadingBids(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTender({ ...newTender, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault(); 
    if (!newTender.name || !newTender.description || !newTender.startTime || !newTender.endTime || !newTender.bufferTime) {
      setMessage('Please fill out all fields!');
      return;
    }

    if (newTender.startTime >= newTender.endTime) {
      setMessage('End time must be after start time.');
      return;
    }

    try {
      await createTender(newTender);
      setMessage('Tender created successfully!');
      fetchTenders();
      setNewTender({ name: '', description: '', startTime: '', endTime: '', bufferTime: '' });
    } catch (error) {
      console.error('Error creating tender:', error);
      setMessage('Error creating tender. Please try again.');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 bg-light sidebar">
          <h4 className="text-center" style={{ padding: '14px' }}>Admin Panel</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setView('create')}>Create New Tender</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setView('view')}>View Previous Tenders</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn" onClick={() => setView('bids')}>View Bids</button>
            </li>
          </ul>
        </nav>

        <main className="col-md-9">
          {view === 'create' && (
            <div className="form-wrap">
              <h4 className="text-center" style={{ padding: '14px' }}>Create New Tender</h4>
              <form id="tender-form" onSubmit={handleCreate}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="name-label" htmlFor="name">Tender Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter tender name"
                        className="form-control"
                        value={newTender.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="description-label" htmlFor="description">Tender Description</label>
                      <input
                        type="text"
                        name="description"
                        id="description"
                        placeholder="Enter tender description"
                        className="form-control"
                        value={newTender.description}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="start-time-label" htmlFor="startTime">Start Time</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        id="startTime"
                        className="form-control"
                        value={newTender.startTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="end-time-label" htmlFor="endTime">End Time</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        id="endTime"
                        className="form-control"
                        value={newTender.endTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label id="buffer-time-label" htmlFor="bufferTime">Buffer Time (minutes)</label>
                      <input
                        type="number"
                        name="bufferTime"
                        id="bufferTime"
                        placeholder="Enter buffer time in minutes"
                        className="form-control"
                        value={newTender.bufferTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <button type="submit" className="btn btn-primary" style={{marginTop:'9%'}}>Create Tender</button>
                  </div>
                </div>
              </form>
              {message && <p className="text-danger">{message}</p>}
            </div>
          )}

          {view === 'view' && !loading && (
            <div className="tender-table card " style={{padding:'17px'}}>
              <h4 className="text-center" style={{ padding: '14px' }}>Previous Tenders</h4>
              <table ref={tableRef} className="display">
                <thead>
                  <tr>
                    <th>Tender Name</th>
                    <th>Description</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Buffer Time (minutes)</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          )}

          {view === 'bids' && !loadingBids && (
            <div className="bid-table card " style={{padding:'17px'}}>
              <h4 className="text-center" style={{ padding: '14px' }}>Bids</h4>
              <table ref={tableRef} className="display">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Tender Name</th>
                    <th>Bid Time</th>
                    <th>Bid Cost</th>
                    <th>Placed in Last 5 Minutes</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
