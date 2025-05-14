document.addEventListener('DOMContentLoaded', () => {
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');
  const loginForm = document.getElementById('loginForm');
  const submitBtn = document.getElementById('submitBtn');

  // Tab Switching
  loginTab.addEventListener('click', () => {
    loginForm.reset();
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    submitBtn.textContent = 'Log in';
  });

  signupTab.addEventListener('click', () => {
    loginForm.reset();
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    submitBtn.textContent = 'Sign up';
  });

  // Form Submit Handler
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    if (submitBtn.textContent === 'Log in') {
      // Get stored credentials
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        alert('Login successful!');
        window.location.href = 'index.html'; // Redirect to product page
      } else {
        alert('Invalid email or password.');
      }

    } else {
      // Sign-up: Save credentials
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      alert('Sign-up successful! You can now log in.');
      loginTab.click(); // Switch to login tab
    }
  });
});
