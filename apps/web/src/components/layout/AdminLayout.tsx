import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Overview", to: "/dashboard" },
  { label: "My Surveys", to: "/surveys" },
  { label: "Settings", to: "/settings" }
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950">
      <button
        type="button"
        className="fixed left-4 top-4 z-30 rounded-md border border-neutral-200 bg-white p-2 lg:hidden"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-10 bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="border-b border-neutral-200 px-6 py-5">
          <span className="text-lg font-semibold">SurveyFlow</span>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-neutral-100 font-medium" : "text-neutral-600 hover:bg-neutral-50"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-4">
          <p className="truncate text-sm font-medium">{admin?.email}</p>
          <p className="text-xs text-neutral-500">Workspace · Admin</p>
          <Button className="mt-3 w-full" onClick={handleLogout}>Log out</Button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="border-b border-neutral-200 bg-white px-6 py-4 pl-16 lg:pl-6">
          <span className="text-sm text-neutral-500">Workspace</span>
        </div>
        <div className="mx-auto max-w-6xl p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
