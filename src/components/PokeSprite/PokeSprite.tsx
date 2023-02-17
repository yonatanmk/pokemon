import style from './PokeSprite.module.scss'

const baseFrontImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`
const baseBackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/`
const baseShinyFrontImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/`
const baseShinyBackImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/`

export type IPokeSpriteProps = {
  id: number;
  name: string;
}

function PokeSprite({ id, name }: IPokeSpriteProps) {
  const frontUrl = `${baseFrontImageUrl}${id}.png`
  const backUrl = `${baseBackImageUrl}${id}.png`
  const frontShinyUrl = `${baseShinyFrontImageUrl}${id}.png`
  const backShinyUrl = `${baseShinyBackImageUrl}${id}.png`
  return (
    <div className={style.PokeSprite}>
      <img src={frontUrl} alt={`${name} sprite`}></img>
      {/* <img src={backUrl} alt={`${name} sprite`}></img> */}
      <img src={frontShinyUrl} alt={`${name} sprite`}></img>
      {/* <img src={backShinyUrl} alt={`${name} sprite`}></img> */}
    </div>
  )
  
}

export default PokeSprite;