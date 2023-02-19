import { useState } from 'react';
import classnames from 'classnames';
import { IPokemonRow } from '../../interfaces';
import styles from './InfoPanel.module.scss';
import { useQuery } from "@apollo/client"
import type { IFlavorQueryData } from '../../interfaces';
import { GET_POKEMON_FLAVOR } from '../../graphql/queries';

export type IInfoPanelProps = {
  selectedPokemon: IPokemonRow | null
}

const defaultFlavor = '[ REDACTED ]'

function InfoPanel({ selectedPokemon }: IInfoPanelProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { data, loading } = useQuery<IFlavorQueryData>(GET_POKEMON_FLAVOR, {
    variables: { 
      pokemonId: selectedPokemon?.id || 0,
    },
  })

  const flavorText = data?.pokemon_v2_pokemonspeciesflavortext?.[0]?.flavor_text;

  const onImageLoaded = () => {
    setImageLoaded(true);
  }

  return (
    <div className={styles.InfoPanel}>
      {selectedPokemon && <div className={styles.InfoPanel__Content}>
        <h1 className={styles.InfoPanel__Title}>{selectedPokemon.name} #{selectedPokemon.id}</h1>
        {selectedPokemon.imageUrl && 
          <img 
            className={classnames(styles.InfoPanel__Image,  { [styles['InfoPanel__Image--loaded']] : imageLoaded })} 
            src={selectedPokemon.imageUrl} 
            alt={`sidebar-${selectedPokemon.name}-sprite`} 
            onLoad={onImageLoaded}
          />
        }
        <div className={classnames(styles.InfoPanel__Flavor, { [styles['InfoPanel__Flavor--redacted']] : !flavorText })}>
          {/* {loading && <div className={styles['lds-ring']}><div></div><div></div><div></div><div></div></div>} */}
          {!loading && <p>{flavorText || defaultFlavor}</p>}
        </div>
        {/* <p>Loading: {loading}</p> */}
      </div>}
    </div>
  )
}

export default InfoPanel;