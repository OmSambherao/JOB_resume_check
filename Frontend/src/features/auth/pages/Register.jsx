import React from "react";
import Email from "../components/Email";
import Password from "../components/Password";
import Username from "../components/Username";
import Button from "../components/Button";
import { Link } from "react-router";
import Loading from "../components/Loading";
import { useAuth } from "../Hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { loading, handleRegister } = useAuth();

  const handelSubmit = async (e) => {
    e.preventDefault();

    await handleRegister({ username, email, password });
    navigate("/");
  };

  
  return (
    <div className="flex align-middle items-center justify-center h-screen bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-semibold text-white">
          Register Page
        </h3>

        <form action="" className="flex flex-col gap-4" onSubmit={handelSubmit}>
          <Username username={username} setUsername={setUsername} />
          <Email email={email} setEmail={setEmail} />
          <Password password={password} setPassword={setPassword} />
          <Button text="Register" />
        </form>

        <div className="text-white pt-5 flex justify-between mx-4">
          <h1 className=" font-light ">already have an account ? </h1>
          <Link to="/login" className="text-blue-400">
            {" "}
            Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;