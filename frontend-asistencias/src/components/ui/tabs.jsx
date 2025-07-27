import * as React from "react";

export function Tabs({ children }) {
  return <div className="w-full">{children}</div>;
}

export function TabsList({ children }) {
  return (
    <div className="flex border-b border-gray-300 mb-4">
      {children}
    </div>
  );
}

export function TabsTrigger({ children, activeTab, setActiveTab, name }) {
  const isActive = activeTab === name;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 font-semibold border-b-2 ${
        isActive ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, activeTab, name }) {
  return activeTab === name ? <div>{children}</div> : null;
}
