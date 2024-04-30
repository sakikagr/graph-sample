import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Prefs } from "../components/Prefs";
import { Graph } from "~/components/Graph";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function clientLoader()
{
  const res = await fetch(
    'https://opendata.resas-portal.go.jp/api/v1/prefectures',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'X-API-KEY': import.meta.env["VITE_X_API_KEY"]
      }
    }
  )

  const data = await res.json() as prefs
  return data.result
}

export default function Index() {
  const data = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <Prefs {...data} />
      <Graph />
    </div>
  );
}
