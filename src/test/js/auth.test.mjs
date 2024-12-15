//javascript
// Necessary imports
// import { describe, it, expect, vi } from "vitest";
import { login, checkLogin } from "../../js/auth.mjs";
import { loginRequest } from "../../js/externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "../../js/utils.mjs";
import * as jwtDecodeLib from "jwt-decode";

// Mocks
vi.mock('../../js/externalServices.mjs', () => ({
  loginRequest: vi.fn()
}));
vi.mock('../../js/utils.mjs', () => ({
  alertMessage: vi.fn(),
  getLocalStorage: vi.fn(),
  setLocalStorage: vi.fn()
}));
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}));
vi.stubGlobal('window', {
  location: {
    href: '',
    pathname: '/current',
    assign: vi.fn()
  },
  scrollTo: vi.fn()
});
vi.stubGlobal('localStorage', {
  removeItem: vi.fn()
});

describe('login', () => {
  it('should set token and redirect on successful login', async () => {
    const creds = { username: "user", password: "pass" };
    const token = "mock-token";
    loginRequest.mockResolvedValue(token);
    await login(creds);
    expect(setLocalStorage).toHaveBeenCalledWith("so-token", token);
    expect(window.location).toBe("/");
  });

  it('should alert error message on login failure', async () => {
    const creds = { username: "user", password: "pass" };
    const error = new Error("Login failed");
    loginRequest.mockRejectedValue({ message: error });
    await login(creds);
    expect(alertMessage).toHaveBeenCalledWith("Login failed");
  });

  it('should redirect to a custom redirect path on successful login', async () => {
    const creds = { username: "user", password: "pass" };
    const token = "mock-token";
    const redirectPath = "/dashboard";
    loginRequest.mockResolvedValue(token);
    await login(creds, redirectPath);
    expect(window.location).toBe(redirectPath);
  });
});

describe('checkLogin', () => {
  it('should return token if it is valid', () => {
    const token = "valid-token";
    getLocalStorage.mockReturnValue(token);
    const decodedToken = { exp: (Date.now() / 1000) + 1000 };
    jwtDecodeLib.jwtDecode.mockReturnValue(decodedToken);

    const result = checkLogin();
    expect(result).toBe(token);
  });

  it('should redirect to login page if token is invalid', () => {
    getLocalStorage.mockReturnValue("invalid-token");
    const decodedToken = { exp: (Date.now() / 1000) - 1000 };
    jwtDecodeLib.jwtDecode.mockReturnValue(decodedToken);

    checkLogin();
    expect(localStorage.removeItem).toHaveBeenCalledWith("so-token");
    expect(window.location).toBe(`/login/index.html?redirect=${window.location.pathname}`);
  });

  it('should redirect if no token is found', () => {
    getLocalStorage.mockReturnValue(undefined);

    checkLogin();
    expect(localStorage.removeItem).toHaveBeenCalledWith("so-token");
    expect(window.location).toBe(`/login/index.html?redirect=${window.location.pathname}`);
  });
});
//