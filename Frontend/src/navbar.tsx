import './navbar.css'
import { Link } from "react-router-dom"
import {signOut} from './routes/login'

const Navbar = () => {

    return (

        <nav className="navbar">
            <div className="identifier">
                <Link to={""}>Projektiryhmä A</Link>
            </div>
            <div className="nav-links">
                <ul className="nav-items">
                    <li>
                        <Link to={"asetukset/1"}>Asetukset</Link>
                    </li>
                    <li>
                        <a href="https://henrikhietanen.grafana.net/public-dashboards/c70202bf76624d49b246711b7153e171">Historia</a>
                    </li>
                    <li>
                       <button onClick={signOut} className="logoff">Kirjaudu ulos</button>
                    </li>
                    <li>
                        <Link to={"kirjaudu"}><button className="logoff">Kirjaudu sisään</button></Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar