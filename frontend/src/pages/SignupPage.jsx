"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!form.termsAccepted) {
      setError("Please accept terms & conditions");
      return;
    }

    try {
      setLoading(true);

      // 🔴 replace with real API call
      await new Promise((res) => setTimeout(res, 1000));

      console.log("Signup data:", form);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        data-testid="signup-form"
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-semibold mb-4">Create account</h1>

        {/* Name */}
        <input
          data-testid="signup-name-input"
          id="nameInputField"
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Phone */}
        <input
          data-testid="signup-phone-input"
          id="phoneInputField"
          type="tel"
          name="phone"
          placeholder="Phone number"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            data-testid="signup-password-input"
            id="passwordInputField"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            data-testid="signup-password-toggle"
            id="togglePasswordVisibilityButton"
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-3">
          <input
            data-testid="signup-confirm-password-input"
            id="confirmPasswordInputField"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            data-testid="signup-confirm-password-toggle"
            id="toggleConfirmPasswordVisibilityButton"
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Terms */}
        <label className="flex items-center mb-3 text-sm">
          <input
            data-testid="signup-terms-checkbox"
            id="termsConditionsCheckbox"
            type="checkbox"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange}
            className="mr-2"
          />
          I agree to the terms & conditions
        </label>

        {/* Error */}
        {error && (
          <p
            data-testid="signup-error-message"
            className="text-red-600 text-sm mb-3"
          >
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          id="signupButton"
          data-testid="signup-submit-button"
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        {/* Google Signup */}
        <button
          data-testid="signup-google-button"
          type="button"
          className="w-full mt-3 border py-2 rounded"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
