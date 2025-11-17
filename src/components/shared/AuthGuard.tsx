import {useEffect} from "react";
import {getToken} from "@/stores/authStore.ts";

export default function AuthGuard({children}: { children: React.ReactNode }) {
  useEffect(() => {
    const token = getToken();
    console.log("TOKEN", token)
    if (!token) {
      const pathname = window.location.pathname,
        url = new URL(window.location.href);

      window.location.href = '/auth?next=' + encodeURIComponent(pathname + url.search + url.hash)
    }
  }, []);

  return children;
}
