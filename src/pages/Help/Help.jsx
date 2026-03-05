import './Help.css'
import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../../globalToken';

function Help() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState([]);
    const [selectedButton, setSelectedButton] = useState(null);  // 追踪当前选中的按钮
    const [current, setCurrent] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);
    const [advice, setAdvice] = useState([]);

    const allTags = [
        '全部', '写作技巧', '项目申请', '研究方向', '学术交流', '工具资源', '培养计划'
    ];

    const fetchList = async () => {
        const token = getToken();
        if (!token) {
            alert('请先登录');
            return;
        }

        // 构造 URL，类似 List.jsx 的方式
        let url = '/api/advice?';

        // searchTag 参数（无等号表示空值）
        url += 'searchTag';

        // 分页参数
        url += `&current=${current}&size=${size}`;

        console.log('发送请求 URL:', url);

        try {
            // 使用与 Apifox 示例一致的请求头
            const myHeaders = new Headers();
            myHeaders.append('User-Agent', 'Apifox/1.0.0 (https://apifox.com)');
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${token}`);
            myHeaders.append('Accept', '*/*');
            myHeaders.append('Connection', 'keep-alive');

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: '',  // 空字符串
                redirect: 'follow'
            };

            const res = await fetch(url, requestOptions);
            console.log(res);
            if (res.status === 401 || res.status === 403) {
                clearToken();
                alert('身份已过期，请重新登录');
                return;
            }

            if (!res.ok) {
                const errText = await res.text();
                console.error('advice error', res.status, errText);
                return;
            }

            const data = await res.json();
            console.log('收到回复:', data);
            setAdvice(data.data.records || []);
            setTotal(data.data.total || 0);
            setCurrent(data.data.current || 1);
        } catch (error) {
            console.error('网络请求失败:', error);
        }
    };

    const handleTagClick = tag => {
        if (tag === '全部') {
            setSelectedButton(null);
        } else if (selectedButton === tag) {
            setSelectedButton(null);
        } else {
            setSelectedButton(tag);
        }
        setCurrent(1);
    }

    useEffect(() => {
        fetchList();
    }, [current, selectedButton]);
    return (
        <>
            <div className="help-page">
                <div className="search-header">
                    <h2>科研帮助资源</h2>
                    <p>为本科生提供入门指导和实用资源</p>
                </div>
                <div className="search-box">
                    <img src="/assets/search.png" alt="" />
                    <input type="text" placeholder="搜索博客、经验分享..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="tags-filter">
                    <p>资源分类</p>
                    <div className="tags">
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
                </div>
                <div className="source-grid">

                </div>
            </div>
        </>
    )

}
export default Help