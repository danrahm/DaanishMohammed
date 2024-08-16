import React, { useEffect, useState } from "react";

const HelloWorld = () => {
    const [data, setData] = useState();

    useEffect(() => {
        async function getWord() {
            const response = await fetch("http://localhost:4000/word",
            {
                method: "GET"
            }
        );
        if(response.ok){
           const word = await response.json();
           setData(word.word); 
        }
        }  
        getWord();

        return;
    }, []);

    return (
        <div className="container">
            <h1>Hello, World!</h1>
            <p>Data from MongoDB: {data}</p>
        </div>
    );
};

export default HelloWorld;