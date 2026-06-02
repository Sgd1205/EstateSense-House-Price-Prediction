import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";

function Auth(){

const navigate = useNavigate();
const [isLogin,setIsLogin] = useState(true);

const [form,setForm] = useState({
name:"",
email:"",
password:""
});

const [error,setError] = useState("");

const handleChange = (e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const validate = () => {

if(!form.email || !form.password){
return "All fields are required";
}

if(!form.email.includes("@")){
return "Invalid email format";
}

if(form.password.length < 6){
return "Password must be at least 6 characters";
}

if(!isLogin && !form.name){
return "Name is required";
}

return "";
};

const handleSubmit = async (e)=>{
e.preventDefault();

const err = validate();

if(err){
setError(err);
return;
}

setError("");

const endpoint = isLogin ? "/login" : "/register";
try {
  const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });

  const data = await response.json();

  if (response.ok) {
    if (isLogin) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    alert(data.message || "Success!");
    navigate(isLogin ? "/predict" : "/login");
  } else {
    setError(data.error || "An error occurred");
  }
} catch (error) {
  setError("Server error. Please check if the backend is running.");
}
};

return(

<div className="auth-wrapper">

<div className="auth-card">

<h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

<p>
{isLogin ? "Login to continue" : "Join the platform"}
</p>

<form onSubmit={handleSubmit}>

{!isLogin && (
<input
type="text"
name="name"
placeholder="Full Name"
onChange={handleChange}
/>
)}

<input
type="email"
name="email"
placeholder="Email"
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
onChange={handleChange}
/>

{error && <p className="error">{error}</p>}

<button type="submit">
{isLogin ? "Login" : "Register"}
</button>

</form>

<p
style={{marginTop:"15px",cursor:"pointer",color:"#4a335f"}}
onClick={()=>setIsLogin(!isLogin)}
>
{isLogin
? "Don't have an account? Register"
: "Already have an account? Login"}
</p>

</div>

</div>

);

}

export default Auth;