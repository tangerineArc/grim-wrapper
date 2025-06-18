"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Thread = {
  id: string;
  title: string;
  createdAt: Date;
};

type ThreadsContextType = {
  threads: Thread[];
  refreshThreads: () => Promise<void>;
};

const ThreadsContext = createContext<ThreadsContextType | undefined>(undefined);

export function ThreadsProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<Thread[]>([]);

  const refreshThreads = async () => {
    const res = await fetch("/api/threads");
    if (!res.ok) return;

    const data: Thread[] = await res.json();
    setThreads(data);
  };

  useEffect(() => {
    refreshThreads();
  }, []);

  return (
    <ThreadsContext.Provider value={{ threads, refreshThreads }}>
      {children}
    </ThreadsContext.Provider>
  );
}

export function useThreads() {
  const ctx = useContext(ThreadsContext);
  if (!ctx) throw new Error("useThreads must be used within ThreadsProvider");
  return ctx;
}
