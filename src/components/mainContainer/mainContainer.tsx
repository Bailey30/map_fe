import { useNextCacheMarkers } from "@/utils/markers";
import AddButton from "../addButton/addButton";
import AddingOverlay from "../addingOverlay/addingOverlay";
import InfoPanel from "../infoPanel/InfoPanel";
import MapComponent from "../map/Map";
import StoreProvider from "../storeProvider";
import styles from "./mainContainer.module.css"
import { MapProvider, Map } from 'react-map-gl';
export default async function MainContainer({ children }: any) {

    const data = await useNextCacheMarkers()    
    return (
        <div className={styles.mainContainer}>{children}
                <AddButton />
                <AddingOverlay/>
                <MapComponent  data={data}/>
        </div>
    )
}
