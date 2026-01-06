'use client';

export default function CustomLoader() {
    return (
        <div className="loader">
            <span className="item item-1"></span>
            <span className="item item-2"></span>
            <span className="item item-3"></span>
            <span className="item item-4"></span>

            <style jsx>{`
                .loader {
                    width: 85px;
                    height: 85px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-content: space-between;
                    animation: loading-rotate 3s linear infinite;
                }

                .item {
                    width: 40px;
                    height: 40px;
                    display: block;
                    box-sizing: border-box;
                }

                .item-1 {
                    background-color: #50DE68;
                    border-radius: 20px 20px 0 20px;
                    border-left: #ffffff 4px solid;
                    border-top: #f7f7f7 4px solid;
                }

                .item-2 {
                    background-color: rgb(32, 80, 46);
                    border-radius: 20px 20px 20px 0;
                    border-right: #ffffff 4px solid;
                    border-top: #f7f7f7 4px solid;
                }

                .item-3 {
                    background-color: rgb(0, 255, 55);
                    border-radius: 20px 0 20px 20px;
                    border-left: #ffffff 4px solid;
                    border-bottom: #f7f7f7 4px solid;
                }

                .item-4 {
                    background-color: rgb(32, 182, 32);
                    border-radius: 0 20px 20px 20px;
                    border-right: #ffffff 4px solid;
                    border-bottom: #f7f7f7 4px solid;
                }

                @keyframes loading-rotate {
                    0% {
                        transform: scale(1) rotate(0);
                    }

                    20% {
                        transform: scale(1) rotate(72deg);
                    }

                    40% {
                        transform: scale(0.5) rotate(144deg);
                    }

                    60% {
                        transform: scale(0.5) rotate(216deg);
                    }

                    80% {
                        transform: scale(1) rotate(288deg);
                    }

                    100% {
                        transform: scale(1) rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}
