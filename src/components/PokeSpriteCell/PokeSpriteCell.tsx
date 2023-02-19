import { useState, useEffect } from 'react'
import styles from './PokeSpriteCell.module.scss'
import { BsQuestionLg } from "react-icons/bs";

export type IPokeSpriteCellProps = {
  id: number;
  name: string;
  defaultUrl: string;
  shinyUrl: string;
}

function PokeSprite({ id, name, defaultUrl, shinyUrl }: IPokeSpriteCellProps) {
  const [hidden, setHidden] = useState(false)
  const [shinyHidden, setShinyHidden] = useState(false)

  const onError = (e: any) => {
    const { src } = e.target;
    if (src === defaultUrl) {
      setHidden(true)
    } else if (src === shinyUrl) {
      setShinyHidden(true);
    }
  }

  useEffect(() => {
    setHidden(false)
    setShinyHidden(false)
  }, [id])

  const noImage = hidden || !defaultUrl;
  const noShinyImage = shinyHidden || !shinyUrl;

  return (
    <div className={styles.PokeSpriteCell}>
      {!noImage && <img src={defaultUrl} alt={`table-${name}-sprite`} onError={onError} />}
      {noImage && <BsQuestionLg className={styles.PokeSpriteCell__emptySVG}/>}
      {!noShinyImage && <img src={shinyUrl} alt={`table-${name}-shiny-sprite`} onError={onError} />}
      {noShinyImage && <BsQuestionLg className={styles.PokeSpriteCell__emptySVG}/>}
    </div>
  )
  
}




export default PokeSprite;