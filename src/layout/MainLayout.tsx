import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

import s from './MainLayout.module.css'

function MainLayout(){
    return(
        <div className={s.layout}>
      <Header />

      <main className={s.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
    )
}

export default MainLayout;