import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Wordmark from "@/components/Wordmark";
import { Input, AdminButton, Field } from "@/pages/admin/AdminUI";

export default function AdminLogin() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/admin");
    } catch (err) {
      const d = err.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white border border-neutral-200 p-10">
        <Wordmark className="h-8 mx-auto mb-2 block" />
        <p className="kicker text-neutral-400 text-center mb-8">Admin Dashboard</p>
        <form onSubmit={submit} data-testid="admin-login-form">
          <Field label="Email"><Input data-testid="admin-login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><Input data-testid="admin-login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          <AdminButton type="submit" disabled={loading} className="w-full justify-center mt-2" data-testid="admin-login-submit">
            {loading ? "Signing in..." : "Sign In"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
