import { useState, useEffect } from "react";
import { Lock, LogIn, Loader, Phone, Eye, EyeOff } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { getApiBaseUrl } from "../lib/api";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        phone: phoneDigits,
        password,
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${getApiBaseUrl()}/auth/google`;
  };

  return (
    <div
      id="loginPage"
      data-testid="login-page"
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4"
    >
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              id="loginTitle"
              data-testid="login-title"
              className="text-3xl font-bold text-green-400"
            >
              DSA Challenger Login
            </h1>
          </div>

          {/* Login Form */}
          <form
            id="loginForm"
            data-testid="login-form"
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* Phone */}
            <div>
              <label htmlFor="phoneInputField">Phone Number</label>
              <input
                id="phoneInputField"
                data-testid="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                placeholder="10-digit phone number"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="passwordInputField">Password</label>
              <div className="relative">
                <input
                  id="passwordInputField"
                  data-testid="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg"
                />
                <button
                  id="togglePasswordVisibilityButton"
                  data-testid="toggle-password-visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2">
              <input
                id="rememberMeCheckbox"
                data-testid="remember-me-checkbox"
                type="checkbox"
                disabled={isLoading}
              />
              Remember me
            </label>

            {/* Login Button */}
            <button
              id="loginButton"
              data-testid="login-button"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-green-600 rounded-lg flex justify-center"
            >
              {isLoading ? <Loader className="animate-spin" /> : <LogIn />}
              <span className="ml-2">
                {isLoading ? "Logging in..." : "Login"}
              </span>
            </button>
          </form>

          {/* Google Login */}
          <button
            id="googleLoginButton"
            data-testid="google-login-button"
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-6 py-3 bg-white text-black rounded-lg"
          >
            Login with Google
          </button>

          {/* Signup Link */}
          <p className="text-center mt-6">
            <a
              id="signupLink"
              data-testid="signup-link"
              href="/signup"
              className="text-green-400"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
