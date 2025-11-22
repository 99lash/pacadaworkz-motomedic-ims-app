export const loginUser = (username, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API network delay (e.g., 1 second)
    setTimeout(() => {
      
      // Define valid users based on your UI's demo credentials
      const users = [
        { username: 'superadmin', password: 'admin123', role: 'superadmin', name: 'Super Admin' },
        { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
        { username: 'staff', password: 'staff123', role: 'staff', name: 'Staff Member' }
      ];

      // Find user
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        // Simulate a successful response token and user data
        resolve({
          status: 200,
          data: {
            token: 'fake-jwt-token-12345',
            user: {
              username: user.username,
              role: user.role,
              name: user.name
            }
          }
        });
      } else {
        // Simulate an error response
        reject({
          status: 401,
          message: 'Invalid username or password'
        });
      }
    }, 1000); // 1000ms = 1 second delay
  });
};