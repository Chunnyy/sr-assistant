import './Help.css'
import { useState, useEffect, useMemo } from 'react';
import { getToken, clearToken } from '../../globalToken';
import { useNavigate } from 'react-router';

function Help() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [current, setCurrent] = useState(1);
    const [size] = useState(10);
    const [total, setTotal] = useState(0);
    const [advice, setAdvice] = useState([]);
    const navigate = useNavigate();

    const allTags = [
        '全部', '写作技巧', '项目申请', '研究方向', '学术交流', '工具资源', '培养计划'
    ];

    const fetchList = async () => {
        const token = getToken();
        if (!token) {
            alert('请先登录');
            return;
        }

        // 构造 URL，保持和后端兼容的 query 参数格式
        let url = '/api/advice?';

        if (selectedButton && selectedButton !== '全部') {
            url += `searchTag=${encodeURIComponent(selectedButton)}`;
        } else {
            url += 'searchTag';
        }

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
            setAdvice(data?.data?.records || []);
            setTotal(data?.data?.total || 0);
            setCurrent(data?.data?.current || 1);
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

    const normalizeAdvice = useMemo(() => {
        const pick = (item, keys, fallback = '') => {
            for (const key of keys) {
                if (item?.[key] !== undefined && item?.[key] !== null && `${item[key]}`.trim() !== '') {
                    return item[key];
                }
            }
            return fallback;
        };

        return advice.map((item, index) => {
            const tagValue = pick(item, ['tag', 'adviceTag', 'category', 'type'], '未分类');
            return {
                id: pick(item, ['id', 'adviceId', 'resourceId'], `advice-${index}`),
                tag: Array.isArray(tagValue) ? tagValue.join(' / ') : `${tagValue}`,
                title: pick(item, ['title', 'adviceTitle', 'name'], '未命名资源'),
                content: pick(item, ['content', 'adviceContent', 'summary', 'description', 'intro'], '暂无简介')
            };
        });
    }, [advice]);

    const filteredAdvice = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) {
            return normalizeAdvice;
        }

        return normalizeAdvice.filter((item) => {
            return (
                item.title.toLowerCase().includes(keyword) ||
                item.content.toLowerCase().includes(keyword) ||
                item.tag.toLowerCase().includes(keyword)
            );
        });
    }, [normalizeAdvice, searchTerm]);

    useEffect(() => {
        fetchList();
    }, [current, selectedButton]);

    const handleViewDetail = (item) => {
        navigate('/Help/detail', {
            state: { item }
        });
    };

    return (
        <>
            <div className="help-page">
                <div className="search-header">
                    <h2>科研帮助资源</h2>
                    <p>共{total}条资源，支持分类筛选和关键词检索</p>
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
                                className={selectedButton === tag ? 'active' : ''}
                                onClick={() => handleTagClick(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="source-grid">
                    {filteredAdvice.length > 0 ? (
                        filteredAdvice.map((item) => (
                            <article className="source-card" key={item.id}>
                                <span className="source-tag">[{item.tag}]</span>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                                <button
                                    type="button"
                                    className="detail-btn"
                                    onClick={() => handleViewDetail(item)}
                                >
                                    查看详情
                                </button>
                            </article>
                        ))
                    ) : (
                        <p className="empty-text">暂无符合条件的资源</p>
                    )}
                </div>
            </div>
        </>
    )

}
export default Help