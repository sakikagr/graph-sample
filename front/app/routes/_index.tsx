import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import {v4 as uuidv4} from "uuid";

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

export const Pref = (item: pref) => {
  return (
    <div>
      <input type="checkbox" id={item.prefCode.toString()} />
      <label htmlFor="">{item.prefName}</label>
    </div>
  )
}

export const Prefs = () => {
  const data = useLoaderData<typeof clientLoader>()
  return (
    <div className="pref">
      {data && data.map((v) => <Pref key={uuidv4()} {...v} />)}
    </div>
  )
}

export const Graph = () => {
  return (
    <>
      <p>Graph</p>
    </>
  )
}

export default function Index() {
  return (
    <div>
      <Prefs />
      <Graph />
    </div>
  );
}
