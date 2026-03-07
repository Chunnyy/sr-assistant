import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import IntroduceItem from "./components/IntroduceItem"
import TeacherIntro from "./components/TeacherIntro";
import './Home.css'
import useGet from "../../hooks/useGet";

function Home() {

    const [teachers, setTeachers] = useState('');
    const [targetTeachers, setTargetTeachers] = useState('');
    const [teachersArr, setTeachersArr] = useState([]);
    const navigate = useNavigate();
    const { data, isPending, error } = useGet('/api/home');

    useEffect(() => {
        if (data) {

            console.log('首页接口返回', data);
        }
        if (data && data.data) {
            setTeachers(data.data.teacherTotal);
            setTargetTeachers(data.data.targetTeacherTotal);
            setTeachersArr(data.data.teachers);
        }
    }, [data]);

    const goToList = () => {
        navigate('/list');
    }

    const goToHelp = () => {
        navigate('/help');
    }

    return (
        <>
            <div className="home-page">

                <div className="welcome-section">
                    <h2>欢迎使用导师联系平台</h2>
                    <p>连接优秀导师，开启科研之路</p>
                </div>

                <div className="introduce-section">
                    <IntroduceItem title={"在职导师总数"} imageUrl={"assets/list.png"} num={teachers} tip={"覆盖多个研究方向"}></IntroduceItem>
                    <IntroduceItem title={"正在招生导师"} imageUrl={"assets/number.png"} num={targetTeachers} tip={"欢迎优秀学生加入"}></IntroduceItem>
                    <IntroduceItem title={"科研资源"} imageUrl={"assets/list.png"} num={"6+"} tip={"帮助文档和指南"}></IntroduceItem>
                </div>

                {
                    teachersArr.length > 0 &&
                    <div className="teachers-section">
                        <h3>推荐导师</h3>
                        <div className="teachers">
                            {teachersArr.slice(0, 3).map((teacher) => (
                                teacher && (
                                    <TeacherIntro key={teacher.id} id={teacher.id} name={teacher.name} tags={teacher.tags} photo={teacher.photo} demand={teacher.demand}></TeacherIntro>
                                )
                            ))}
                        </div>
                    </div>
                }


                <div className="quick-start-section">
                    <h3>快捷入口</h3>
                    <div className="quicks">
                        <div className="quick-item" onClick={goToList}>
                            <div className="header-bar">
                                <img src="/assets/list_blue.png" alt="" />
                                <h4>浏览导师列表</h4>
                            </div>
                            <p>查看所有导师的研究方向和招生信息</p>
                        </div>
                        <div className="quick-item" onClick={goToHelp}>
                            <div className="header-bar">
                                <img src="/assets/help_green.png" alt="" />
                                <h4>科研帮助资源</h4>
                            </div>
                            <p>获取论文写作、项目申报等科研指导</p>
                        </div>
                    </div>
                </div>

            </div>

        </>
    )
}
export default Home