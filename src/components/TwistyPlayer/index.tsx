// taken from
// https://github.com/cubing/react-cubing/blob/main/src/TwistyPlayer/index.tsx
import {
  useState,
  useEffect,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import { TwistyPlayer as TP, TwistyPlayerConfig } from "cubing/twisty";
import { cube3x3x3 } from "cubing/puzzles";
import { Alg } from "cubing/alg";

export interface TwistyPlayerExtendedConfig extends TwistyPlayerConfig {
  className?: string;
  rootClassName?: string;
  onTwistyInit?: (twisty: TP) => void;
  customStickering?: CustomStickering;
  stickeringSetup?: Alg | string;
}

/**
 * A React wrapper for the cubing.js `<twisty-player>` element.
 */
const TwistyPlayer = forwardRef(
  (
    {
      className,
      rootClassName,
      onTwistyInit,
      customStickering,
      stickeringSetup,
      ...props
    }: TwistyPlayerExtendedConfig,
    ref
  ) => {
    const [twistyPlayer, setTwisty] = useState<TP>();
    const spanRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
      const newTwisty = new TP({
        experimentalStickeringMaskOrbits: customStickering ? getCustomStickeringMaskOrbits(customStickering) : undefined,
        // override some defaults
        background: "none",
        ...props,
      });

      if (stickeringSetup) {
        transformTPMask(newTwisty, stickeringSetup)
      }

      if (className) {
        newTwisty.className = className;
      }

      newTwisty.style.maxWidth = "100%";
      setTwisty(newTwisty);
      spanRef.current?.appendChild(newTwisty);
      if (onTwistyInit) onTwistyInit(newTwisty);
      return () => {
        spanRef.current?.removeChild(newTwisty);
      };
    }, [props.alg]);

    useImperativeHandle(ref, () => {
      return twistyPlayer;
    });

    return <span className={rootClassName} ref={spanRef} />;
  }
);

export default TwistyPlayer;


// adapted from https://github.com/cubing/cubing.js/issues/224#issuecomment-1275928713
async function transformTPMask(twisty: TP, transformationSource: Alg | string) {
  const kpuzzle = await cube3x3x3.kpuzzle();
  const mask = await twisty.experimentalModel.twistySceneModel.stickeringMask.get()
  const transformation = kpuzzle.algToTransformation(transformationSource)
  const newMask = { orbits: {} };

  for (
    let orbitIndex = 0;
    orbitIndex < kpuzzle.definition.orbits.length;
    orbitIndex++
  ) {
    const newOrbitMask = { pieces: [] };
    const { numPieces, numOrientations, orbitName } =
      kpuzzle.definition.orbits[orbitIndex];

    const orbitMask = mask.orbits[orbitName];
    for (let i = 0; i < numPieces; i++) {
      const perm = transformation.transformationData[orbitName].permutation[i];
      const ori =
        transformation.transformationData[orbitName].orientationDelta[i];
      let facelets = orbitMask.pieces[perm].facelets.slice(0, numOrientations);
      facelets = facelets.slice(ori).concat(facelets.slice(0, ori));
      newOrbitMask.pieces.push({ facelets });
    }
    newMask.orbits[orbitName] = newOrbitMask;
  }

  twisty.experimentalStickeringMaskOrbits = newMask;
}


