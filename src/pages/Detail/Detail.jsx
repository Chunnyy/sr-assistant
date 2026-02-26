import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ResearchTags from "../../components/ResearchTags";
import useGet from "../../hooks/useGet";
import './Detail.css'
import ImgText from "../../components/ImgText";

function Detail() {
    const { id } = useParams();
    const [teacher, setTeacher] = useState({});
    const { data, isPending, error } = useGet(`/api/detail/${id}`);
    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.data) {
            setTeacher(data.data);
        }
    }, [id, data]);

    const goToList = () => {
        navigate('/list');
    }

    return (
        <>
            <div className="detail-page">
                <div className="to-list">
                    <ImgText imageUrl={'/assets/back.png'} text={'返回导师列表'} onClick={goToList} />
                </div>

                <div className="teacher-section">
                    <div className="teacher">
                        <h3>{teacher.name}</h3>
                        <p>
                            <ImgText imageUrl={'/assets/email.png'} text={teacher.email} />
                            <ImgText imageUrl={'/assets/location.png'} text={teacher.department} />
                        </p>
                        <div className="research-tags">
                            <p>研究方向：</p>
                            <ResearchTags tags={teacher.tags} />
                        </div>
                    </div>
                    <div className="status">正在招生</div>
                </div>

                <div className="intro-section">
                    <h4>个人简介</h4>
                    <p>{teacher.introduction}</p>
                </div>

                <div className="achievement-section">
                    <h4>主要成就</h4>
                    <p>{teacher.achievement}</p>
                </div>

                <div className="project-section"></div>

                <div className="contact-section">
                    <h4>联系导师</h4>
                    <p>如果您对该导师的研究方向感兴趣，可以通过以下方式联系</p>
                    <ImgText imageUrl={'/assets/email.png'} text={`邮箱：${teacher.email}`} />
                    <ImgText imageUrl={'/assets/location.png'} text={`办公室：${teacher.department}`} />
                    <p>建议：发送邮件时请附上个人简介和研究兴趣，说明您对导师研究方向的理解和期望。</p>
                </div>

            </div>
        </>
    )
}

export default Detail