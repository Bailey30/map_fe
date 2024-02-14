import { useNextCacheMarkers } from "@/utils/markers";
import AddButton from "../addButton/addButton";
import AddingOverlay from "../addingOverlay/addingOverlay";
import MapComponent from "../map/Map";
import styles from "./mainContainer.module.css"

export default async function MainContainer({ children }: any) {
    const data = await useNextCacheMarkers()
    return (
        <div className={styles.mainContainer}>{children}
            <AddButton />
            <AddingOverlay />
            <MapComponent data={data} />
        </div>
    )
}
