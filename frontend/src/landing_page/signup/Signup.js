import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3002";

function Signup() {
  const [isLogin, setIsLogin] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("Submitting:", { name, email, mobile, password });

    try {
      let res;
      if (isLogin) {
        res = await axios.post(`${API_URL}/auth/login`, { email, password });
      } else {
        res = await axios.post(`${API_URL}/auth/signup`, { name, email, mobile, password });
      }
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = `http://localhost:3001?token=${res.data.token}`;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="border rounded-3 shadow-sm p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <img src="/media/images/logo.svg" alt="Zerodha logo" style={{ width: "120px" }} />
            </div>

            <div className="d-flex mb-4 border rounded-2 overflow-hidden">
              <button className={`btn w-50 rounded-0 ${!isLogin ? "btn-primary" : "btn-light"}`}
                onClick={() => { setIsLogin(false); setError(""); }} type="button">
                Create Account
              </button>
              <button className={`btn w-50 rounded-0 ${isLogin ? "btn-primary" : "btn-light"}`}
                onClick={() => { setIsLogin(true); setError(""); }} type="button">
                Login
              </button>
            </div>

            <h5 className="fw-semibold mb-1">{isLogin ? "Welcome back!" : "Open a free account"}</h5>
            <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
              {isLogin ? "Login to access your Zerodha dashboard" : "Invest in stocks, F&O, mutual funds and more"}
            </p>

            {error && <div className="alert alert-danger py-2" style={{ fontSize: "14px" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-medium">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter your full name"
                    value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label fw-medium">Email Address</label>
                <input type="email" className="form-control" placeholder="Enter your email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {!isLogin && (
                <div className="mb-3">
                  <label className="form-label fw-medium">Mobile Number</label>
                  <input type="tel" className="form-control" placeholder="Enter your 10-digit mobile number"
                    value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                </div>
              )}
              <div className="mb-3">
                <label className="form-label fw-medium">Password</label>
                <input type="password" className="form-control"
                  placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                  value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Please wait..." : isLogin ? "Login to Account" : "Create Account"}
                </button>
              </div>
            </form>

            <div className="d-flex align-items-center my-4">
              <hr className="flex-grow-1" />
              <span className="px-2 text-muted" style={{ fontSize: "13px" }}>or</span>
              <hr className="flex-grow-1" />
            </div>

            <p className="text-center mb-0" style={{ fontSize: "14px" }}>
              {isLogin ? (
                <>Don't have an account?{" "}
                  <button className="btn btn-link p-0 fw-medium" style={{ fontSize: "14px" }}
                    onClick={() => { setIsLogin(false); setError(""); }}>Sign up for free</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button className="btn btn-link p-0 fw-medium" style={{ fontSize: "14px" }}
                    onClick={() => { setIsLogin(true); setError(""); }}>Login here</button>
                </>
              )}
            </p>
          </div>

          <p className="text-center text-muted mt-3" style={{ fontSize: "12px" }}>
            By continuing, you agree to Zerodha's{" "}
            <Link to="/" className="text-decoration-none">Terms of Service</Link> and{" "}
            <Link to="/" className="text-decoration-none">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;