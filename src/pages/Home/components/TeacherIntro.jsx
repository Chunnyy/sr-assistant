import { useNavigate } from "react-router"
import ResearchTags from "../../../components/ResearchTags";

function TeacherIntro({ id, name, tags }) {
    const navigate = useNavigate();

    const getDetail = () => {
        navigate(`/detail/${String(id)}`);
    }
    return (
        <>
            <div className="teacher-card">
                <h4>{name}</h4>
                <ResearchTags tags={tags} />
                <div className="achievement-part"></div>
                <p>★正在招生</p>
                <button onClick={getDetail}>查看详情</button>
            </div>
        </>
    )
}
export default TeacherIntro