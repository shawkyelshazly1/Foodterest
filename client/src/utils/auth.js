// Helper function to retrieve access token from local storage
exports.getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

// Helper function to set access token in local storage
exports.setAccessToken = (token) => {
  return localStorage.setItem("accessToken", token);
};
