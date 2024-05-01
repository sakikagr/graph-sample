import React, { useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
  }, [population])

  return (
    <ResponsiveContainer width={'100%'} height={400}>
      { /** @see https://github.com/recharts/recharts/issues/3615 */}
      <LineChart data={populationData}>
        {population.map((p, index) => (
          // TODO: ラインの色を変更
          <Line
            key={p.prefName}
            type="monotone"
            dataKey={p.prefName}
            stroke={`#${index}${index}${index}`}
            name={p.prefName}
          />
        ))}
        <Tooltip
          formatter={(value) => value.toLocaleString()}
          contentStyle={{ fontSize: 12 }}
          // 人口の多い順にソート
          itemSorter={(item) => (item.value as number) * -1}
        />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => value.toLocaleString()} />
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
      {
        Object.keys(population).length === 0 && <p>都道府県を選択してください</p>
      }
      {
        Object.keys(population).length > 0 && <Chart population={population} />
      }
    </>
  )
}
