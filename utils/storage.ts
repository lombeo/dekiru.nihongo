export const saveUserData = (userData: { token: string }) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('token', userData.token);
};

export const clearUserData = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

