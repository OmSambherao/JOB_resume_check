import React from "react";
import { useState } from "react";

function Email( {email , setEmail}) {
  
  

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="email" className="text-sm font-medium text-gray-300">
        Email
      </label>

      <input
        type="email"
        name="email"
        id="email"
        onChange={(e)=>{
          setEmail(e.target.value);
        }}
        placeholder="Enter your Email"
        className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-500"
      />
    </div>
  );
}

export default Email;
