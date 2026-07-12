import React from "react";

function Button({ text }) {
  return (
    <button
      type="submit"
      className="mt-2 rounded-lg bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-200 active:scale-95"
    >
      {text}
    </button>
  );
}

export default Button;
