import { NavLink, useLocation, useNavigate } from "react-router"
import Logo from "../components/Logo"
import ImgText from "../components/ImgText"
import { clearToken, getToken } from '../globalToken';
import './Header.css'

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!getToken();
    const isLoginPage = location.pathname === '/login';

    const handleAuthClick = () => {
        if (isLoggedIn) {
            clearToken();
        }
        navigate('/login');
    };

    return (
        <>
            <div className="header-section">
                <header>
                    <Logo />
                    {!isLoginPage && (
                        <ImgText
                            imageUrl={isLoggedIn ? '/assets/logout.png' : '/assets/user.png'}
                            text={isLoggedIn ? '退出登录' : '去登录'}
                            onClick={handleAuthClick}
                        />
                    )}
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