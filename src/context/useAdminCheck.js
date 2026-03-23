import { useContext } from "react";
import { useEffect, useState } from "react";
import { appContext } from "./context";


const useAdminCheck = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token")
  const { URL } = useContext(appContext)
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(URL + "/auth/admin-check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        // Suppress auth error
      } finally {
        setLoading(false);
      }
    };

    check();
  }, []);

  return { loading, isAdmin };
};

export default useAdminCheck;