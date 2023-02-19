import { IPokemonRow } from '../../interfaces';
import styles from './InfoPanel.module.scss';

export type IInfoPanelProps = {
  selectedPokemon: IPokemonRow | null
}

function InfoPanel({ selectedPokemon }: IInfoPanelProps) {
  return (
    <div className={styles.InfoPanel}>
      {selectedPokemon && <div className={styles.InfoPanel__Content}>
        <h1 className={styles.InfoPanel__Title}>{selectedPokemon.name} #{selectedPokemon.id}</h1>
        {selectedPokemon.imageUrl && <img className={styles.InfoPanel__Image} src={selectedPokemon.imageUrl} alt={`sidebar-${selectedPokemon.name}-sprite`} />}
      </div>}
    </div>
  )
}

export default InfoPanel;