import React, {Component} from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SearchResults: [],
      PlaylistName: 'New Playlist',
      PlaylistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.saveToSpotify = this.saveToSpotify.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let currentPlaylist = this.state.PlaylistTracks;
    if (currentPlaylist.find(playlistTrack => {
      return playlistTrack.id === track.id})) {
        return;
    }
    currentPlaylist.push(track);
    this.setState({PlaylistTracks: currentPlaylist});
  }

  removeTrack(track) {
    const modifiedPlaylist = this.state.PlaylistTracks.filter(playlistTrack =>
      track.id !== playlistTrack.id);
      this.setState({PlaylistTracks: modifiedPlaylist});
  }

  changePlaylistName(name) {
    this.setState({PlaylistName: name});
  }

  saveToSpotify() {
    const trackURIs = this.state.PlaylistTracks.map(track => track.uri);
    if (window.confirm("Save playlist " + this.state.PlaylistName + " to your Spotify account?")) {
      Spotify.savePlaylist(this.state.PlaylistName,trackURIs).then(() => {
        this.setState({
          PlaylistTracks: []
        });
        this.changePlaylistName('New Playlist');
      });
    };
  }

  search(searchString) {
    Spotify.getAccessToken();

    Spotify.search(searchString).then(trackList => {
      this.setState({SearchResults: trackList})
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults resultList={this.state.SearchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.PlaylistTracks} playlistName={this.state.PlaylistName}
              onRemove={this.removeTrack} onChangeName={this.changePlaylistName} onSave={this.saveToSpotify} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
