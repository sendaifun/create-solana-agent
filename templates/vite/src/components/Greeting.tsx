import { motion } from "motion/react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { checkAuthAndShowModal } from "~/utils/auth";

export const Greeting = () => {
  const { authenticated } = usePrivy();

  const handleConnectClick = () => {
    checkAuthAndShowModal();
  };

  return (
    <div
      key="overview"
      className="max-w-3xl px-3 py-4 flex flex-col justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold font-['SF_Pro_Display',system-ui,sans-serif] bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:via-[#1E9BB9] dark:to-gray-400 bg-clip-text text-transparent transition-colors duration-200"
      >
        Hello there!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-gray-600 dark:text-gray-300 mt-2"
      >
        How can I help you with Solana today?
      </motion.div>
      
      {!authenticated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex flex-col gap-3 items-center"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Connect your wallet to get personalized Solana assistance
          </div>
          <Button 
            onClick={handleConnectClick}
            className="bg-[#1E9BB9] text-white hover:bg-[#1E9BB9]/80"
          >
            Connect Wallet
          </Button>
        </motion.div>
      )}
    </div>
  );
};
