// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = e.target;
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData);

//     console.log("Sending login data:", data);

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/users/login",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(response.data);
//       navigate("/home");
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="email" name="email" placeholder="Enter Email" required />
//         <input
//           type="password"
//           name="password"
//           placeholder="Enter Password"
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <p>Don't have an account?</p>
//       <button onClick={() => navigate("/")}>Signup</button>
//     </div>
//   );
// }

// export default Login;

// import React from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function Login() {
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = e.target;
//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData);

//     try {
//       const response = await axios.post(
//         "http://localhost:5050/users/login",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const { token } = response.data;
//       localStorage.setItem("token", token);
//       navigate("/chat");
//     } catch (error) {
//       console.error("Login error:", error.response?.data || error.message);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="email" name="email" placeholder="Enter Email" required />
//         <input
//           type="password"
//           name="password"
//           placeholder="Enter Password"
//           required
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <p>Don't have an account?</p>
//       <button onClick={() => navigate("/")}>Signup</button>
//     </div>
//   );
// }

// export default Login;

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      await login(data.email, data.password);
      navigate("/chat");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data.message || error.message));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Enter Email" required />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>Don't have an account?</p>
      <button onClick={() => navigate("/")}>Signup</button>
    </div>
  );
}

export default Login;