/* Documentation for the experimentalStickeringMaskOrbits prop/attribute:
This prop is used to customize the way pieces are highlighted on the cube,
if it's beyond the default supported stickerings such as OCLL or EOCross.
It's an experimental feature that is subject to change.

Pass in a string in the format "EDGES:xxxxxxxxxxxx,CORNERS:xxxxxxxx,CENTERS:xxxxxx"
where each "x" is one of the following characters:
(table taken from https://github.com/cubing/cubing.js/commit/668179c8bb116b24775e5450a5d949c38068d3a0)
| Character | Primary  | Other  | Meaning                                              |
|-----------|----------|--------|------------------------------------------------------|
| `-`       | bright   | bright | piece to solve                                       |
| `D`       | dim      | dim    | dim                                                  |
| `I`       | gray     | gray   | ignored                                              |
| `P`       | bright   | gray   | to permute (e.g. PLL)                                |
| `O`       | dim      | bright | to orient (e.g. OLL)                                 |
| `o`       | dim      | gray   | oriented, primary sticker known (e.g. OLL completed) |
| `?`       | oriented | gray   | oriented, primary sticker unknown (e.g. EO)          |
| `X`       | N/A      | N/A    | invisible                                            |

This is defined in https://github.com/cubing/cubing.js/blob/36c57c2dadc889b1321d05d8cfc005cef8a9bffd/src/cubing/twisty/model/props/puzzle/display/parseSerializedStickeringMask.ts

"Primary stickers" are stickers that belong on the U and D faces, and FL, FR, BL, BR positions.
They're relevant for edge orientation and corner orientation.

Here is the order of the pieces for 3x3:
EDGES:
  UF, UR, UB, UL,
  DF, DR, DB, DL,
  FR, FL, BR, BL

CORNERS:
  UFR, UBR, UBL, UFL,
  DFR, DFL, DBL, DBR

CENTERS: U, L, F, R, B, D
*/

type Piece = Exclude<`${"U" | "D" | ""}${"F" | "B" | ""}${"L" | "R" | ""}`, "">;

const STICKERING_CHARS_MAP = {
  solved: "-",
  dim: "D",
  ignored: "I",
  permuted: "P",
  oriented: "O",
  orientedWithoutPermutation: "?",
  invisible: "X",
} as const;

type Option = keyof typeof STICKERING_CHARS_MAP;
type StickeringChar = (typeof STICKERING_CHARS_MAP)[Option];

type CustomStickering = {
  [key in Option]?: Piece[];
};

const centerIndices = {
  U: 0,
  L: 1,
  F: 2,
  R: 3,
  B: 4,
  D: 5,
};

/* prettier-ignore */
const edgeIndices = {
  UF: 0, UR: 1, UB: 2, UL: 3,
  DF: 4, DR: 5, DB: 6, DL: 7,
  FR: 8, FL: 9, BR: 10, BL: 11,
};

/* prettier-ignore */
const cornerIndices = {
  UFR: 0, UBR: 1, UBL: 2, UFL: 3,
  DFR: 4, DFL: 5, DBL: 6, DBR: 7,
};

/**
 * Utility function to make it easier to define 3x3 cube stickerings.
 * Generates the `experimentalStickeringMaskOrbits` value using a more readable syntax.
 * This is a terrible, niche hack to make it as easy as possible for our team of writers.
 * It doesn't work for other puzzles and the syntax is tedious.
 * I suggest most users take the approach shown in cubing.js instead:
 * https://github.com/cubing/cubing.js/blob/178e64fc3d589516bc4eb5d7689232e9795c735d/src/cubing/puzzles/stickerings/cube-like-stickerings.ts
 */
function getCustomStickeringMaskOrbits(
  stickering: CustomStickering,
  defaultOption: Option = "ignored"
) {
  const defaultStickeringChar = STICKERING_CHARS_MAP[defaultOption];
  const edges: StickeringChar[] = Array(12).fill(defaultStickeringChar);
  const corners: StickeringChar[] = Array(8).fill(defaultStickeringChar);
  const centers: StickeringChar[] = Array(6).fill(defaultStickeringChar);

  for (const [option, pieces] of Object.entries(stickering) as [
    option: Option,
    pieces: Piece[]
  ][]) {
    for (const piece of pieces) {
      const stickeringChar = STICKERING_CHARS_MAP[option];
      if (piece.length === 1) {
        centers[centerIndices[piece]] = stickeringChar;
      } else if (piece.length === 2) {
        edges[edgeIndices[piece]] = stickeringChar;
      } else {
        corners[cornerIndices[piece]] = stickeringChar;
      }
    }
  }

  /* prettier-ignore */
  return `EDGES:${edges.join("")},CORNERS:${corners.join("")},CENTERS:${centers.join("")}`;
}
