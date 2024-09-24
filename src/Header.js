import React from 'react';

export function Header(){
    return(
        <div id="Header">
            <div id="Title" style={{ paddingLeft:"20px", flexGrow: 2}}>
                <h1>Home</h1>
            </div>
            <hr style={{ border: "1px solid lightgray" }}></hr>
        </div>
    )
}