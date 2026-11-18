import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";

const navigation = [
  { label: "Overview", short: "OV", to: "/dashboard" },
  { label: "My Surveys", short: "MS", to: "/surveys" }
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
    <div className="min-h-screen bg-[#f7f7f5] text-neutral-950">
      <button
        type="button"
        className="fixed left-4 top-3 z-30 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm lg:hidden"
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
      <aside className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-neutral-200/80 bg-[#fbfbf9] shadow-[8px_0_30px_rgba(23,23,23,0.02)] transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-xs font-semibold text-white">SF</div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">SurveyFlow</div>
              <div className="text-xs text-neutral-400">Workspace</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-neutral-950 text-white shadow-sm" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold ${isActive ? "bg-white/10 text-white" : "border border-neutral-200 bg-white text-neutral-500"}`}>
                    {item.short}
                  </span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="m-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
          <p className="truncate text-sm font-medium">{admin?.email}</p>
          <p className="mt-0.5 text-xs text-neutral-400">Administrator</p>
          <Button className="mt-3 w-full border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50" onClick={handleLogout}>Log out</Button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="sticky top-0 z-10 border-b border-neutral-200/80 bg-[#f7f7f5]/95 px-6 py-3 pl-16 backdrop-blur lg:pl-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">SurveyFlow workspace</span>
            <span className="hidden rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-500 sm:inline">Admin</span>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
