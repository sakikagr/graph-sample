import {v4 as uuidv4} from "uuid";

export const Pref = (item: pref) => {
  return (
    <div>
      <input type="checkbox" id={item.prefCode.toString()} />
      <label htmlFor="">{item.prefName}</label>
    </div>
  )
}

export const Prefs = (data: pref[]) => {
  return (
    <div className="pref">
      {data
        && Object.keys(data).map((k) => <Pref key={uuidv4()} {...data[parseInt(k)]} />)
      }
    </div>
  )
}
