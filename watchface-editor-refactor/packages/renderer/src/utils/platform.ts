export const getOs = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('window')) {
    return 'win32';
  } else if (userAgent.includes('mac os x')) {
    return 'darwin';
  } else if (userAgent.includes('linux')) {
    return 'linux';
  } else {
    return;
  }
};

export const isMac = () => getOs() == 'darwin';
