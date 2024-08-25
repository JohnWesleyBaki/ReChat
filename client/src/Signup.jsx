// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     console.log({ name, email, password });
//     axios
//       .post("http://localhost:5050/users/register", { name, email, password })
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//     alert("user created redirection g to login");
//     navigate("/login");
//   };

//   return (
//     <div className="container m-4 p-4">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <form onSubmit={handleSubmit}>
//             <h2 className="mb-4">Sign Up</h2>
//             <div className="form-group">
//               <label htmlFor="name">Name:</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="email">Email:</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label htmlFor="password">Password:</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="form-control"
//                 required
//               />
//             </div>

//             <button type="submit" className="btn btn-primary btn-block">
//               Register
//             </button>
//           </form>
//           <p>Already Have an Account</p>
//           <Link to="/login" className="btn btn-secondary btn-block mt-3">
//             Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5050/users/register", {
        name,
        email,
        password,
      });
      console.log({
        name,
        email,
        password,
      });
      alert("User created, redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("Sign-up error:", err.response?.data || err.message);
      setError(
        "Sign-up failed: " + (err.response?.data.message || err.message)
      );
    }
  };

  return (
    <div className="container m-4 p-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <h2 className="mb-4">Sign Up</h2>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}{" "}
            {/* Display error */}
            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>
          </form>
          <p>Already Have an Account?</p>
          <Link to="/login" className="btn btn-secondary btn-block mt-3">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
