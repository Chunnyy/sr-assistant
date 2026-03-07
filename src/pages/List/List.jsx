import { useEffect, useRef, useState } from "react";
import { getToken } from '../../globalToken';
import TeacherIntro from "../Home/components/TeacherIntro";
import { useLocation, useNavigate } from 'react-router';
import { LIST_TAGS } from './tags';
import './List.css'

function List() {
    const PAGE_SIZE = 10;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedButton, setSelectedButton] = useState(null);  // 追踪当前选中的按钮
    const [current, setCurrent] = useState(1);
    const [size] = useState(37);
    const [total, setTotal] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const latestRequestIdRef = useRef(0);
    const navigate = useNavigate();
    const location = useLocation();
    const TAGS_PER_ROW = 7;
    const VISIBLE_ROWS = 2;
    const maxVisibleTags = TAGS_PER_ROW * VISIBLE_ROWS;
    const allTags = LIST_TAGS;
    const visibleTags = allTags.length > maxVisibleTags
        ? [...allTags.slice(0, maxVisibleTags - 1), '...']
        : allTags;

    // 获取数据函数
    const fetchList = async () => {
        const requestId = ++latestRequestIdRef.current;
        const token = getToken();
        if (!token) {
            alert('请先登录');
            return;
        }

        // 1. 构造字符串，**完全手写**，不要用 URLSearchParams
        // 模仿正确的 Node.js 代码示例
        // 核心思想：如果 searchTerm 是空，就写成 ?searchTerm，而不是 ?searchTerm=
        let url = '/api/search?';
        const hasMultiTags = selectedTags.length > 1;

        // --- 处理搜索词 ---
        if (!hasMultiTags && searchTerm && searchTerm.trim()) {
            url += `searchTerm=${encodeURIComponent(searchTerm)}`;
        } else {
            url += `searchTerm`; // 注意：这里没有等号，完全复刻 node-fetch 的错误写法，但后端接受了
        }

        // --- 处理标签 ---
        if (hasMultiTags) {
            selectedTags.forEach((tag) => {
                url += `&searchTags=${encodeURIComponent(tag)}`;
            });
        } else {
            url += `&searchTags=`; // 空值
        }

        // --- 分页 ---
        // 固定拉取 37 条数据，前端再按每页 10 条分页展示
        url += `&current=1&size=${size}`;

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

            // 只接收最后一次请求结果，避免旧请求覆盖新筛选结果
            if (requestId !== latestRequestIdRef.current) {
                return;
            }

            // 更新 UI
            setTeachers(result.data.records || []);
            setTotal(result.data.total || 0);
            setCurrent(1);
        } catch (error) {
            console.error('网络请求失败:', error);
        }
    };
    const handleTagClick = tag => {
        if (tag === '...') {
            const currentSelectedTags = selectedTags.length > 0
                ? selectedTags
                : (selectedButton ? [selectedButton] : []);
            navigate('/list/tags', { state: { selectedTags: currentSelectedTags } });
            return;
        }

        if (tag === '全部方向') {
            // 点击"全部方向"时清空搜索词和按钮选择
            setSearchTerm('');
            setSelectedButton(null);
            setSelectedTags([]);
        } else if (selectedTags.length > 0) {
            // 多选模式：继续增删标签
            if (selectedTags.includes(tag)) {
                const nextTags = selectedTags.filter((item) => item !== tag);
                if (nextTags.length === 1) {
                    // 退回单选模式，保持原有单标签行为
                    setSelectedTags([]);
                    setSelectedButton(nextTags[0]);
                    setSearchTerm(nextTags[0]);
                } else if (nextTags.length === 0) {
                    setSelectedTags([]);
                    setSelectedButton(null);
                    setSearchTerm('');
                } else {
                    setSelectedTags(nextTags);
                    setSelectedButton(null);
                    setSearchTerm('');
                }
            } else {
                setSelectedTags([...selectedTags, tag]);
                setSelectedButton(null);
                setSearchTerm('');
            }
        } else if (selectedButton === tag) {
            // 再次点击同一按钮时取消选择
            setSearchTerm('');
            setSelectedButton(null);
            setSelectedTags([]);
        } else if (selectedButton && selectedButton !== tag) {
            // 单选中点击第二个标签，切换为多选模式
            setSelectedTags([selectedButton, tag]);
            setSelectedButton(null);
            setSearchTerm('');
        } else {
            // 点击新按钮时设置 searchTerm 为该标签内容
            setSearchTerm(tag);
            setSelectedButton(tag);
            setSelectedTags([]);
        }
        setCurrent(1);
    }

    useEffect(() => {
        fetchList();
    }, [searchTerm, selectedTags]);

    useEffect(() => {
        const incomingState = location.state;
        if (!incomingState?.fromAllTags || !Array.isArray(incomingState.selectedTags)) {
            return;
        }

        const incomingTags = incomingState.selectedTags.filter((tag) => tag !== '全部方向');
        if (incomingTags.length > 1) {
            setSelectedTags(incomingTags);
            setSelectedButton(null);
            setSearchTerm('');
        } else if (incomingTags.length === 1) {
            // 保持单标签筛选行为不变
            setSelectedTags([]);
            setSelectedButton(incomingTags[0]);
            setSearchTerm(incomingTags[0]);
        } else {
            setSelectedTags([]);
            setSelectedButton(null);
            setSearchTerm('');
        }

        setCurrent(1);
        navigate('/list', { replace: true, state: null });
    }, [location.state, navigate]);

    const totalPages = Math.ceil(teachers.length / PAGE_SIZE);
    const pagedTeachers = teachers.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrent(page);
    };

    return (
        <>
            <div className="list-page">
                <div className="search-header">
                    <h2>导师列表</h2>
                    <p>共{total}位导师，正在招生5位</p>
                </div>
                <div className="search-box">
                    <img src="/assets/search.png" alt="" />
                    <input
                        type="text"
                        placeholder="搜索导师姓名或研究方向..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrent(1);
                        }}
                    />
                </div>
                <div className="tag-filter">
                    {visibleTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            style={{
                                padding: '8px 16px',
                                margin: '4px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: (selectedButton === tag || selectedTags.includes(tag)) ? '#1890ff' : '#fff',
                                color: (selectedButton === tag || selectedTags.includes(tag)) ? '#fff' : '#000',
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
                        pagedTeachers.length > 0 ? (pagedTeachers.map(teacher => (
                            teacher && (
                                <TeacherIntro key={teacher.id} id={teacher.id} name={teacher.name} tags={teacher.tags} photo={teacher.photo} demand={teacher.demand}></TeacherIntro>
                            )
                        ))) : (
                            <p>暂无符合条件的导师</p>
                        )
                    }
                </div>
                {totalPages > 1 && (
                    <div className="list-pagination">
                        <button
                            type="button"
                            onClick={() => handlePageChange(current - 1)}
                            disabled={current === 1}
                        >
                            上一页
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    type="button"
                                    className={current === page ? 'active' : ''}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => handlePageChange(current + 1)}
                            disabled={current === totalPages}
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
export default List