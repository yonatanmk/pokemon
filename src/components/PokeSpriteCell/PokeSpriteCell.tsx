import { useState, useEffect } from 'react'
import style from './PokeSpriteCell.module.scss'

// export const baseFrontImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`
// // const baseBackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/`
// export const baseShinyFrontImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/`
// // const baseShinyBackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/`

export type IPokeSpriteCellProps = {
  id: number;
  name: string;
  defaultUrl: string;
  shinyUrl: string;
}

function PokeSprite({ id, name, defaultUrl, shinyUrl }: IPokeSpriteCellProps) {
  const [hidden, setHidden] = useState(false)
  const [shinyHidden, setShinyHidden] = useState(false)
  // const frontUrl = `${baseFrontImageUrl}${id}.png`
  // // const backUrl = `${baseBackImageUrl}${id}.png`
  // const frontShinyUrl = `${baseShinyFrontImageUrl}${id}.png`
  // // const backShinyUrl = `${baseShinyBackImageUrl}${id}.png`

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

  return (
    <div className={style.PokeSpriteCell}>
      {!hidden && defaultUrl && <img src={defaultUrl} alt={`${name} sprite`} onError={onError} />}
      {/* <img src={backUrl} alt={`${name} sprite`} /> */}
      {!shinyHidden && shinyUrl && <img src={shinyUrl} alt={`${name} sprite`} onError={onError} />}
      {/* <img src={backShinyUrl} alt={`${name} sprite`} /> */}
    </div>
  )
  
}




export default PokeSprite;