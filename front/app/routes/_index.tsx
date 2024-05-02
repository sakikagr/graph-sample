import type { MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Prefs } from "../components/Prefs";
import { Graph } from "../components/Graph";
import { useState } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { Container } from "@mui/material";

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

export default function Index() {
  const [selectedPrefs, setPrefs] = useState<pref[]>([])
  const data = useLoaderData<typeof clientLoader>()
  return (
    <Container fixed>
      <Grid container>
        <Grid xs={12}>
          <Prefs prefs={data} selectedPrefs={selectedPrefs} setPrefs={setPrefs} />
        </Grid>
        <Grid xs={12}>
          <Graph {...selectedPrefs} />
        </Grid>
      </Grid>
    </Container>
  );
}
