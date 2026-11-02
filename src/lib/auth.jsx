// Client-side auth state supporting both Supabase and Zyllo Tech Express SQLite backend
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const AuthContext = createContext({ user: null, loading: true });

const VALID_DEMO_ACCOUNTS = [
  {
    email: "admin@zyllotech.com",
    passwords: ["admin123"],
    role: "admin",
    name: "Zyllo Administrator",
    company: "Zyllo Tech Software Solutions",
  },
  {
    email: "hr@zyllotech.com",
    passwords: ["hr123"],
    role: "hr",
    name: "Priya Sharma (HR Operations Lead)",
    company: "Zyllo Tech People Operations",
  },
  {
    email: "employee@zyllotech.com",
    passwords: ["employee123"],
    role: "employee",
    name: "Alex Morgan (Senior Engineer)",
    company: "Zyllo Tech Engineering Pod",
  },
  {
    email: "user@zyllotech.com",
    passwords: ["user123"],
    role: "client",
    name: "Alex Morgan",
    company: "HyperCloud Global",
  },
  {
    email: "client@zyllotech.com",
    passwords: ["client123", "user123"],
    role: "client",
    name: "Enterprise Client",
    company: "Enterprise Partner",
  },
];

function getRegisteredUsers() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("zyllotech_registered_users");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function getLocalUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("zyllotech_user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.email) {
      return {
        id: parsed.id || 1,
        email: parsed.email,
        role: parsed.role || (parsed.email.includes("admin") ? "admin" : "client"),
        status: parsed.status || "APPROVED",
        employee_id: parsed.employee_id || null,
        user_metadata: {
          full_name: parsed.name || parsed.email.split("@")[0],
          role: parsed.role,
          employee_id: parsed.employee_id || null,
          company: parsed.company || "Zyllo Tech",
          status: parsed.status || "APPROVED",
          approved_at: parsed.approved_at || null,
          created_at: parsed.created_at || null,
        },
      };
    }
  } catch (e) {}
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getLocalUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // First check local user
    const local = getLocalUser();
    if (local && active) {
      setUser(local);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session?.user) {
        setUser(data.session.user);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const fallback = getLocalUser();
        setUser(fallback);
      }
      setLoading(false);
    });

    const handleAuthChange = () => {
      const current = getLocalUser();
      setUser(current);
    };

    window.addEventListener("zyllotech_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      active = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("zyllotech_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        // Try Express backend login first
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password }),
          });
          const data = await res.json().catch(() => null);

          if (!res.ok) {
            // Check specifically for pending or rejected status
            if (data?.message) {
              return {
                data: null,
                error: {
                  message: data.message,
                  status: data.status || (res.status === 403 ? "FORBIDDEN" : "ERROR"),
                },
              };
            }
          } else if (data?.success && data.user) {
            const authUser = {
              id: data.user.id,
              email: data.user.email,
              role: data.user.role,
              status: data.user.status || "APPROVED",
              employee_id: data.user.employee_id || null,
              user_metadata: {
                full_name: data.user.name,
                role: data.user.role,
                status: data.user.status || "APPROVED",
                employee_id: data.user.employee_id || null,
                company: data.user.company,
                approved_at: data.user.approved_at,
                created_at: data.user.created_at,
              },
            };
            localStorage.setItem("zyllotech_token", data.token);
            localStorage.setItem("zyllotech_user", JSON.stringify(data.user));
            setUser(authUser);
            return { data: { user: authUser }, error: null };
          }
        } catch (err) {
          // Express backend offline or not connected
        }

        // Try Supabase auth
        try {
          const supaRes = await supabase.auth.signInWithPassword({ email, password });
          if (!supaRes.error && supaRes.data?.user) {
            setUser(supaRes.data.user);
            return supaRes;
          }
        } catch (e) {}

        // Authenticate against known local accounts or registered credentials
        const lowerEmail = email.toLowerCase().trim();
        const registeredUsers = getRegisteredUsers();
        const foundReg = registeredUsers.find(
          (u) => u.email?.toLowerCase().trim() === lowerEmail && u.password === password
        );

        if (foundReg) {
          const status = (foundReg.status || "PENDING").toUpperCase();
          if (status === "PENDING") {
            return {
              data: null,
              error: {
                message: "Your account is awaiting administrator approval.",
                status: "PENDING",
              },
            };
          }
          if (status === "REJECTED") {
            return {
              data: null,
              error: {
                message: "Your registration request was rejected by an administrator. Please contact support for assistance.",
                status: "REJECTED",
              },
            };
          }
        }

        const foundDemo = VALID_DEMO_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === lowerEmail && acc.passwords.includes(password)
        );

        const matched = foundReg || foundDemo;

        if (matched) {
          const authUser = {
            id: matched.id || Date.now(),
            email: lowerEmail,
            role: matched.role || "client",
            status: matched.status || "APPROVED",
            employee_id: matched.employee_id || (matched.role === "employee" ? "ZYL-EMP-0001" : null),
            user_metadata: {
              full_name: matched.name,
              role: matched.role || "client",
              status: matched.status || "APPROVED",
              employee_id: matched.employee_id || (matched.role === "employee" ? "ZYL-EMP-0001" : null),
              company: matched.company || "Zyllo Tech",
            },
          };
          localStorage.setItem("zyllotech_token", "demo_jwt_token_" + authUser.role);
          localStorage.setItem(
            "zyllotech_user",
            JSON.stringify({
              id: authUser.id,
              name: matched.name,
              email: lowerEmail,
              role: authUser.role,
              status: authUser.status,
              employee_id: authUser.employee_id,
              company: matched.company || "Zyllo Tech",
            })
          );
          setUser(authUser);
          return { data: { user: authUser }, error: null };
        }

        // Credentials did not match
        return {
          data: null,
          error: { message: "Incorrect credentials. Please verify your email and password." },
        };
      },
      signUp: async ({ name, email, password, confirmPassword, role }) => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, confirmPassword, role }),
          });
          const data = await res.json().catch(() => null);

          if (!res.ok || !data?.success) {
            return {
              data: null,
              error: { message: data?.message || "Failed to submit registration request." },
            };
          }

          // Save to local registered list for offline backup as PENDING
          const regUsers = getRegisteredUsers();
          const cleanEmail = email.trim().toLowerCase();
          const existingIdx = regUsers.findIndex((u) => u.email?.toLowerCase() === cleanEmail);
          const newReg = {
            id: data.user?.id || Date.now(),
            name: name.trim(),
            email: cleanEmail,
            password,
            role: role.toLowerCase(),
            status: "PENDING",
            employee_id: null,
            created_at: new Date().toISOString(),
          };
          if (existingIdx >= 0) regUsers[existingIdx] = newReg;
          else regUsers.push(newReg);
          localStorage.setItem("zyllotech_registered_users", JSON.stringify(regUsers));

          return { data, error: null };
        } catch (err) {
          // Offline fallback
          const regUsers = getRegisteredUsers();
          const cleanEmail = email.trim().toLowerCase();
          if (regUsers.some((u) => u.email?.toLowerCase() === cleanEmail)) {
            return {
              data: null,
              error: { message: "An account with this email address already exists." },
            };
          }
          const newReg = {
            id: Date.now(),
            name: name.trim(),
            email: cleanEmail,
            password,
            role: role.toLowerCase(),
            status: "PENDING",
            employee_id: null,
            created_at: new Date().toISOString(),
          };
          regUsers.push(newReg);
          localStorage.setItem("zyllotech_registered_users", JSON.stringify(regUsers));
          return {
            data: {
              success: true,
              message:
                "Your registration has been submitted successfully! Your account is awaiting administrator approval. You will be able to log in once your account has been approved.",
              user: newReg,
            },
            error: null,
          };
        }
      },
      signOut: async () => {
        try {
          localStorage.removeItem("zyllotech_token");
          localStorage.removeItem("zyllotech_user");
        } catch (e) {}
        setUser(null);
        try {
          await supabase.auth.signOut();
        } catch (e) {}
        try {
          window.dispatchEvent(new Event("zyllotech_auth_change"));
        } catch (e) {}
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export function getPortalDestination(user) {
  if (!user) return "/login";
  const role = (user.role || user.user_metadata?.role || "").toLowerCase();
  const email = (user.email || "").toLowerCase();

  if (role === "admin" || email.includes("admin")) return "/admin";
  if (role === "hr" || email.includes("hr")) return "/hr";
  if (role === "employee" || email.includes("employee")) return "/employee";
  if (role === "client" || email.includes("client") || email.includes("user")) return "/portal";
  return "/portal";
}
