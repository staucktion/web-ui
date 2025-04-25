import { useState } from "react";
import { useAuth } from "../providers/AuthHook";
import redirectWithPost from "../util/redirectWithPost";
import { webApiUrl } from "../env/envVars";

const useRequireAuth = () => {
  const { user, setUser } = useAuth(); 
  const [open, setOpen] = useState(false);

  const requireAuth = async (callback?: () => void) => {
    if (!user) {
      try {
       
        const response = await fetch(`${webApiUrl}/auth/info`, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user); 
            callback?.(); 
            return;
          }
        }
       
        setOpen(true);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setOpen(true); 
      }
    } else {
      callback?.(); 
    }
  };

  const handleClose = () => setOpen(false);

  const handleLogin = () => {
    setOpen(false);
    redirectWithPost("/auth/google"); 
  };

  return { open, requireAuth, handleClose, handleLogin };
};

export default useRequireAuth;
