import './Help.css'
import { useState, useEffect } from 'react';
import { getToken, clearToken } from '../../globalToken';

function Help() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState([]);
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

        const params = new URLSearchParams();
        params.append('searchTerm', searchTerm || '');
        params.append('searchTag', JSON.stringify(
            selectedTag.length > 0 && !selectedTag.includes('全部')
                ? selectedTag
                : []
        ));
        params.append('current', current.toString());
        params.append('size', size.toString());

        console.log('请求参数:', params.toString());

        const res = await fetch('/api/advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            body: params
        });
        console.log(res)
        if (res.status === 401 || res.status === 403) {
            // token失效，清除并跳转登录
            clearToken();
            alert('身份已过期，请重新登录');
            return;
        }

        const data = await res.json();
        console.log(data);

    };

    const handleTagClick = tag => {
        if (tag === '全部') {
            setSelectedTag([])
        } else {
            setSelectedTag(prev =>
                prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
            );
        }
        setCurrent(1);
    }

    useEffect(() => {
        fetchList();
    }, [current, selectedTag]);
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
                            <span key={tag} onClick={() => handleTagClick(tag)}>{tag}</span>
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