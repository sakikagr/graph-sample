import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Prefs } from "../components/Prefs";
import { Graph } from "~/components/Graph";
import React from "react";

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
  return json(data.result)
}

export function clientAction() {
  return json({ message: "This action was called from the client" });
}

export default function Index() {
  const [prefs, setPrefs] = React.useState<pref[]>([])
  const data = useLoaderData<typeof clientLoader>()
  return (
    <div>
      <Prefs prefs={data} setPrefs={setPrefs} />
      <Graph {...prefs} />
    </div>
  );
}
