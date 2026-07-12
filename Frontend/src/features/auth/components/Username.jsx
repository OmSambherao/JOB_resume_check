import React from 'react'

function Username({username , setUsername}) {
  return (
   <div className="flex flex-col gap-2">
      <label htmlFor="username" className="text-sm font-medium text-gray-300">
        UserName
      </label>

      <input
        type="text"
        name="username"
        id="username"
        placeholder="Enter your name"
        onChange={(e)=>{
          setUsername( e.target.value);
        }}
        className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-gray-500"
      />
    </div>
  )
}

export default Username