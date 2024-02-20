import { json, redirect } from '@remix-run/react'
import html2canvas from 'html2canvas'
import React, { useEffect, useRef, useState } from 'react'

export const loader = () => {
    console.log("tttttt")
    return json({})
}
// function testing() {
//     const refi = useRef() as any
//     const valref = useRef() as any
//     const [names, setNames] = useState('sanchay')

//     const summittin = async () => {
//         // e.preventDefault()
//         console.log('first', refi.current)
//         await html2canvas(refi.current).then((canvas) => {
//             valref.current.value = canvas.toDataURL()
//             return canvas.toDataURL()
//         })
//         console.log("erwdfdiooooo", valref.current.value)
//         const formdata = new FormData()
//         formdata.append('hello', 'sanchay')
//         formdata.append('canvas', valref.current.value)
        // const response = await fetch('/test', {
        //     method: 'POST',
        //     body: formdata
        // })
//         console.log("terteter", response.json())
//     }
//     // console.log("erwdfd", valref.current)
//     return (
//         <>
//             <div style={{ width: "400px", height: "400px", backgroundColor: 'red', margin: "100px  200px", color: "wheat" }} >
//                 {/* <form method='post' onSubmit={(e) => {
//                     summittin(e)
//                 }}> */}
//                 sancha

//                 <input type="text" type='hidden' name='hello' />
//                 <input type="text" value={names} onChange={e => {
//                     setNames(e.target.value)

//                 }} name='datas' />
//                 <input type="text" ref={valref} type='hidden' name='canvass' />
//                 <button style={{ backgroundColor: "black", marginLeft: "100px" }} onClick={async () => {
//                     summittin()

//                 }} >Submit</button>
//                 {/* </form> */}
//             </div>

//             <div ref={refi}>
//                 <h2 style={{ padding: "20px 50px", color: "white", backgroundColor: "black", width: "300px" }}>My name is sanchay {names}</h2>
//             </div>
//         </>
//     )
// }

// export default testing

export const action = async ({ request }: any) => {
    const data = await request.formData();

    let formData = Object.fromEntries(data);
    console.log("wrertryuuu", formData)
    return redirect("/test")
}

function FormComponent() {
    const refi = useRef() as any
    const valref = useRef() as any
    const [names, setNames] = useState('sanchay')
    // State to manage the input value
    const [inputValue, setInputValue] = useState('');



    // Event handler to update the input value
    const handleSubmit = async (event: any) => {
        // event.preventDefault();
        // Update the input value
        const abc = await html2canvas(refi.current).then((canvas) => {
            setInputValue(canvas.toDataURL())
            return canvas.toDataURL()
        })
        setInputValue("eyuuuu");
        // Here you can submit the form or perform any other action
    };

    return (<>
        <form onSubmit={handleSubmit} method='post'>
            <label htmlFor="inputField" >Input Field:</label>
            <input
                type="text"
                id="inputField"
                name="inputField"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit">Submit</button>
        </form>
        <div ref={refi}>
            <h2 style={{ padding: "20px 50px", color: "white", backgroundColor: "black", width: "300px" }}>My name is sanchay {names}</h2>
        </div>
    </>
    );
}

export default FormComponent;