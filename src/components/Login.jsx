import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(){

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [error,setError] = useState("");

const handleSubmit = (e)=>{
e.preventDefault();

if(email === "" || password === ""){
setError("Please fill all fields");
return;
}

navigate("/dashboard");
};

return(

<div className="auth-wrapper fade-in">

<div className="auth-card">

<h2>Welcome Back</h2>
<p>Login to continue</p>

<form onSubmit={handleSubmit}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

{error && <span className="error">{error}</span>}

<button type="submit">Login</button>

</form>

</div>

</div>

)

}

export default Login;