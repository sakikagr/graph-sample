import React from "react"
import { FormControlLabel } from "@mui/material"

type Props = {
  pref: pref,
  checked: boolean,
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
export const Pref: React.FC<Props> = ({pref, checked, onHandleChange}) => {
  return (
    <>
      <FormControlLabel
        control={
          <input
            type="checkbox"
            id={pref.prefCode.toString()}
            checked={checked}
            onChange={onHandleChange}
          />
        }
        label={pref.prefName}
      ></FormControlLabel>
    </>
  )
}
