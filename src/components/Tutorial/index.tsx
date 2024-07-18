import { ReactNode } from "react";
import TwistyPlayer from "../TwistyPlayer";
import styles from "./Tutorial.module.css";

// Pass in the content to allow for easier translations later
export interface PieceTypesProps {
  text: {
    corners: ReactNode;
    edges: ReactNode;
    centers: ReactNode;
  };
}

export function PieceTypes({ text }: PieceTypesProps) {
  return (
    <>
      <div className={styles.row}>
        <TwistyPlayer
          className={styles.cube}
          controlPanel="none"
          hintFacelets="none"
          experimentalStickeringMaskOrbits="EDGES:XXXXXXXXXXXX,CORNERS:--------,CENTERS:XXXXXX"
        />
        <div>{text.corners}</div>
      </div>
      <div className={styles.row}>
        <TwistyPlayer
          className={styles.cube}
          controlPanel="none"
          hintFacelets="none"
          experimentalStickeringMaskOrbits="EDGES:------------,CORNERS:XXXXXXXX,CENTERS:XXXXXX"
        />
        <div>{text.edges}</div>
      </div>
      <div className={styles.row}>
        <TwistyPlayer
          className={styles.cube}
          controlPanel="none"
          hintFacelets="none"
          experimentalStickeringMaskOrbits="EDGES:XXXXXXXXXXXX,CORNERS:XXXXXXXX,CENTERS:------"
        />
        <div>{text.centers}</div>
      </div>
    </>
  );
}
