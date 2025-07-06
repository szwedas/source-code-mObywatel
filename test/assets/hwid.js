function getHWID() {
    return btoa(navigator.userAgent + navigator.language + navigator.platform);
  }
  
  export { getHWID };
  