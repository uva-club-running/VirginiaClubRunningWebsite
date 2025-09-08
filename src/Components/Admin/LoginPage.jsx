import { useState } from "react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-darkblue-500 text-white font-franklin">
      <div className="w-full max-w-md rounded-2xl bg-vablue-500 p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-franklin text-vaorange-500">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-vaorange-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-vaorange-500 bg-darkblue px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
              placeholder="you@virginia.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-vaorange-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-vaorange-500 bg-darkblue px-3 py-2 text-white placeholder-gray-400 focus:border-vaorange-500 focus:ring-2 focus:ring-vaorange-500"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-vaorange-500 py-2 text-darkblue font-bold hover:bg-orange-400 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
