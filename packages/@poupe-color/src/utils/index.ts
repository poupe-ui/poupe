// Colour-conversion helpers — opaque ARGB output from numeric / Hct
// / Colord / string inputs. `argb` is the umbrella dispatcher; the
// per-type helpers are the escape hatches for callers who already
// hold a typed value.
export {
  argb,
  argbFromColord,
  argbFromHCT,
} from './argb';
