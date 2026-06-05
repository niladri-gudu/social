export const authStorage = {
  getAccessToken() {
    return localStorage.getItem("accessToken");
  },

  setAccessToken(token: string) {
    localStorage.setItem("accessToken", token);
  },

  removeAccessToken() {
    localStorage.removeItem("accessToken");
  },

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  },

  setRefreshToken(token: string) {
    localStorage.setItem("refreshToken", token);
  },

  removeRefreshToken() {
    localStorage.removeItem("refreshToken");
  },

  clear() {
    localStorage.removeItem("accessToken");

    localStorage.removeItem("refreshToken");
  },
};
