import { Link } from "react-router"
function Signup() {
    return (
        <>
            <div className="signup-section">
                <img src="/assets/login.jpg" alt="" />
                <h2>欢迎注册</h2>
                <form action="">
                    <div className="form-item">
                        <img src="/assets/user.png" alt="" />
                        <input type="text" placeholder="请输入学号" />
                    </div>
                    <div className="form-item">
                        <img src="/assets/password.png" alt="" />
                        <input type="password" placeholder="请输入密码" />
                    </div>
                    <div className="form-item">
                        <img src="/assets/password.png" alt="" />
                        <input type="password" placeholder="请确认密码" />
                    </div>
                    <Link to='/login'>已有账号？去登录</Link>
                    <button>注册</button>
                </form>
            </div>
        </>
    )

}
export default Signup