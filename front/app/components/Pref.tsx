import React from "react"

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id)
    // Cookieに保存
    // if (e.target.checked) {
    //   Cookies.set(e.target.id, e.target.id)
    // } else {
    //   Cookies.remove(e.target.id)
    // }
}

type Props = pref
export const Pref: React.FC<Props> = (pref) => {
  console.log(pref)
    return (
      <div>
        <input type="checkbox" id={pref.prefCode.toString()} onChange={handleChange} />
        <label htmlFor="">{pref.prefName}</label>
      </div>
    )
  }
