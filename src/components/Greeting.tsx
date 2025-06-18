import type { User } from "@/types/user";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { greetingData } from "@/data/greeting-data";

export default function Greeting({ user }: { user: User | undefined }) {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-medium mb-8 ml-1">
        How can I help you{user && `, ${user.name?.split(" ")[0]}`}?
      </h1>
      <Tabs defaultValue={greetingData[0].category}>
        <TabsList>
          {greetingData.map((data) => (
            <TabsTrigger key={data.category} value={data.category}>
              <data.icon />
              {data.category}
            </TabsTrigger>
          ))}
        </TabsList>
        {greetingData.map(({ category, items }) => (
          <TabsContent key={category} value={category}>
            <ul className="[&>li]:mt-2">
              {items.map((item) => (
                <li key={item}>
                  <button className="hover:text-neutral-200 p-2 mb-2 text-start cursor-pointer">
                    {item}
                  </button>
                  <hr />
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
