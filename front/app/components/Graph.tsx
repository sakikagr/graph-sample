import React from "react"
import { useEffect } from "react"

type Composition = {
  label: string
  data: {
    year: number
    value: number
  }[]
}
type PopulationComposition = {
  boundaryYear: number
  data: Composition[]
}
type Population = Composition & {
  prefCode: number
  prefName: string
}

export const Graph = (selectedPrefs: pref[]) => {
  const [population, setPopulation] = React.useState<Population[]>([])

  const req = async (prefCode: number, prefName: string) => {
    const res = await fetch(
      'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=' + prefCode,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'X-API-KEY': import.meta.env["VITE_X_API_KEY"]
        }
      }
    )

    const data = await res.json()
    const result = data.result as PopulationComposition
    const population = result.data.find((d) => d.label === '総人口')
    return { ...population, prefCode, prefName }
  }

  useEffect(() => {
    (async () => {
      Object.keys(selectedPrefs).map(async (k) => {
        const v = selectedPrefs[parseInt(k)]
        const res = await req(v.prefCode, v.prefName)
        // populationに重複するデータがあれば上書き
        if (population.some((p) => p.prefCode === res.prefCode)) {
          setPopulation((prev) => prev.map((p) => p.prefCode === res.prefCode ? res as Population : p))
        } else {
          setPopulation((prev) => [...prev, res as Population])
        }
      })
    })()
  }, [selectedPrefs])

  return (
    <>
      <p>Graph</p>
    </>
  )
}
