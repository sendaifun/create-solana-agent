// Shared state for auth handling
interface PrivyInstanceType {
  authenticated: boolean;
}

let privyInstance: PrivyInstanceType | null = null;
let loginModalCallback: (() => void) | null = null;

// Event names
export const AUTH_EVENTS = {
  SHOW_LOGIN_MODAL: 'SHOW_LOGIN_MODAL',
};

// Set the Privy instance for global use
export function setPrivyInstance(instance: PrivyInstanceType) {
  console.log('Setting Privy instance:', instance.authenticated);
  privyInstance = instance;
}

// Get the Privy instance
export function getPrivyInstance() {
  return privyInstance;
}

// Set the callback to run after login
export function setLoginCallback(callback: () => void) {
  loginModalCallback = callback;
}

// Get the callback to run after login
export function getLoginCallback() {
  return loginModalCallback;
}

// Clear the callback
export function clearLoginCallback() {
  loginModalCallback = null;
}

// Check if user is authenticated, if not trigger the login modal
export function checkAuthAndShowModal(callback?: () => void): boolean {
  console.log('Checking auth:', privyInstance?.authenticated);
  
  // Get real-time auth status if available (for routes where Privy hooks are used)
  // This helps prevent showing the modal when already authenticated
  const isAuthenticated = typeof window !== 'undefined' && 
    (window as any).__PRIVY_TEMP_AUTH_CHECK__?.authenticated || 
    privyInstance?.authenticated;
  
  if (!isAuthenticated) {
    console.log('Not authenticated, showing modal');
    if (callback) {
      console.log('Setting callback for after login');
      setLoginCallback(callback);
    }
    
    // Trigger event to show login modal
    if (typeof window !== 'undefined') {
      console.log('Dispatching show login modal event');
      window.dispatchEvent(new CustomEvent(AUTH_EVENTS.SHOW_LOGIN_MODAL));
    }
    
    return false;
  }
  
  console.log('Already authenticated');
  return true;
} 