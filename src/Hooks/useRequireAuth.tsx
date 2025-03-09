import { useState } from "react";
import { useAuth } from "../providers/AuthContext.tsx"; 
import redirectWithPost from "../util/redirectWithPost.ts";

// This function checks if the user is logged in and triggers a login popup if needed

const useRequireAuth = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  
  const requireAuth = (callback?: () => void) => {
    if (!user) {
      setOpen(true);
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
