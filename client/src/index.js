import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
const { DateTime } = require('luxon');

const rootUri = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000'

const Message = () => {
    const [board, setBoard] = useState('');
    const [user, setUser] = useState('');
    const [text, setText] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [dateFromSearch, setDateFromSearch] = useState('');
    const [dateToSearch, setDateToSearch] = useState('');
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    useEffect(() => {
        fetch(`${rootUri}/api`)
            .then(res => res.json())
            .then(res => {
                setBoard(res);
                setDataIsLoaded(true);
            })
            .catch(err => err);
    }, []);

    const handleChangeUser = (e) => {
        setUser(e.target.value);
    };

    const handleChangeText = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${rootUri}/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: user, text: text }),
        })
            .then(res => res.json())
            .then(res => {
                setBoard(res);
                setUser('');
                setText('');
            });
    };

    const handleChangeUserSearch = (e) => {
        setUserSearch(e.target.value);
    };

    const handleChangeDateFromSearch = (e) => {
        setDateFromSearch(e.target.value);
    };

    const handleChangeDateToSearch = (e) => {
        setDateToSearch(e.target.value);
    };

    const handleFind = () => {
        if (!userSearch && !dateFromSearch && !dateToSearch) {
            fetch(`${rootUri}/api`)
                .then(res => res.json())
                .then(res => setBoard(res))
                .catch(err => err);
            return;
        }
        fetch(`${rootUri}/find`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usersearch: userSearch,
                datefromsearch: dateFromSearch,
                datetosearch: dateToSearch
            }),
        })
            .then(res => res.json())
            .then(res => setBoard(res));
    };

    const handleAll = () => {
        fetch(`${rootUri}/api`)
            .then(res => res.json())
            .then(res => {
                setBoard(res);
                setUserSearch('');
                setDateFromSearch('');
                setDateToSearch('');
            })
            .catch(err => err);
    };

    if (!dataIsLoaded) {
        return <div><h1>Please wait some time...</h1></div>
    };

    let bulletin = board.messages;
    bulletin.sort((b, a) => {
        if (new Date(a.date) < new Date(b.date)) {
            return -1;
        } else if (new Date(a.date) > new Date(b.date)) {
            return 1;
        } else {
            return 0;
        }
    });

    const count = board.messages.length;
    const charAllowed = 500;
    const charRemain = charAllowed - text.length;
    const singularOrPlural = count > 1 ? 'messages' : 'message';

    return (
        <div>
            <h1>Just A Bulletin</h1>
            <h4>Write a message for strangers across the globe or beside you</h4>
            <div id='container'>
                <div id='left'>
                    <form onSubmit={handleSubmit}>
                        <h3>Post a New Message</h3>
                        <p>
                            <label className='label2'>What do you call yourself?</label>
                        </p>
                        <p>
                            <input required type='text' className='input-box' maxLength='40' size='30' value={user} onChange={handleChangeUser} />
                        </p>
                        <p>
                            <label className='label2'>What do you want to say?</label>
                        </p>
                        <div>
                            <textarea required className='message-box' rows="4" maxLength={charAllowed} value={text} onChange={handleChangeText} /><br />
                        </div>
                        <div id='char-remaining'>{charRemain} characters remaining</div>
                        <p className='button'>
                            <input className='button-style' type='submit' value='Submit' />
                        </p>
                    </form>

                    <div>
                        <h3>Find Messages by Alias and/or Date</h3>
                        <p>
                            <label className='label2'>Alias: </label>
                            <input type='text' className='input-box' maxLength='40' size='30' placeholder='case-sensitive' value={userSearch} onChange={handleChangeUserSearch} />
                        </p>
                        <div className='spaceout'>
                            <div>
                                <label className='label2'>From: </label>
                                <input type='date' className='input-box' value={dateFromSearch} onChange={handleChangeDateFromSearch} />
                            </div>
                            <div>
                                <label className='label2'>To: </label>
                                <input type='date' className='input-box' value={dateToSearch} onChange={handleChangeDateToSearch} />
                            </div>
                        </div>
                        <p className='button'>
                            <button className='button-style' onClick={handleFind}>Search</button>
                        </p>
                        <p className='button'>
                            <button className='button-style' onClick={handleAll}>All Messages</button>
                        </p>
                        <p id='all-messages'>
                            <span className='label'>{count}</span> <span className='label2'>{singularOrPlural} on screen</span>
                        </p>
                    </div>
                </div>

                <div id='right'>
                    <div id='message-board'>
                        {bulletin.map((message, ind) => (
                            <div className='message' key={ind}>
                                <div className='spaceout'>
                                    <div><span className='label'>Alias: </span>{message.user}</div>
                                    <div><span className='label'>Posted: </span>{DateTime.fromJSDate(new Date(message.date)).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}</div>
                                </div>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <div id='footer'>
                <a href='mailto:witty.opposum@gmail.com'>© Te Su</a>
            </div>
        </div>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Message />);

