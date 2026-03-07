import { useState } from "react";
import { Link, useNavigate } from "react-router"
import Logo from "../../components/Logo";
import { setToken } from "../../globalToken";
import './Login.css'
import './auth-fix.css'

function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // 直接跳转到山大统一认证
    const handleSDULogin = () => {
        window.location.href = 'https://i.sdu.edu.cn/cas/proxy/login/page?forward=http%3a%2f%2f114.215.255.190%3a8080%2flogin';
        console.log('登录成功，跳转中...');
    };

    //不跳转登录
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userId.trim() || !password.trim()) {
            alert('登录失败：请填写学号和密码');
            return;
        }

        try {
            const requestUrl = `/api/login/service?id=${encodeURIComponent(userId.trim())}&pwd=${encodeURIComponent(password.trim())}`;
            const requestOptions = {
                method: 'POST',
                headers: {
                    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Host': '114.215.255.190:8080',
                    'Connection': 'keep-alive'
                },
                body: '',
                redirect: 'follow'
            };

            console.log('登录请求信息:', {
                url: requestUrl,
                method: requestOptions.method,
                headers: requestOptions.headers,
                body: requestOptions.body
            });

            const response = await fetch(requestUrl, requestOptions);

            let result = null;
            const rawText = await response.text();
            try {
                result = rawText ? JSON.parse(rawText) : null;
            } catch {
                result = rawText;
            }

            const tokenFromData = typeof result?.data === 'string' ? result.data.trim() : '';
            const successByDataToken = response.ok && !!tokenFromData;

            console.log('登录响应状态:', response.status);
            console.log('登录响应结果:', result ?? rawText);

            if (successByDataToken) {
                setToken(tokenFromData);
                alert('登录成功');
                navigate('/', { replace: true });
                return;
            }

            console.error('登录失败，后端返回:', result);
            alert(result?.message || '登录失败：账号或密码错误');
        } catch (error) {
            console.error('登录请求异常:', error);
            alert('登录失败：网络异常');
        }
    }

    return (
        <>
            <div className="login-page">
                <div className="login-container">
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
                            <button type="button" onClick={handleSDULogin}>使用山大统一认证登录</button>
                        </form>
                    </div>
                </div>


            </div>
        </>
    )
}
export default Login