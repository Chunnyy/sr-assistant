function ResearchTags({ tags }) {
    return (
        <>
            <div className="tags-part" style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
            }}>
                {tags && tags.map((tag, index) => (
                    <span key={index} style={{
                        backgroundColor: '#A8C6FF6B',
                        color: '#367BFC',
                        fontSize: '13px',
                        borderRadius: '13px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        textWrap: 'nowrap',
                        justifySelf: 'center'
                    }}>{tag}</span>
                ))}
            </div>
        </>
    )
}
export default ResearchTags