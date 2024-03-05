export default function formatLocationName(location: string): string {
    return location.trim().split(" ").join("_")
}
