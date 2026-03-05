import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getToken, clearToken } from '../../globalToken';
import ResearchTags from '../../components/ResearchTags';
import './List.css'

function List() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedButton, setSelectedButton] = useState(null);  // 追踪当前选中的按钮
    const [current, setCurrent] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const navigate = useNavigate();

    const allTags = [
        '全部方向', '人工智能', '机器学习', '深度学习', '软件工程',
        '需求工程', '软件测试', '计算机网络', '网络安全', '区块链',
        '数据挖掘', '大数据分析', '推荐系统', '移动计算', '物联网',
        '边缘计算', '计算机视觉', '图像处理', '模式识别'
    ];

    // 获取数据函数
    const fetchList = async () => {
        const token = getToken();
        if (!token) {
            alert('请先登录');
            return;
        }

        // 1. 构造字符串，**完全手写**，不要用 URLSearchParams
        // 模仿正确的 Node.js 代码示例
        // 核心思想：如果 searchTerm 是空，就写成 ?searchTerm，而不是 ?searchTerm=
        let url = '/api/search?';

        // --- 处理搜索词 ---
        if (searchTerm && searchTerm.trim()) {
            url += `searchTerm=${encodeURIComponent(searchTerm)}`;
        } else {
            url += `searchTerm`; // 注意：这里没有等号，完全复刻 node-fetch 的错误写法，但后端接受了
        }

        // --- 处理标签 ---
        let tagsPart = '';
        if (selectedTags.length > 0 && !selectedTags.includes('全部方向')) {
            tagsPart = JSON.stringify(selectedTags);
            url += `&searchTags=${encodeURIComponent(tagsPart)}`;
        } else {
            url += `&searchTags=`; // 空值
        }

        // --- 分页 ---
        url += `&current=${current}&size=${size}`;

        console.log('正在发送和 Node.js 一模一样的请求 URL:', url);

        try {
            // 2. 发送请求
            const response = await fetch(url, {
                method: 'POST', // 严格一致
                headers: {
                    // 完全一致的请求头
                    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                    'Host': '114.215.255.190:8080', // 虽然浏览器可能会忽略，但加上以防万一
                    'Connection': 'keep-alive',
                    // 这是一个关键补丁：告诉浏览器我们真的不需要 Body 验证
                    'Content-Length': '0' 
                },
                mode: 'cors',
                // 关键点：强制 body 为空，或者用 null，或者用空字符串
                // 这是模仿 Node.js 的默认行为，node-fetch 如果没有 body 就没有
                body: undefined 
            });

            const result = await response.json();
            console.log('收到后端回复:', result);
            
            // 更新 UI
            setTeachers(result.data.records || []);
            setTotal(result.data.total || 0);
            setCurrent(result.data.current || 1);
        } catch (error) {
            console.error('网络请求失败:', error);
        }
    };
    const handleTagClick = tag => {
        if (tag === '全部方向') {
            // 点击"全部方向"时清空搜索词和按钮选择
            setSearchTerm('');
            setSelectedButton(null);
        } else if (selectedButton === tag) {
            // 再次点击同一按钮时取消选择
            setSearchTerm('');
            setSelectedButton(null);
        } else {
            // 点击新按钮时设置 searchTerm 为该标签内容
            setSearchTerm(tag);
            setSelectedButton(tag);
        }
        setCurrent(1);
    }

    useEffect(() => {
        fetchList();
    }, [searchTerm, current]);
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
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            style={{
                                padding: '8px 16px',
                                margin: '4px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: selectedButton === tag ? '#1890ff' : '#fff',
                                color: selectedButton === tag ? '#fff' : '#000',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <div className="teacher-grid">
                    {
                        teachers.length > 0 ? (teachers.map(teacher => (
                            <div className="teacher-card" key={teacher.id}>
                                <h4>{teacher.name}</h4>
                                <ResearchTags tags={teacher.tags} />
                                <div className="achievement-part"></div>
                                <p>★正在招生</p>
                                <button onClick={() => navigate(`/detail/${String(teacher.id)}`)}>查看详情</button>
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