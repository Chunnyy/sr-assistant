import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LIST_TAGS } from './tags';
import './AllTags.css';

const PINYIN_INITIAL_BOUNDARIES = [
  { letter: 'A', marker: '阿' },
  { letter: 'B', marker: '芭' },
  { letter: 'C', marker: '擦' },
  { letter: 'D', marker: '搭' },
  { letter: 'E', marker: '蛾' },
  { letter: 'F', marker: '发' },
  { letter: 'G', marker: '噶' },
  { letter: 'H', marker: '哈' },
  { letter: 'J', marker: '击' },
  { letter: 'K', marker: '喀' },
  { letter: 'L', marker: '垃' },
  { letter: 'M', marker: '妈' },
  { letter: 'N', marker: '拿' },
  { letter: 'O', marker: '哦' },
  { letter: 'P', marker: '啪' },
  { letter: 'Q', marker: '期' },
  { letter: 'R', marker: '然' },
  { letter: 'S', marker: '撒' },
  { letter: 'T', marker: '塌' },
  { letter: 'W', marker: '挖' },
  { letter: 'X', marker: '昔' },
  { letter: 'Y', marker: '压' },
  { letter: 'Z', marker: '匝' }
];

const getInitialByPinyin = (tag) => {
  const firstChar = (tag || '').trim().charAt(0);
  if (!firstChar) {
    return '#';
  }

  if (/[A-Za-z]/.test(firstChar)) {
    return firstChar.toUpperCase();
  }

  for (let i = PINYIN_INITIAL_BOUNDARIES.length - 1; i >= 0; i -= 1) {
    const current = PINYIN_INITIAL_BOUNDARIES[i];
    if (firstChar.localeCompare(current.marker, 'zh-CN-u-co-pinyin') >= 0) {
      return current.letter;
    }
  }

  return '#';
};

function AllTags() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSelectedTags = useMemo(() => {
    if (!Array.isArray(location.state?.selectedTags)) {
      return [];
    }
    return location.state.selectedTags.filter((tag) => tag !== '全部方向');
  }, [location.state]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);
  const pinyinCollator = useMemo(
    () => new Intl.Collator('zh-CN-u-co-pinyin', { sensitivity: 'base' }),
    []
  );

  const filteredTags = LIST_TAGS.filter((tag) => {
    if (tag === '全部方向') {
      return false;
    }
    if (!searchTerm.trim()) {
      return true;
    }
    return tag.includes(searchTerm.trim());
  });

  const groupedTags = useMemo(() => {
    const sortedTags = [...filteredTags].sort((a, b) => pinyinCollator.compare(a, b));
    const grouped = {};

    sortedTags.forEach((tag) => {
      const initial = getInitialByPinyin(tag);
      if (!grouped[initial]) {
        grouped[initial] = [];
      }
      grouped[initial].push(tag);
    });

    return Object.keys(grouped)
      .sort((a, b) => {
        if (a === '#') {
          return 1;
        }
        if (b === '#') {
          return -1;
        }
        return a.localeCompare(b);
      })
      .map((initial) => ({
        initial,
        tags: grouped[initial]
      }));
  }, [filteredTags, pinyinCollator]);

  const handleTagClick = (tag) => {
    if (tag === '全部方向') {
      setSelectedTags([]);
      return;
    }

    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
      return;
    }

    setSelectedTags([...selectedTags, tag]);
  };

  const handleConfirm = () => {
    navigate('/list', {
      state: {
        fromAllTags: true,
        selectedTags
      }
    });
  };

  return (
    <div className="all-tags-page">
      <div className="all-tags-header">
        <h2>全部标签</h2>
        <button type="button" onClick={() => navigate('/list')}>
          返回导师列表
        </button>
      </div>

      <div className="all-tags-search-box">
        <img src="/assets/search.png" alt="" />
        <input
          type="text"
          placeholder="搜索标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="all-tags-group-block">
        <h3 className="all-tags-group-title">全部</h3>
        <div className="all-tags-grid">
          <button
            type="button"
            className="all-tag-item"
            onClick={() => handleTagClick('全部方向')}
            style={{
              padding: '8px 16px',
              margin: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: selectedTags.length === 0 ? '#1890ff' : '#fff',
              color: selectedTags.length === 0 ? '#fff' : '#000',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            全部方向
          </button>
        </div>
      </div>

      {groupedTags.map((group) => (
        <div className="all-tags-group-block" key={group.initial}>
          <h3 className="all-tags-group-title">{group.initial}</h3>
          <div className="all-tags-grid">
            {group.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="all-tag-item"
                onClick={() => handleTagClick(tag)}
                style={{
                  padding: '8px 16px',
                  margin: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: selectedTags.includes(tag) ? '#1890ff' : '#fff',
                  color: selectedTags.includes(tag) ? '#fff' : '#000',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="all-tags-actions">
        <button type="button" onClick={handleConfirm}>确定</button>
      </div>
    </div>
  );
}

export default AllTags;
