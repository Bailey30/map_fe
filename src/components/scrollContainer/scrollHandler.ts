
export default class ScrollHandler {
    private static root: HTMLElement
    private static info: HTMLElement | null
    private static details: HTMLElement | null
    private static top: DOMRect
    private static diff: number
    private static startY: number
    private static endY: number
    private static direction: "up" | "down"
    private static snappedTo: "top" | "middle" | "bottom" | undefined
    private static halfWay = window.innerHeight / 2
    private static quarterWay = window.innerHeight / 4
    private static sixtyPercent = (window.innerHeight / 100) * 60
    private static fourFifths = (window.innerHeight / 5) * 4

    public static init(): void {
        this.root = document.documentElement;
        this.info = document.getElementById("info")
        this.details = document.getElementById("details")
        this.addEventListeners()
    }

    private static addEventListeners(): void {
        this.details?.addEventListener("touchstart", this.stopPropagation)
        this.details?.addEventListener("touchmove", this.stopPropagation)
        this.details?.addEventListener("touchend", this.stopPropagation)
        this.info?.addEventListener("touchstart", this.handleInfoTouchStart)
        this.info?.addEventListener("touchmove", this.handleInfoTouchMove)
        this.info?.addEventListener("touchend", this.handleInfoTouchEnd)
    }

    private static stopPropagation(e: TouchEvent): void {
        console.log(this.details)
        e.stopPropagation()
    }

    private static handleInfoTouchStart = (e: TouchEvent): void => { // use an arrow function to bind this to the class context inside the event listener - instead of the element that triggered the event
        // calculate the difference between the touch and the top of the container at the start of the movement
        if (!this.info) return
        this.top = this.info.getBoundingClientRect()
        this.diff = e.touches[0].clientY - this.top.y
        this.startY = e.touches[0].clientY
    }

    private static handleInfoTouchMove = (e: TouchEvent): void => {
        if (!this.info) return

        const posY = this.setScrollPosition(e)

        this.preventOverScroll(posY)

        this.detectDirection(e)

        this.snapContainer(posY)
    }


    private static handleInfoTouchEnd = (e: TouchEvent): void => {
        if (!this.info) return

        const endPosY = e.changedTouches[0].clientY - this.diff

        this.snapContainerBack(endPosY)
    }

    private static setScrollPosition(e: TouchEvent): number {
        // set position of top of container to be where the touch is minus the distance to the top of the container
        const posY = e.touches[0].clientY - this.diff
        this.root.style.setProperty("--scroll", posY + "px")

        /////////////// currently unused
        // this.root.style.setProperty("--scrollTop", (posY + 80).toString() + "px")
        // const top = this.info.getBoundingClientRect() // this is the distance from the top of the viewport
        //////////////
        
        return posY
    }

    private static preventOverScroll(posY: number): void {
        if (posY < 20) {
            this.root.style.setProperty("--scroll", 20 + "px")
            this.setScrollProperties(20)
        }

        if (posY > window.innerHeight - 100) {
            this.root.style.setProperty("--scroll", window.innerHeight - 100 + "px")
            this.setScrollProperties(window.innerHeight - 100)
        }
    }

    private static detectDirection(e: TouchEvent): void {
        this.endY = e.changedTouches[0].clientY
        if (this.endY < this.startY) {
            this.direction = "up"
        } else if (this.endY > this.startY) {
            this.direction = "down"
        }
    }

    private static snapContainer(posY: number): void {
        if (!this.info) return
        if ((posY < this.halfWay && this.direction === "up")) {
            this.snapToTop(this.info)
        } else if (posY > this.quarterWay && this.direction === "down" && this.snappedTo !== "middle") {
            this.snapToMiddle(this.info)
        } else if (posY > (this.quarterWay) * 3 && this.direction === "down" && this.snappedTo !== "bottom") {
            this.snapToBottom(this.info)
        } else if (posY < this.quarterWay * 3 && this.direction === "up" && this.snappedTo === "bottom") {
            this.snapToMiddle(this.info)
        } else {
            this.info.style.setProperty("transition", "unset")
        }
    }

    private static snapContainerBack(endPosY: number): void {
        if (!this.info) return
        // handles snap back scrolling events when the user hasnt scrolled far enough
        if (endPosY < this.quarterWay && this.direction === "down") {
            this.snapToTop(this.info)
        } else if (endPosY > this.halfWay && endPosY < this.quarterWay * 3 && this.direction === "up") {
            // snap to middle if not pull up far enough from top
            this.snapToMiddle(this.info)
        } else if (endPosY > this.halfWay && endPosY < this.quarterWay * 3 && this.direction === "down") {
            // snap back to middle if not pull down far enough from middle
            this.snapToMiddle(this.info)
        } else if (endPosY > this.quarterWay * 3 && this.direction === "up"){
            this.snapToBottom(this.info)
        }
    }

    private static snapToTop(info: HTMLElement): void {
        info.style.setProperty("transition", "top  0.4s ease")
        this.setScrollProperties(20)
        this.snappedTo = "top"
    }

    private static snapToMiddle(info: HTMLElement): void {
        console.log("snap to middle")
        info.style.setProperty("transition", "top  0.4s ease")
        this.setScrollProperties(this.sixtyPercent)
        setTimeout(() => {
            this.snappedTo = "middle"
        }, 400)
    }

    private static snapToBottom(info: HTMLElement): void {
        console.log("snap to bottom")
        info.style.setProperty("transition", "top  0.4s ease")
        this.setScrollProperties(this.fourFifths)
        setTimeout(() => {
            this.snappedTo = "bottom"
        }, 400)
    }

    private static setScrollProperties(amount: number) {
        const root = document.documentElement
        root.style.setProperty("--scroll", amount + "px")

        // NOW NOT USED - CONTAINER POSITIONED ABSOLUTELY INSTEAD
        root.style.setProperty("--scrollTop", amount + 80 + "px")
    }
}
