import { NavLink, useNavigate } from "react-router"
import Logo from "../components/Logo"
import ImgText from "../components/ImgText"
import { clearToken } from '../globalToken';
import './Header.css'
function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        clearToken();
        navigate('/login');
    }

    return (
        <>
            <div className="header-section">
                <header>
                    <Logo />
                    <ImgText imageUrl={'/assets/logout.png'} text={'退出登录'} onClick={handleLogout} />
                </header>
                <nav>
                    <NavLink to="/" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    } end>
                        {({ isActive }) => (
                            <>
                                <img src={isActive ? '/assets/home_blue.png' : '/assets/home.png'} alt="" />
                                <span>首页</span>
                            </>
                        )}
                    </NavLink>
                    <NavLink to="/list" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        {({ isActive }) => (
                            <>
                                <img src={isActive ? '/assets/list_blue.png' : '/assets/list.png'} alt="" />
                                <span>导师列表</span>
                            </>
                        )}
                    </NavLink>
                    <NavLink to="/help" className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }>
                        {({ isActive }) => (
                            <>
                                <img src={isActive ? '/assets/help_blue.png' : '/assets/help.png'} alt="" />
                                <span>科研帮助</span>
                            </>
                        )}
                    </NavLink>
                </nav>
            </div>

        </>
    )
}
export default Header