import { useState } from "react";
import { Link } from "react-router"
import Logo from "../../components/Logo";
import './Login.css'
function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    // 直接跳转到山大统一认证
    const handleSDULogin = () => {
        window.location.href = 'https://i.sdu.edu.cn/cas/proxy/login/page?forward=http%3a%2f%2f114.215.255.190%3a8080%2flogin';
        console.log('登录成功，跳转中...');
    };

    //不跳转登录
    const handleLogin = async (e) => {
        e.preventDefault();
    }

    return (
        <>
            <div className="login-page">
                <div className="left-section">
                    <img src="/assets/login.jpg" alt="" />
                </div>
                <div className="right-section">
                    <Logo />
                    <form onSubmit={handleLogin}>
                        <h2>欢迎登录</h2>
                        <div className="form-item">
                            <img src="/assets/user.png" alt="" />
                            <input type="text" placeholder="请输入学号" value={userId} onChange={(e) => setUserId(e.target.value)} />
                        </div>
                        <div className="form-item">
                            <img src="/assets/password.png" alt="" />
                            <input type="password" placeholder="请输入密码" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Link to='/signup'>还没有账号？去注册</Link>
                        <button type="submit">登录</button>
                        <button onClick={handleSDULogin}>使用山大统一认证登录</button>
                    </form>
                </div>

            </div>
        </>
    )
}
export default Login