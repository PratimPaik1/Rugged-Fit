import react from "react"
import { Outlet } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"

function HomeLayout() {
    return (
        <>
            <Nav />
            <Outlet />
            <Footer />
        </>
    )
}

export default HomeLayout