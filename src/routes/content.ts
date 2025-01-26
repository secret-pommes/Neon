import { Hono } from "hono";
import error from "../utils/error";

export default class Content {
  public route(app: Hono): void {
    app.all("/api/pages/fortnite-game", (c) => {
      if (c.req.method !== "GET") return error.method(c);

      return c.json({
        _activeDate: "2000-01-01T00:00:00.000Z",
        lastModified: "2000-01-01T00:00:00.000Z",
        _locale: "en-us",
        _suggestedPrefetch: [],
        _title: "Fortnite Game",
        /*emergencynotice: {
          _activeDate: "2000-01-01T00:00:00.000Z",
          _locale: "en-us",
          _noIndex: false,
          _title: "emergencynotice",
          alwaysShow: true,
          lastModified: new Date().toISOString(),
          news: {
            _type: "Battle Royale News",
            messages: [
              {
                _type: "CommonUI Simple Message Base",
                title: "Neon",
                body: "Backend by not_secret1337\nSrc: https://github.com/secret-pommes/neon",
                hidden: false,
                spotlight: true,
              },
            ],
          },
        },*/
        subgameselectdata: {
          battleRoyale: {
            _type: "CommonUI Simple Message",
            message: {
              image:
                "https://priv.cdn.aufgeladen.dev/BR06_In-Game_Mode-Select-1920x1080-4c0975cfecd29167b1c2ddf5d916fafbdcaa0f6c.jpg",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "100 Player PvP",
              body: "100 Player PvP Battle Royale.\n\nPvE progress does not affect Battle Royale.",
              spotlight: false,
            },
          },
          saveTheWorldUnowned: {
            _type: "CommonUI Simple Message",
            message: {
              image:
                "https://priv.cdn.aufgeladen.dev/BR06_In-Game_Mode-Select-1920x1080-f68e11d3ebea9ae01e92083d8e55a966b6976257.jpg",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "Co-op PvE",
              body: "Cooperative PvE storm-fighting adventure!",
              spotlight: false,
            },
          },
          creative: {
            _type: "CommonUI Simple Message",
            message: {
              image: "",
              hidden: false,
              messagetype: "normal",
              _type: "CommonUI Simple Message Base",
              title: "New Featured Islands!",
              body: "Your Island. Your Friends. Your Rules.\n\nDiscover new ways to play Fortnite, play community made games with friends and build your dream island.",
              spotlight: false,
            },
          },
        },
        playlistinformation: {
          _noIndex: false,
          _activeDate: "2000-01-01T00:00:00.000Z",
          lastModified: "2000-01-01T00:00:00.000Z",
          _locale: "en-US",
          frontend_matchmaking_header_style: "None",
          _title: "playlistinformation",
          frontend_matchmaking_header_text: "",
          playlist_info: {
            _type: "Playlist Information",
            playlists: [
              {
                image: "https://i.imgur.com/zr4Fnnp.jpg",
                playlist_name: "Playlist_DefaultSolo",
                special_border: "None",
                _type: "FortPlaylistInfo",
              },
              {
                image: "https://i.imgur.com/99n3n0m.jpg",
                playlist_name: "Playlist_DefaultDuo",
                special_border: "None",
                _type: "FortPlaylistInfo",
              },
              {
                image: "https://i.imgur.com/YA4ssMv.jpg",
                playlist_name: "Playlist_DefaultSquad",
                _type: "FortPlaylistInfo",
              },
              {
                image: "https://i.imgur.com/Xm1p8oo.jpg",
                playlist_name: "Playlist_Playground",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/BR_LTM_FoodFight16-1024x512-309538a1b961b5ab0c22417ab34170cc302bbab8.jpg",
                playlist_name: "Playlist_Barrier_16",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn2.unrealengine.com/Fortnite/fortnite-game/playlistinformation/BR06_LobbyTile_FoodFight-1024x512-5e1540a0a2ba0a1f663d32c60cfec3a360278672.png",
                playlist_name: "Playlist_Barrier_12",
                _type: "FortPlaylistInfo",
              },
            ],
          },
        },
      });
    });
  }
}
