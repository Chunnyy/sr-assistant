import { useNavigate } from "react-router"
import ResearchTags from "../../../components/ResearchTags";

function TeacherIntro({ id, name, tags, photo, demand }) {
    const navigate = useNavigate();

    const getDetail = () => {
        navigate(`/detail/${String(id)}`);
    }
    return (
        <>
            <div className="teacher-card">
                <div className="intro-part">
                    <img src={photo} alt="" style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        border: 'solid 1px grey'
                    }} />
                    <h4>{name}</h4>
                </div>
                <ResearchTags tags={tags} />
                <p style={{ color: demand ? '#45E14A' : '#FF3F3F', }}>
                    {demand ? '★ 正在招生' : '● 暂停招生'}
                </p>
                <button onClick={getDetail}>查看详情</button>
            </div>
        </>
    )
}
export default TeacherIntro