import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
const { DateTime } = require('luxon');

const rootUri = process.env.REACT_APP_SERVER_URL || 'http://localhost:9000'

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: '',
            user: '',
            text: '',
            userSearch: '',
            dateFromSearch: '',
            dateToSearch: '',
            dataIsLoaded: false,
        }
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeUserSearch = this.handleChangeUserSearch.bind(this);
        this.handleChangeDateFromSearch = this.handleChangeDateFromSearch.bind(this);
        this.handleChangeDateToSearch = this.handleChangeDateToSearch.bind(this);
        this.handleFind = this.handleFind.bind(this);
        this.handleAll = this.handleAll.bind(this);
    }

    componentDidMount() {
        fetch(`${rootUri}/api`)
            .then(res => res.json())
            .then(res => this.setState({ board: res, dataIsLoaded: true }))
            .catch(err => err);
    };

    handleChangeUser(e) {
        this.setState({
            user: e.target.value
        });
    };

    handleChangeText(e) {
        this.setState({
            text: e.target.value
        });
    };

    handleSubmit(e) {
        e.preventDefault()
        fetch(`${rootUri}/new`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: this.state.user, text: this.state.text }),
        })
            .then(res => res.json())
            .then(res => this.setState({
                board: res,
                user: '',
                text: ''
            }));
        console.log('submit');
    };

    handleChangeUserSearch(e) {
        this.setState({
            userSearch: e.target.value
        });
    };

    handleChangeDateFromSearch(e) {
        this.setState({
            dateFromSearch: e.target.value
        });
    };

    handleChangeDateToSearch(e) {
        this.setState({
            dateToSearch: e.target.value
        });
    };

    handleFind() {
        if (this.state.userSearch === '' && this.state.dateFromSearch === '' && this.state.dateToSearch === '') {
            fetch(`${rootUri}/api`)
                .then(res => res.json())
                .then(res => this.setState({ board: res }))
                .catch(err => err);
            return;
        }
        fetch(`${rootUri}/find`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usersearch: this.state.userSearch,
                datefromsearch: this.state.dateFromSearch,
                datetosearch: this.state.dateToSearch
            }),
        })
            .then(res => res.json())
            .then(res => this.setState({
                board: res
            }));
        console.log('searched');
    };

    handleAll() {
        fetch(`${rootUri}/api`)
            .then(res => res.json())
            .then(res => this.setState({ board: res }))
            .catch(err => err);
        this.setState({
            userSearch: '',
            dateFromSearch: '',
            dateToSearch: ''
        });
    };

    render() {
        if (!this.state.dataIsLoaded) {
            return <div><h1>Please wait some time...</h1></div>
        }
        let board = this.state.board.messages;
        board.sort((b, a) => {
            if (new Date(a.date) < new Date(b.date)) {
                return -1;
            } else if (new Date(a.date) > new Date(b.date)) {
                return 1;
            } else {
                return 0;
            }
        });
        let count = this.state.board.messages.length;
        const charAllowed = 500;
        let charRemain = charAllowed - this.state.text.length;
        let singularOrPlural = count > 1 ? 'messages' : 'message';

        return (
            <div>
                <h1>Just A Bulletin</h1>
                <h4>Write a message for strangers across the globe or beside you</h4>
                <div id='container'>
                    <div id='left'>
                        <form onSubmit={this.handleSubmit}>
                            <h3>Post a New Message</h3>
                            <p>
                                <label className='label2'>What do you call yourself?</label>
                            </p>
                            <p>
                                <input required type='text' className='input-box' maxLength='30' size='20' value={this.state.user} onChange={this.handleChangeUser} />
                            </p>
                            <p>
                                <label className='label2'>What do you want to say?</label>
                            </p>
                            <div>
                                <textarea required className='message-box' rows="4" maxLength={charAllowed} value={this.state.text} onChange={this.handleChangeText} /><br />
                            </div>
                            <div id='char-remaining'>{charRemain} characters remaining</div>
                            <p className='button'>
                                <input className='button-style' type='submit' value='Submit'/>
                            </p>
                        </form>

                        <div>
                            <h3>Find Messages by Alias and/or Date</h3>
                            <p>
                                <label className='label2'>Alias: </label>
                                <input type='text' className='input-box' maxLength='30' size='20' placeholder='case-sensitive' value={this.state.userSearch} onChange={this.handleChangeUserSearch} />
                            </p>
                            <div className='spaceout'>
                                <div>
                                    <label className='label2'>From: </label>
                                    <input type='date' className='input-box' value={this.state.dateFromSearch} onChange={this.handleChangeDateFromSearch} />
                                </div>
                                <div>
                                    <label className='label2'>To: </label>
                                    <input type='date' className='input-box' value={this.state.dateToSearch} onChange={this.handleChangeDateToSearch} />
                                </div>
                            </div>
                            <p className='button'>
                                <button className='button-style' onClick={this.handleFind}>Search</button>
                            </p>
                            <p className='button'>
                                <button className='button-style' onClick={this.handleAll}>All Messages</button>
                            </p>
                            <p id='all-messages'>
                                <span className='label'>{count}</span> <span className='label2'>{singularOrPlural} on screen</span>
                            </p>
                        </div>
                    </div>

                    <div id='right'>
                        <div id='message-board'>
                            {board.map((message, ind) => (
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
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Message />);

