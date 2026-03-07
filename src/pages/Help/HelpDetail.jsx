import './HelpDetail.css';
import { useLocation, useNavigate } from 'react-router';

function HelpDetail() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const item = state?.item;

    return (
        <div className="help-detail-page">
            <button
                type="button"
                className="back-link"
                onClick={() => navigate('/Help')}
            >
                {'<- 返回科研帮助首页'}
            </button>

            <section className="detail-panel">
                {item ? (
                    <>
                        <h1>{item.title}</h1>
                        <p>{item.content}</p>
                    </>
                ) : (
                    <>
                        <h1>未找到详情内容</h1>
                        <p>请从科研帮助列表点击“查看详情”进入本页面。</p>
                    </>
                )}
            </section>
        </div>
    );
}

export default HelpDetail;
