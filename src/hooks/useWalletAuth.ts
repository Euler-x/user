import { useCallback, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import useAuth from "./useAuth";

export default function useWalletAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { getSignMessage, connectWallet, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const message = await getSignMessage(address);
      if (!message) throw new Error("Failed to get sign message");

      const signature = await signMessageAsync({ message });
      await connectWallet(address, message, signature);
    } catch (err) {
      // Error is already toasted by the API interceptor or wagmi
      console.error("Auth failed:", err);
    } finally {
      setLoading(false);
    }
  }, [address, getSignMessage, signMessageAsync, connectWallet]);

  return {
    address,
    isConnected,
    authenticate,
    loading: loading || authLoading,
  };
}
