import { ReactNode, useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "underline" | "pills";
}

export default function Tabs({
  tabs,
  defaultTab,
  variant = "underline",
}: Readonly<TabsProps>) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const variants = {
    underline: {
      container: "border-b border-gray-200",
      tab: (isActive: boolean) => `
        px-4 py-2 text-sm font-medium transition-colors relative
        ${
          isActive
            ? "text-primary border-b-2 border-primary -mb-px"
            : "text-gray-500 hover:text-gray-700"
        }
      `,
    },
    pills: {
      container: "flex gap-2",
      tab: (isActive: boolean) => `
        px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${
          isActive
            ? "bg-primary text-white"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        }
      `,
    },
  };

  return (
    <div>
      <div className={variants[variant].container}>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={variants[variant].tab(activeTab === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
