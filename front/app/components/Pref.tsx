import React from "react"
import { FormControlLabel } from "@mui/material"

export const Pref: React.FC<PrefProps> = ({pref, checked, onHandleChange}) => {
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
