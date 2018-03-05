import './styles/main.scss';

import React from 'react';
import ReactDom from 'react-dom';
import superagent from 'superagent';

const API_URL = 'https://www.reddit.com/r/';

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: '',
      num: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({topic: e.target.value});
  }

  handleLimitChange(e) {
    this.setState({num: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.update_state(this.state.topic, this.state.num);
  }
  
  render() {
    return (
      <form 
        className="search_form" 
        onSubmit={this.handleSubmit}>

        <h1>Reddit Search</h1>
        <div className='container'>
          <input className={this.props.error ? 'error' : 'input'}
            type="text" 
            name="topic" 
            value={this.state.topic} 
            onChange={this.handleChange} 
            placeholder="Search Topic"/>
        
          <input className={this.props.error ? 'error' : 'number'}
            type="number"
            min="1"
            max="100"
            name="searchFormLimit"
            value={this.state.num}
            onChange={this.handleLimitChange}
            placeholder="Number of Results to Display"/>

        </div>
        <button type="submit">Search</button>
      
      </form>
    );
  }
}

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="results">
        {this.props.topic ?
          <section className="topic_data">
            <h2>Results</h2>
            <ul>
              {this.props.topic.map((a, b) => {
                return <li key={b}>
                  <a href={a.data.url}><h3>{a.data.title}</h3></a>
                  <p> Upvotes: {a.data.ups}</p>
                </li>;
              })
              }
            </ul>
          </section>
          :
          undefined
        }

        {this.props.error ?
          <section className="topic_error">
            <h2>You broke it.</h2>
          </section>
          :
          undefined
        }   
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: null,
      searchError: null,
    };
    this.searchApi = this.searchApi.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  updateState(topic, num) {
    this.searchApi(topic, num)
      .then(res => this.setState({topic: res.body.data.children, searchError: null}))
      .catch(err => this.setState({topic: null, searchError: err}));
  }

  searchApi(topic, num) {
    return superagent.get(`${API_URL}${topic}.json?limit=${num}`);
  }

  render() {
    return (
      <div className="application">
        <SearchForm update_state={this.updateState} error={this.state.searchError}/>
        <Results searchFormBoard={this.state.searchFormBoard} topic={this.state.topic} error={this.state.searchError}/>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('root'));