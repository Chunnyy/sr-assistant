import { useState } from "react";
import { Link } from "react-router"

function Signup() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();

        if (!userId.trim() || !password.trim() || !confirmPassword.trim()) {
            alert('注册失败：请完整填写信息');
            return;
        }

        if (password !== confirmPassword) {
            alert('注册失败：两次输入的密码不一致');
            return;
        }

        alert('注册成功');
    };

    return (
        <>
            <div className="signup-section">
                <img src="/assets/login.jpg" alt="" />
                <h2>欢迎注册</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-item">
                        <img src="/assets/user.png" alt="" />
                        <input
                            type="text"
                            placeholder="请输入学号"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                    <div className="form-item">
                        <img src="/assets/password.png" alt="" />
                        <input
                            type="password"
                            placeholder="请输入密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-item">
                        <img src="/assets/password.png" alt="" />
                        <input
                            type="password"
                            placeholder="请确认密码"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <Link to='/login'>已有账号？去登录</Link>
                    <button type="submit">注册</button>
                </form>
            </div>
        </>
    )

}
export default Signup