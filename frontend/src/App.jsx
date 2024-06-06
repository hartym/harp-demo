import {useState} from "react";
import PropTypes from 'prop-types';

import './App.css'

function getApiUrl(path) {
    return `http://localhost:7090${path}`
}

function DataTable({data}) {
    if (!data) {
        return '(null)';
    }
    if (typeof data === 'string') {
        return data
    }
    if (Array.isArray(data)) {
        return <table>
            {data.map((value, index) => (
                <tr key={index}>
                    <td>
                        <DataTable data={value}/>
                    </td>
                </tr>
            ))}
        </table>
    }
    return (
        <table>
            {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                    <th>{key}</th>
                    <td>
                        <DataTable data={value}/>
                    </td>
                </tr>
            ))}
        </table>
    )
}

DataTable.propTypes = {
    data: PropTypes.any
}

function App() {
    const [url, setUrl] = useState("/get")
    const [data, setData] = useState(null)
    const [noCache, setNoCache] = useState(false)

    function handleClick() {
        setData("loading")
        const headers = new Headers()
        if (noCache) {
            headers.append('Cache-Control', 'no-cache')
        }
        fetch(getApiUrl(url), {headers}).then(response => response.json()).then(data => {
            setData(data);
        })
    }

    return (
        <div style={{width: "100vw", height: "100vh", display: "flex"}}>
            <div style={{width: "400px", overflowY: "auto", borderRight: "2px solid #085E9F"}}>
                <h1>Harp Demo Sandbox</h1>
                <div>
                    <select value={url} style={{margin: "0.3em"}} onChange={e => setUrl(e.target.value)}>
                        <option value="/get">default (/get)</option>
                        <option value="/delay/1">1 second delay (/delay/1)</option>
                    </select>
                    <button onClick={handleClick}>Send</button>
                    <br/>
                    <label>
                        <input type="checkbox" onChange={(e) => setNoCache(e.target.checked)} checked={noCache}/> Bypass
                        cache
                    </label>
                </div>
                <div style={{margin: '0.5em'}}>
                    {data ? data === "loading" ? 'loading...' : <>
                        <h2>Response</h2>
                        <DataTable data={data}/></> : null}
                </div>
            </div>
            <iframe style={{flexGrow: 1, border: 0}} src="http://localhost:7080/"></iframe>
        </div>
    )
}

export default App
