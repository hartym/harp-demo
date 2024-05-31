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
                      <DataTable data={value} />
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
                        <DataTable data={value} />
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
    const [count, setCount] = useState(0)
    const [data, setData] = useState(null)

    function handleClick() {
        fetch(getApiUrl('/get')).then(response => response.json()).then(data => {
            setData(data);
        })
        setCount(count + 1)
    }

    return (
        <>
            <button onClick={handleClick}>GET /get</button>
            {count > 0 && <p>You clicked {count} times</p>}
            {data && <DataTable data={data} />}
        </>
    )
}

export default App
