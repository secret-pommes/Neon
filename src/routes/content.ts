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
                "https://cdn-lunarfn-02.aufgeladen.dev/BR06_In-Game_Mode-Select-1920x1080-4c0975cfecd29167b1c2ddf5d916fafbdcaa0f6c.jpg",
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
                "https://cdn-lunarfn-02.aufgeladen.dev/BR06_In-Game_Mode-Select-1920x1080-0966cb19586efe754abcb74e3e7caea764086ef8.jpg",
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
        battlepassaboutmessages: {
          news: {
            _type: "Battle Royale News",
            _title: "BattlePassAboutMessages",
            _noIndex: false,
            _activeDate: "2000-01-01T00:00:00.000Z",
            lastModified: "2000-01-01T00:00:00.000Z",
            _locale: "en-US",
            messages: [
              {
                layout: "Left Image",
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_In-Game_Upsell_How-Does-it-Work-1024x1024-62bfff8faf0095a7860c041733512ba0ac6b236d.png",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                title: "HOW DOES IT WORK?",
                body: "Play to level up your Battle Pass. The more you play, the more rewards you earn. Level up faster by completing Weekly Challenges. Earn up to 100 rewards worth over 25,000 V-Bucks (typically takes 75 to 150 hours of play). You can purchase the Battle Pass anytime during the season for 950 V-Bucks.",
                spotlight: false,
              },
              {
                layout: "Right Image",
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_In-Game_Upsell_Whats-Inside-1024x1024-69dd24bc652079d59a17b1a693cbd398c3a06c56.png",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                title: "WHAT’S INSIDE?",
                body: "When you buy the Battle Pass, you’ll instantly receive two exclusive outfits - Calamity and DJ Yonder! You can also earn exclusive rewards including emotes, outfits, gliders, sprays, loading screens, pickaxes and new surprises. You’ll receive a reward each time you level up. 100 tiers total for over 100 rewards.\n\nThere’s also new challenges every week! These challenges unlock even more Battle Pass rewards.",
                spotlight: false,
              },
              {
                layout: "Left Image",
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_In-Game_Upsell_Introducing-Pets-1024x1024-443bd65daba3ef817e77563887101a540590f718.png",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                title: "INTRODUCING PETS!",
                body: "Level up your Battle Pass to unlock Bonesy, Scales, and Camo, new critters that will join you on your journey across the map. These passive companions are always by your side - reacting to different situations you find yourself in.",
                spotlight: false,
              },
            ],
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
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR_LobbyTileArt_Solo-1024x512-7182fd30ccb2881345eeac1459defd03ac931627.png",
                playlist_name: "Playlist_DefaultSolo",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR_LobbyTileArt_Duo-1024x512-60b2e7c05b8ca615ce55d847518c566f411c8b4d.png",
                playlist_name: "Playlist_DefaultDuo",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR_LobbyTileArt_Squad-1024x512-40f32afc0f177771dbf0f6e59115e0741a629354.png",
                playlist_name: "Playlist_DefaultSquad",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR_LTM-Tile_Playground-1024x512-53db8a4b5fb41251af279eaf923bc00ecbc17792.jpg",
                playlist_name: "Playlist_Playground",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_LobbyTile_FoodFight-1024x512-5e1540a0a2ba0a1f663d32c60cfec3a360278672.png",
                playlist_name: "Playlist_Barrier_16",
                _type: "FortPlaylistInfo",
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_LobbyTile_FoodFight-1024x512-5e1540a0a2ba0a1f663d32c60cfec3a360278672.png",
                playlist_name: "Playlist_Barrier_12",
                _type: "FortPlaylistInfo",
              },
            ],
          },
        },
        battleroyalenews: {
          news: {
            _type: "Battle Royale News",
            _title: "battleroyalenews",
            header: "",
            style: "",
            _noIndex: false,
            alwaysShow: false,
            _activeDate: "2000-01-01T00:00:00.000Z",
            lastModified: "2000-01-01T00:00:00.000Z",
            _locale: "en-US",
            messages: [
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_MOTD_Pumpshotgun-1024x512-8a934a68ce5c71c9cba82a34b602ed35dda5f851.jpg",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                adspace: "NEW!",
                title: "Epic & Legendary Pump Shotgun",
                body: "Discover new rarities for the Pump Shotgun and burst down enemies with these powerful new rarities.",
                spotlight: false,
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/BR06_MOTD_Rumble-1024x512-878ba9f92deb153ec85f2bcbce925e185344290e.jpg",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                adspace: "NEW GAMEMODE!",
                title: "Team Rumble LTM",
                body: "Are you ready to Rumble? Be the first team to eliminate 100 enemies to earn a Victory Royale in this Limited Time Mode.",
                spotlight: false,
              },
              {
                image:
                  "https://cdn-lunarfn-02.aufgeladen.dev/StW06_MOTD_Support-A-Creator-1024x512-28c06f958b8e181642d162e5b1bcb43a1ef6b60d.jpg",
                hidden: false,
                _type: "CommonUI Simple Message Base",
                adspace: "NEW!",
                title: "New Constructor",
                body: "Airheart arrives and has brought a friend! Place the Rotating Omni-directional Sentry Integrated Exoskeleton (R.O.S.I.E.) for you or allies to rain down lead onto incoming enemies!",
                spotlight: false,
              },
            ],
          },
        },
      });
    });
  }
}
