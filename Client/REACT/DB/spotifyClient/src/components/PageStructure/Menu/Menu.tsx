import { Link } from "react-router"

const Menu = () => {
    return (
        <nav>
            <Link to="/Play">Reproductor</Link>
            <Link to="/SongManagment">Gestío cançons</Link>
        </nav>
    )
}

export default Menu;