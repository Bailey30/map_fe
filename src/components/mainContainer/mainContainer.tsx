import { useNextCacheMarkers } from "@/utils/markers";
import AddButton from "../addButton/addButton";
import MapComponent from "../map/Map";
import styles from "./mainContainer.module.css"
import { Location } from "@/utils/types";
import {auth} from "@/lib/auth"
import GeolocateButton from "../geolocateButton/geolocateButton";

export default async function MainContainer({ children }: any) {
    const data: Location[]| undefined = await useNextCacheMarkers()
    const session = await auth()
    return (
        <div className={styles.mainContainer} id="main">{children}
            <AddButton session={session}/>
            <MapComponent data={data} />
        </div>
    )
}
