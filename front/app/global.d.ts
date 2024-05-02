// @see https://stackoverflow.com/questions/71324797/react-typescript-what-does-dispatchsetstateactionboolean-stand-for
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (action: A) => void;

type pref = {
  prefCode: number,
  prefName: string,
  id?: string
}

type prefs = {
  message: null,
  result: Array<pref>
}

interface PrefsProps {
  prefs: SerializeFrom<pref>[],
  selectedPrefs: pref[],
  setPrefs: Dispatch<SetStateAction<pref[]>>
}

type PrefProps = {
  pref: pref,
  checked: boolean,
  onHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

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
