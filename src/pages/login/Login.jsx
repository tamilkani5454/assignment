import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const [logState, setLogState] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [fakeUser, setFakeUser] = useState({
    email: "demo@gmail.com",
    password: "Admin@123"
  })
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "demo@gmail.com",
    password: "Admin@123"
  })
  const sendInfo = () => {
    let Data;
    if (logState == "login") {
      if (!user.email || !user.password) {
        toast.error("Fill all the Feilds")
        return
      }
      Data = {
        email: user.email,
        password: user.password,
      }
      if (Data.email != fakeUser.email) {
        toast.error("enter correct email address :use demo login credential,if alredy change any demo credential please refresh the page ")
        return
      }
      if (Data.password != fakeUser.password) {
        return toast.error("enter correct password :use demo login credential, if alredy change any demo credential please refresh the page")
      }
      localStorage.setItem("token", "KANI54545454")
      navigate("/products")
      toast.success("login success")
      return
    }
    if (logState == "signUp") {
      if (!user.email || !user.password || !user.name || !user.phone) {
        toast.error("Fill all the Feilds")
        return
      }
      Data = user
      console.log(logState + " function activated")
      return
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{logState == "login" ? "Welcome Back" : "Create ACcount"}</h1>
          <p>Please enter your details to <span>{logState == "login" ? "sign in" : "sign up"}</span></p>
        </div>
        <div className="login-form">
          {logState != "login" ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  type="tel"
                  id="phone"
                  placeholder="9876543210"
                  required
                />
              </div>
            </>
          ) : null}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              type="email"
              id="email"
              placeholder="fakturera@gmail.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                required
              />
              <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>
          {logState == "login" ? (
            <>
              <div className="form-options">
                <p>Forgot password?
                  <a href="#" className="forgot-password"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={{ textDecorationLine: hover ? "underline" : "none" }}>Click Here</a></p>
              </div>
            </>
          ) : null}
          <button type="submit" className="login-button" onClick={sendInfo}>{logState == "login" ? "Login" : "SignUp"}</button>
        </div>
        <div className="login-footer">
          <p>{logState == "login" ? "Don't have an account?" : "Already have Account?"} <a href="#" onClick={() => {
            if (logState == "login") {
              setLogState("signUp")
            } else {
              setLogState("login")
            }
          }}>{logState == "login" ? "Create one" : "Click Here"}</a></p>
        </div>
      </div>
    </div >
  );
};

export default Login;
