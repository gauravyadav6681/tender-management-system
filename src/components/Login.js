import React, { useState } from 'react';
import axios from 'axios'; // Axios for API requests
import '../css/form.css'; // Importing plain CSS

function Login() {
  const [option, setOption] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    repeatPassword: ''
  });

  // Handle form data changes
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const { email, password, repeatPassword } = formData;

    try {
      if (option === 1) {
        // Sign in
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password
        });
        const { role } = response.data;
        if (role === 'admin') {
          window.location.href = '/admin';
        } else if (role === 'user') {
          window.location.href = '/user';
        }
      } else if (option === 2) {
        // Sign up
        if (password !== repeatPassword) {
          alert('Passwords do not match');
          return;
        }
        await axios.post('http://localhost:5000/api/users/signup', {
          email,
          password
        });
        alert('User registered successfully');
      } else if (option === 3) {
        // Reset password
        await axios.post('http://localhost:5000/reset-password', {
          email
        });
        alert('Password reset link sent to your email');
      }
    } catch (error) {
      console.error('Error during form submission', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className='container'>
      <header>
        <div className={`header-headings ${option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot')}`}>
          <span>Sign in to your account</span>
          <span>Create an account</span>
          <span>Reset your password</span>
        </div>
      </header>
      <ul className='options'>
        <li className={option === 1 ? 'active' : ''} onClick={() => setOption(1)}>Sign in</li>
        <li className={option === 2 ? 'active' : ''} onClick={() => setOption(2)}>Sign up</li>
        <li className={option === 3 ? 'active' : ''} onClick={() => setOption(3)}>Forgot</li>
      </ul>
      <form className='account-form' onSubmit={handleSubmit}>
        <div className={`account-form-fields ${option === 1 ? 'sign-in' : (option === 2 ? 'sign-up' : 'forgot')}`}>
          <input
            id='email'
            name='email'
            type='email'
            placeholder='E-mail'
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            id='password'
            name='password'
            type='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            required={option === 1 || option === 2}
            disabled={option === 3}
          />
          <input
            id='repeat-password'
            name='repeatPassword' // Updated to match the state key
            type='password'
            placeholder='Repeat password'
            value={formData.repeatPassword}
            onChange={handleChange}
            required={option === 2}
            disabled={option === 1 || option === 3}
          />
        </div>
        <button className='btn-submit-form' type='submit'>
          {option === 1 ? 'Sign in' : (option === 2 ? 'Sign up' : 'Reset password')}
        </button>
      </form>
    </div>
  );
}

export default Login;
