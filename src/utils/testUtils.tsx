import StoreProvider from "@/components/storeProvider"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"


const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <StoreProvider>
        {children}
    </StoreProvider>
}

const customRender = (ui: any, options?: any)=> {
    render(ui, {wrapper: AllTheProviders, ...options})
}

export * from "@testing-library/react"

export {customRender as render}
