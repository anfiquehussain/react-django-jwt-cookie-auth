import React from 'react';

function Title() {
  return (
    <div className='text-center my-8 bg-secondary-200 dark:bg-secondary-200 p-6 rounded-xl'>
      <h1 className='text-4xl font-extrabold text-text dark:text-text'>React Django JWT Cookie Authentication</h1>
      <p className='text-lg text-primary dark:text-primary mt-2 text-text-500 dark:text-text-500'>
        A simple example of JWT authentication with React and Django
      </p>
      <h1 className='text-xl mt-4 text-start' >How it works</h1>
      <p className='text-left text-primary dark:text-primary mt-6 leading-relaxed'>
        When you create an account or log in on our website, the backend server verifies your username and password. If everything is correct, it generates special tokens called JWT tokens (JSON Web Tokens). These tokens act like a digital ID card proving you are who you say you are. Instead of sending these tokens back to you in a way that your browser’s JavaScript can easily access, the backend stores them securely inside HTTP-only cookies — this keeps them safe from hackers and scripts running on your browser. Along with these tokens, the backend also sends a CSRF token, which protects the website against malicious actions by ensuring requests are really coming from you and not an attacker.
        <br /><br />
        On the frontend (the React app you see), the app loads and asks the backend if you are already logged in by checking these tokens hidden in the cookies. It sends requests including these cookies automatically, so you stay logged in without needing to enter your password every time. When you perform sensitive actions like submitting forms, the frontend includes the CSRF token in the request headers, ensuring that the backend knows the request is legitimate.
        <br /><br />
        If the JWT access token expires, the frontend automatically asks the backend to refresh it behind the scenes, so your session stays alive seamlessly. All this communication happens quietly between your browser and the backend through secure API calls managed by Axios with cookies and CSRF tokens. This keeps your login session secure, smooth, and protects you from common web attacks, while allowing you to browse and use the app normally.
      </p>
    </div>
  );
}

export default Title;
