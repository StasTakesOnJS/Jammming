import React, {Component} from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class PlayList extends Component {
  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePlaylistKeyDown = this.handlePlaylistKeyDown.bind(this);
  }

  handleNameChange(event) {
    this.props.onChangeName(event.target.value);
  }

  handlePlaylistKeyDown(event) {
    if (event.keyCode === 13) {
      this.props.onSave(event);
    }
  }

  render() {
    return (
      <div className="Playlist">
        <input value={this.props.playlistName} onChange={this.handleNameChange}
          onKeyDown={this.handlePlaylistKeyDown} />
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    )
  }
}

export default PlayList;
