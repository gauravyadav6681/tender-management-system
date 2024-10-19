import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export const createTender = (tenderData) => API.post('/tenders', tenderData);
export const getTenders = () => API.get('/gettenders');
export const submitBid = (id, bidData) => API.post(`/tenders/${id}/bid`, bidData);
export const getLowestBid = (id) => API.get(`/tenders/${id}/bid`);
export const getBids = () => API.get('/getbids');
