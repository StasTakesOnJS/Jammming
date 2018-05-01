const clientId = '778db02ea45445f9b2df3db46e02c2e3';
const redirectURI = 'https://purplelove.surge.sh/';

let accessToken = '';
let expirationTime = 0;

const Spotify = {
  getAccessToken: function() {
    // If the token is already set, return it's value
    if (accessToken) {
      console.log("The token is set");
      return accessToken;
    }
    // If the token is not set, and if it's present in URL, set the token value and reset it back to empty after timeout
    else if (window.location.href.indexOf("access_token") > -1) {
      const URI = window.location.href;
      const accessTokenArray = URI.match(/access_token=([^&]*)/);
      const expiresInArray = URI.match(/expires_in=([^&]*)/);
      accessToken = accessTokenArray[0].substring(13);
      expirationTime = parseInt(expiresInArray[0].substring(11));
      setTimeout(() => {accessToken=''}, expirationTime * 1000);
      // Remove the access_token and expires_in from URI so that application does not reset them again
      window.history.pushState('Access Token', null, '/');
      console.log("The token has been read from window URI and set with a timeout " + expirationTime*1000 + " milliseconds");
    }
    else {
      console.log("Sending an authentication request to get a new Access Token");
      window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
    }
  },

  search: function(q) {
    return fetch(
      `https://api.spotify.com/v1/search?q=${q}&type=track`,
      {headers: {
        Authorization: `Bearer ${accessToken}`
      }}
    ).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        console.log('Search failed');
      }}).then(
      jsonResponse => {
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(track => {
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            };
          });
        } else {
          return [];
        }
      }
    )
  },

  savePlaylist: function(name,trackURIs) {
    if (!name || !trackURIs) {
      return;
    }

    let userId;
    let playlistId;

    return fetch(
        'https://api.spotify.com/v1/me',
        {headers: {
          Authorization: `Bearer ${accessToken}`
        }}
      ).then(response => {
          if (response.ok) {
            return response.json();
          }
        }).then(jsonResponse => {
        if (jsonResponse.id) {
          userId = jsonResponse.id;
          console.log("User ID: " + userId);
          return fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({'name': name})
            });
        }
      }).then(response => {
          if (response.ok) {
            return response.json();
          } else {
            console.log("New playlist creation failed!");
          }
        }).then(jsonResponse => {
        if (jsonResponse.id) {
          playlistId = jsonResponse.id;
          console.log("Playlist ID: " + playlistId);
          return fetch(
            `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({uris: trackURIs})
            });
        }
      }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse.snapshot_id) {
          return "Success";
        } else {
          return "Playlist done goofed";
        }
      });
  }
}

export default Spotify;
