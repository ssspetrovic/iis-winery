const profileRedirects = {
  ADMIN: (username) => `/admin-profile/${username}`,
  MANAGER: (username) => `/manager-profile/${username}`,
  CUSTOMER: (username) => `/customer-profile/${username}`,
  WINEMAKER: (username) => `/winemaker-profile/${username}`,
};

export default profileRedirects;
