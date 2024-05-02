import React, { useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Props = {
  population: Population[]
}
export const Chart: React.FC<Props> = ({population}) => {
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
    <div data-testid="chart-inner">
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
              data-testid="line"
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
    </div>
  )
}

export const req = async (prefCode: number, prefName: string) => {
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

export const Graph = (selectedPrefs: pref[]) => {
  const [population, setPopulation] = React.useState<Population[]>([])

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
        Object.keys(population).length > 0 && <div data-testid="chart"><Chart population={population} /></div>
      }
    </>
  )
}
