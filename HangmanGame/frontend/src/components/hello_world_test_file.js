import React, { useEffect, useState } from "react";

const HelloWorld = () => {
    const [data, setData] = useState();
    const [form, setForm] = useState("");

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

    // Used to update the Json object from the form
    function updateForm(jsonObj){
        return setForm((prevJsonObj) => {
            return {...prevJsonObj, ...jsonObj};
        });
    }

    async function onSubmit(e) {
        let response;
        e.preventDefault();

        const letterGuess = {
            guess: form.guess
        };

        response = await fetch("http://localhost:4000/guess",
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(letterGuess),
        })
        .catch(error => {
            window.alert(error);
            return;
        });

        if(response.status === 200){
            const updatedString = await response.json();
            setData(updatedString.word);
        } else if(response.status === 250) {
            const updatedString = await response.json();
            setData(updatedString.word);
            window.alert("Thats the correct answer!");
        } else {
            window.alert("THis is where the error from the back end happends");
        }
    }


    return (
        <div className="container">
            <h1>Hello, World!</h1>
            <p>Data from MongoDB: {data}</p>

        <h3>User Guess</h3>
        <form onSubmit={onSubmit}>
            <div>
                <label>Guess: </label>
                <input
                    type="text"
                    id="guess"
                    value={form.guess}
                    maxLength={"1"}
                    onChange={(e) => updateForm({ guess: e.target.value})}
                />
            </div>
            <br/>
            <div>
                <input
                    type="submit"
                    value="Submit Guess"
                />
            </div>
        </form>
        </div>
    );
};

export default HelloWorld;