import React from "react";

function Password( {Password , setPassword}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="password" className="text-sm font-medium text-gray-300">
        Password
      </label>

      <input
        type="password"
        name="password"
        id="password"

        onChange={(e) =>{
          setPassword(e.target.value);
        }}
        placeholder="Enter your Password"
        className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-500"
      />
    </div>
  );
}

export default Password;
