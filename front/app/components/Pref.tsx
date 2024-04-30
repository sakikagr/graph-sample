import React from "react"

type Props = {
  pref: pref,
  checked: boolean,
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const Pref: React.FC<Props> = ({pref, checked, onHandleChange}) => {
  return (
    <div>
      <input
        type="checkbox"
        id={pref.prefCode.toString()}
        checked={checked}
        onChange={onHandleChange}
      />
      <label htmlFor="">{pref.prefName}</label>
    </div>
  )
}
