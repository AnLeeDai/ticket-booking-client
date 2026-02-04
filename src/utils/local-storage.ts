const TOKEN_KEY = "access_token";
const TOKEN_TYPE_KEY = "token_type";
const USER_ROLE_KEY = "user_role";

function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
}

function getLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error getting localStorage:", error);
    return null;
  }
}

function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing localStorage:", error);
  }
}

function setToken(token: string): void {
  setLocalStorage(TOKEN_KEY, token);
}

function getToken(): string | null {
  return getLocalStorage<string>(TOKEN_KEY);
}

function removeToken(): void {
  removeLocalStorage(TOKEN_KEY);
  removeLocalStorage(TOKEN_TYPE_KEY);
  removeLocalStorage(USER_ROLE_KEY);
}

function setTokenType(tokenType: string): void {
  setLocalStorage(TOKEN_TYPE_KEY, tokenType);
}

function getTokenType(): string | null {
  return getLocalStorage<string>(TOKEN_TYPE_KEY);
}

function setUserRole(role: string): void {
  setLocalStorage(USER_ROLE_KEY, role);
}

function getUserRole(): string | null {
  return getLocalStorage<string>(USER_ROLE_KEY);
}

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  setToken,
  getToken,
  removeToken,
  setTokenType,
  getTokenType,
  setUserRole,
  getUserRole,
  TOKEN_KEY,
  TOKEN_TYPE_KEY,
  USER_ROLE_KEY,
};
