import {v4 as uuidv4} from "uuid";
import { Pref } from "./Pref";
import React, { Dispatch, SetStateAction } from "react";
import { SerializeFrom } from "@remix-run/node";

type PrefsProps = {
  prefs: SerializeFrom<pref>[],
  setPrefs: Dispatch<SetStateAction<pref[]>>
};
export const Prefs: React.FC<PrefsProps> = ({setPrefs, prefs}) => {
  return (
    <form className="pref">
      {prefs
        && prefs.map((pref) => <Pref key={uuidv4()} {...pref} />)
      }
    </form>
  )
}
