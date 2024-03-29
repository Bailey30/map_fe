import { useNextCacheMarkers } from "@/utils/markers";
import Navbar from "../navbar/navbar";
import MapComponent from "../map/Map";
import styles from "./mainContainer.module.css";
import { Location } from "@/utils/types";
import { auth } from "@/lib/auth";

export default async function MainContainer({ children }: any) {
  const data: Location[] | undefined = await useNextCacheMarkers();
  const session = await auth();
  return (
    <div className={styles.mainContainer} id="main">
      {children}
      <Navbar session={session} />
      <MapComponent data={data} />
    </div>
  );
}
