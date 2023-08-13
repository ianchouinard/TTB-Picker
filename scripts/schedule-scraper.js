
// Basic DOM script to scrape schedule from ESPN for a single week. Run in browser console.

/*
{
    "date": "",
    "home": "npatriots",
    "away": "bbills"
}
*/

(function() {
    const espnToTeamCodeMap = {
        "/nfl/team/_/name/det/detroit-lions": "dlions",
        "/nfl/team/_/name/kc/kansas-city-chiefs": "kchiefs",
        "/nfl/team/_/name/car/carolina-panthers": "cpanthers",
        "/nfl/team/_/name/atl/atlanta-falcons": "afalcons",
        "/nfl/team/_/name/cin/cincinnati-bengals": "cbengals",
        "/nfl/team/_/name/cle/cleveland-browns": "cbrowns",
        "/nfl/team/_/name/jax/jacksonville-jaguars": "jjaguars",
        "/nfl/team/_/name/ind/indianapolis-colts": "icolts",
        "/nfl/team/_/name/tb/tampa-bay-buccaneers": "tbuccaneers",
        "/nfl/team/_/name/min/minnesota-vikings": "mvikings",
        "/nfl/team/_/name/ten/tennessee-titans": "ttitans",
        "/nfl/team/_/name/no/new-orleans-saints": "nsaints",
        "/nfl/team/_/name/sf/san-francisco-49ers": "s49",
        "/nfl/team/_/name/pit/pittsburgh-steelers": "psteelers",
        "/nfl/team/_/name/ari/arizona-cardinals": "acardinals",
        "/nfl/team/_/name/wsh/washington-commanders": "wcommanders",
        "/nfl/team/_/name/hou/houston-texans": "htexans",
        "/nfl/team/_/name/bal/baltimore-ravens": "bravens",
        "/nfl/team/_/name/gb/green-bay-packers": "gpackers",
        "/nfl/team/_/name/chi/chicago-bears": "cbears",
        "/nfl/team/_/name/lv/las-vegas-raiders": "lraiders",
        "/nfl/team/_/name/den/denver-broncos": "dbroncos",
        "/nfl/team/_/name/phi/philadelphia-eagles": "peagles",
        "/nfl/team/_/name/ne/new-england-patriots": "npatriots",
        "/nfl/team/_/name/mia/miami-dolphins": "mdolphins",
        "/nfl/team/_/name/lac/los-angeles-chargers": "lchargers",
        "/nfl/team/_/name/lar/los-angeles-rams": "lrams",
        "/nfl/team/_/name/sea/seattle-seahawks": "sseahawks",
        "/nfl/team/_/name/dal/dallas-cowboys": "dcowboys",
        "/nfl/team/_/name/nyg/new-york-giants": "ngiants",
        "/nfl/team/_/name/buf/buffalo-bills": "bbills",
        "/nfl/team/_/name/nyj/new-york-jets": "njets"
    };
    
    const tables = document.querySelectorAll('.ScheduleTables');
    const gameList = [];
    
    tables.forEach((table) => {
        const day = table.querySelector('.Table__Title') ? table.querySelector('.Table__Title').innerText : "";
        const games = table.querySelectorAll('tbody tr');
    
        games.forEach((game) => {
            let entry = {
                date: "",
                home: "",
                away: ""
            };
    
            const inGame = game.querySelectorAll('.Table__Team');
            const awayTeam = inGame[0].querySelectorAll('a')[1].getAttribute('href');
            const homeTeam = inGame[1].querySelectorAll('a')[1].getAttribute('href');
            const gameTime = game.querySelector('.date__col a').innerText;
    
            entry.home = espnToTeamCodeMap[homeTeam];
            entry.away = espnToTeamCodeMap[awayTeam];
            entry.date = `${day} at ${gameTime} est`;
    
            gameList.push(entry);
        });
    });
    
    console.log(JSON.stringify(gameList));
})();
