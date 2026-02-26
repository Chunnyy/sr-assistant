function ImgText({ imageUrl, text }) {
    return (
        <>{
            text && (
                <span className="img-text" style={{
                    display: 'flex',
                }}>
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