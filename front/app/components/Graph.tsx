import React, { useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type Composition = {
  label?: string
  data: {
    year: number
    value: number
  }[]
}
type PopulationComposition = {
  boundaryYear: number
  data: Composition[]
}
type Population = {
  prefCode: number
  prefName: string
} & {
  label?: string
  data?: {
    year: number
    value: number
  }[]
}

type Props = {
  population: Population[]
}
const Chart: React.FC<Props> = ({population}) => {
  const [populationData, setPopulationData] = React.useState<Population[]>([])

  useEffect(() => {
    const years = population.map((p) => p.data?.map((d) => d.year)).flat()

    const names = Array.from(new Set(years)).map((year) => {
      return { name: year }
    })

    const populationData = names.map((n) => {
      const data = population.map((p) => {
        const d = p.data?.find((d) => d.year === n.name)
        return { [p.prefName]: d ? d.value : 0 }
      })
      return { name: n.name, ...Object.assign({}, ...data) }
    })
    setPopulationData(populationData)
    console.log(populationData)
  }, [population])

  return (
    <ResponsiveContainer width={'100%'} height={400}>
      <LineChart data={populationData}>
        {population.map((p) => (
          <Line
            key={p.prefName}
            type="monotone"
            dataKey={p.prefName}
            stroke="#8884d8"
          />
        ))}
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
    </ResponsiveContainer>
  )
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
      const populationData = await Promise.all(
        Object.keys(selectedPrefs).map(async (k) => {
          const v = selectedPrefs[parseInt(k)]
          const res = await req(v.prefCode, v.prefName)
          return res
        })
      )
      setPopulation(populationData)
    })()
  }, [selectedPrefs])

  return (
    <>
      <p>Graph</p>
        <Chart population={population} />
    </>
  )
}
