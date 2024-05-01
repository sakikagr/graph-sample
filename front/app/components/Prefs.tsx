import {v4 as uuidv4} from "uuid";
import { Pref } from "./Pref";
import React, { Dispatch, SetStateAction } from "react";
import { SerializeFrom } from "@remix-run/node";
import { FormGroup, experimentalStyled as styled } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

const CustomFormGroup = styled(FormGroup)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  paddingLeft: "10px",
});

type PrefsProps = {
  prefs: SerializeFrom<pref>[],
  selectedPrefs: pref[],
  setPrefs: Dispatch<SetStateAction<pref[]>>
};
export const Prefs: React.FC<PrefsProps> = ({setPrefs, selectedPrefs, prefs}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pref = prefs.find((p) => p.prefCode === parseInt(e.target.id))
    if (pref === undefined) return

    if (e.target.checked) {
      // selectedPrefsにprefが含まれていない場合、selectedPrefsに追加
      if (selectedPrefs.some((p) => p.prefCode === pref.prefCode)) {
        return
      }
      setPrefs((prev) => [...prev, pref])
    } else {
      setPrefs((prev) => prev.filter((p) => p.prefCode !== pref.prefCode))
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
