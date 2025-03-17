import React from 'react';
import { useState, useEffect } from 'react'
import './HomePage.css'

function HomePage() {


       // const [Thumbnail, setThumbnail] = useState("Link Text");
       // const [Title, setTitle] = useState()
        //const [User, setUser] = useState()
        //const [views, setViews]= useState()
        //const [date, setDate] = useState()





        const [content, addContent] = useState<React.ReactNode[]>([]);

        useEffect(() => {
                const initialCards = [];

                for (let i = 0; i < 12; i++) {
                        const newCard = (
                            <div className="card" key={i}>
                                    <img
                                        className="thumbnail"
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Euro_coins_and_banknotes_%28cropped%29.jpg/1280px-Euro_coins_and_banknotes_%28cropped%29.jpg"
                                        alt="Money"
                                    />
                                    <h2 className="title">Make Money Fast</h2>
                                    <h3 className="username">Gröbbeln</h3>
                                    <h3 className="views">30 years ago</h3>
                                    <h3 className="date">2e^200 views</h3>
                                    <p className="card-bottom"></p>
                                    <a href="http://localhost:5173/video" className="fillParent"></a>
                            </div>
                        );
                        initialCards.push(newCard);
                }

                addContent(initialCards);
        }, []);


        const addCard = () => {
                const newCard = (
                    <div className="card" key={content.length}>
                            <img
                                className="thumbnail"
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Euro_coins_and_banknotes_%28cropped%29.jpg/1280px-Euro_coins_and_banknotes_%28cropped%29.jpg"
                                alt="Money"
                            />
                            <h2 className="title">Make Money Fast</h2>
                            <h3 className="username">Gröbbeln</h3>
                            <h3 className="views">30 years ago</h3>
                            <h3 className="date">2e^200 views</h3>
                            <p className="card-bottom"></p>
                            <a href="http://localhost:5173/video" className="fillParent"></a>
                    </div>
                );
                addContent((prevCards) => [...prevCards, newCard]);
        };



        return (
            <div id={"home-page"}>
                    {content}

                    <button onClick={addCard}>Add Card</button>
            </div>


        )
}

export default HomePage