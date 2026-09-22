/* The Photoelectric Effect — shared physics.
 *
 * This is the single source of truth for every number the presentation, the quiz
 * and the simulation display. Moved verbatim out of index.html; do not rewrite,
 * reformat or "improve" physics() — the animation and the quiz answer key both
 * derive from it, and they can only agree while there is exactly one copy.
 *
 * A CLASSIC script, deliberately not an ES module: browsers block `import` from
 * file:// URLs, and every page here must work when opened by double-clicking it.
 * Load it with <script src="physics.js"></script> before the page's own script.
 *
 *   E = hc/λ          photon energy
 *   K_max = E − φ     maximum kinetic energy of an emitted electron
 *   λ₀ = hc/φ         threshold wavelength
 *   f₀ = φ/h          threshold frequency
 *
 * Two properties that look like bugs and are not:
 *   - `rate` rises with wavelength. At fixed incident power, photon flux
 *     = P/(hν) ∝ λ. It is the *emission* rate, gated on emits, so it reads 0
 *     below threshold; the ∝λ behaviour carries through under an assumed
 *     constant quantum yield.
 *   - K_max does not depend on intensity. That is the entire point of the
 *     experiment.
 */

const HC=1239.841984,H=4.135667696e-15;

function physics(wavelength,intensity,phi){const energy=HC/wavelength,k=energy-phi;return{wavelength,intensity,phi,energy,k,emits:intensity>0&&k>0,rate:intensity>0&&k>0?(intensity/50)*(wavelength/400):0,frequency:energy/H,threshold:HC/phi};}

/* Work functions in eV. These exact values are the ones index.html's <option>
 * elements carry; SPEC.md §5 carries a check that the two lists agree. Values
 * differ between sources and between crystal faces — any quiz question quoting
 * a work function quotes it from here. */
const MATERIALS=[
  {name:'Sodium', phi:2.30},
  {name:'Cesium', phi:2.14},
  {name:'Zinc',   phi:4.30},
  {name:'Copper', phi:4.70}
];
