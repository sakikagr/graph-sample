import {v4 as uuidv4} from "uuid";
import { Pref } from "./Pref";
import React from "react";
import { FormGroup, experimentalStyled as styled } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const CustomFormGroup = styled(FormGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  paddingLeft: "10px",
});

export const Prefs: React.FC<PrefsProps> = ({setPrefs, selectedPrefs, prefs}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pref = prefs.find((p) => p.prefCode === parseInt(e.target.id)) as pref

    if (e.target.checked) {
      setPrefs([...selectedPrefs, pref])
    } else {
      setPrefs(selectedPrefs.filter((p) => p.prefCode !== pref.prefCode))
    }
  }

  return (
    <Grid>
      <CustomFormGroup className="pref">
        {prefs
          && prefs.map((pref) => <Grid xs={3} key={uuidv4()}>
            <Pref
              pref={pref}
              onHandleChange={handleChange}
              checked={selectedPrefs.some((p) => p.prefCode === pref.prefCode)}
            />
          </Grid>)
        }
      </CustomFormGroup>
    </Grid>
  )
}
