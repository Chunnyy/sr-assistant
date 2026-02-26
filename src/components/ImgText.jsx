function ImgText({ imageUrl, text, onClick }) {
    return (
        <>{
            text && (
                <span
                    className="img-text"
                    style={{
                        display: 'flex',
                        cursor: onClick ? 'pointer' : 'default'
                    }}
                    onClick={onClick}
                >
                    <img src={imageUrl} alt="" />
                    <span style={{
                        color: '#403E3E',
                        fontSize: '14px',
                        alignSelf: 'center'
                    }}>{text}</span>
                </span>
            )
        }
        </>
    )
}
export default ImgText