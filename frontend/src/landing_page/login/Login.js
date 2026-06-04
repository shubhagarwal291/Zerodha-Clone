import React from "react";

function Login() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <h1 className="mb-4 text-center">Login</h1>

          <form>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;