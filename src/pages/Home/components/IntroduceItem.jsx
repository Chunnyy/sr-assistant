function IntroduceItem({ title, imageUrl, tip, num }) {
    return (
        <>
            <div className="introduce-card">
                <div className="header-bar">
                    <h3>{title}</h3>
                    <img src={imageUrl} alt="" />
                </div>
                <span>{num}</span>
                <p>{tip}</p>
            </div>
        </>
    )
}
export default IntroduceItem