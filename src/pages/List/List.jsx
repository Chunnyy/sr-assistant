import { useEffect, useState } from "react";
import { getToken, clearToken } from '../../globalToken';
import './List.css'

function List() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [current, setCurrent] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);
    const [teachers, setTeachers] = useState([]);

    const allTags = [
        '全部方向', '人工智能', '机器学习', '深度学习', '软件工程',
        '需求工程', '软件测试', '计算机网络', '网络安全', '区块链',
        '数据挖掘', '大数据分析', '推荐系统', '移动计算', '物联网',
        '边缘计算', '计算机视觉', '图像处理', '模式识别'
    ];

    const fetchList = async () => {
        // use shared global token
        const token = getToken();
        if (!token) {
            // no token, user is not logged in
            alert('请先登录');
            return;
        }

        const params = new URLSearchParams();
        params.append('searchTerm', searchTerm || '');
        params.append('searchTags', JSON.stringify(
            selectedTags.length > 0 && !selectedTags.includes('全部方向')
                ? selectedTags
                : []
        ));
        params.append('current', current.toString());
        params.append('size', size.toString());

        console.log('请求参数:', params.toString());

        const res = await fetch('/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: params
        });
        console.log(res)
        if (res.status === 401 || res.status === 403) {
            // token 无效或过期
            clearToken();
            alert('身份已过期，请重新登录');
            return;
        }

        const data = await res.json();
        setTotal(data.data.total);
        setCurrent(data.data.current);
        setTeachers(data.data.records);
        console.log(data);

    };

    const handleTagClick = tag => {
        if (tag === '全部方向') {
            setSelectedTags([])
        } else {
            setSelectedTags(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            );
        }
        setCurrent(1);
    }

    useEffect(() => {
        fetchList();
    }, [current, selectedTags]);
    return (
        <>
            <div className="list-page">
                <div className="search-header">
                    <h2>导师列表</h2>
                    <p>共{total}位导师，正在招生5位</p>
                </div>
                <div className="search-box">
                    <img src="/assets/search.png" alt="" />
                    <input type="text" placeholder="搜索导师姓名或研究方向..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="tag-filter">
                    {allTags.map(tag => (
                        <span key={tag} onClick={() => handleTagClick(tag)}>{tag}</span>
                    ))}
                </div>
                <div className="teacher-grid">
                    {
                        teachers.length > 0 ? (teachers.map(teacher => (
                            <div className="teacher-card" key={teacher.id}>
                                <div className="card-header"
                                >
                                    <div className="basic-intro">
                                        <h3>{teacher.name}</h3>
                                        <span>招生中</span>
                                    </div>
                                </div>
                                <div className="research-intro">
                                    <p>研究方向：</p>
                                    <div className="tags">
                                        {teacher.tags?.map((tag, index) => (
                                            <span key={index} className="research-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="contact-intro">
                                    <p>✉ {teacher.email}</p>
                                </div>
                            </div>
                        ))) : (
                            <p>暂无符合条件的导师</p>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default List