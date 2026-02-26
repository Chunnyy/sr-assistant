function Logo() {
    return (
        <>
            <div className="logo-item" style={{
                display: 'flex',
                flexDirection: 'row',
                columnGap: '5px',
                margin: 0,
            }}>
                <div className="logo" style={{
                    backgroundColor: '#367BFC',
                    width: '45px',
                    height: '45px',
                    alignContent: 'center',
                    justifySelf: 'center',
                    borderRadius: '15px',
                    color: 'white',
                    fontWight: '400',
                    textAlign: 'center',
                    margin: 0
                }}>SDU</div>
                <div className="logo-title" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    margin: 0,
                }}>
                    <h1 style={{
                        fontSize: '20px',
                        margin: 0,
                    }}>山东大学软件学院</h1>
                    <span style={{
                        color: '#9B9B9B',
                        fontSize: '12px',
                    }}>导师联系平台</span>
                </div>
            </div>
        </>
    )
}

export default Logo