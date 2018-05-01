import React, {Component} from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {searchTerm: "Enter A Song, Album, or Artist"}

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
  }

  search() {
    this.props.onSearch(this.state.searchTerm);
  }

  handleTermChange(event) {
    this.setState({searchTerm: event.target.value})
  }

  handleSearchKeyDown(event) {
    if (event.keyCode === 13) {
      this.props.onSearch(this.state.searchTerm);
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder={this.state.searchTerm} onChange={this.handleTermChange} onKeyDown={this.handleSearchKeyDown} />
        <a onClick={this.search} onKeyDown={this.search} autoFocus>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
