import { useState } from "react";

function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleSubmit=(e)=>{
e.preventDefault();
alert("Registered!");
}

return(

<div className="auth-wrapper fade-in">

<div className="auth-card">

<h2>Create Account</h2>
<p>Join the platform</p>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Full Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

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

<button type="submit">
Register
</button>

</form>

</div>

</div>

)

}

export default Register;