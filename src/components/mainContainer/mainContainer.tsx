import { useNextCacheMarkers } from "@/utils/markers";
import AddButton from "../addButton/addButton";
import AddingOverlay from "../addingOverlay/addingOverlay";
import MapComponent from "../map/Map";
import styles from "./mainContainer.module.css"
import { Location } from "@/utils/types";
import {auth} from "@/lib/auth"

export default async function MainContainer({ children }: any) {
    const data: Location[]| undefined = await useNextCacheMarkers()
    const session = await auth()
    return (
        <div className={styles.mainContainer}>{children}
            <AddButton session={session}/>
            <AddingOverlay />
            <MapComponent data={data} />
        </div>
    )
}
