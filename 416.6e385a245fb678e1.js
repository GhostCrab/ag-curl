"use strict";(self.webpackChunkag_curl=self.webpackChunkag_curl||[]).push([[416],{2826:(k,T,_)=>{function s(m=0,E=1){const y=1-Math.random(),g=Math.random();return Math.sqrt(-2*Math.log(y))*Math.cos(2*Math.PI*g)*E+m}_.d(T,{n:()=>s})},8526:(k,T,_)=>{_.d(T,{H:()=>u});var s=_(2826);class m{constructor(v,f){this.user=v,this.teams=f}score(){return this.teams.reduce((v,f)=>v+f.totalScore,0)}toString(){return`${this.user.full()}: ${this.teams.map(v=>v.abbr).join(",")} ${this.score()}`}}var E=_(1223),y=_(8335),g=_(9771);let u=(()=>{class h{constructor(f,r){this.userdb=f,this.teamdb=r,this.drafts=[new m(this.userdb.get("Keegan"),[this.teamdb.get("USA"),this.teamdb.get("POR"),this.teamdb.get("COL"),this.teamdb.get("VIE")]),new m(this.userdb.get("Ryan"),[this.teamdb.get("ESP"),this.teamdb.get("DEN"),this.teamdb.get("KOR"),this.teamdb.get("HAI")]),new m(this.userdb.get("SBrad"),[this.teamdb.get("ENG"),this.teamdb.get("NZL"),this.teamdb.get("SUI"),this.teamdb.get("PAN")]),new m(this.userdb.get("Andrew"),[this.teamdb.get("FRA"),this.teamdb.get("ITA"),this.teamdb.get("IRL"),this.teamdb.get("PHI")]),new m(this.userdb.get("TJ"),[this.teamdb.get("GER"),this.teamdb.get("CAN"),this.teamdb.get("ARG"),this.teamdb.get("MAR")]),new m(this.userdb.get("Bardia"),[this.teamdb.get("AUS"),this.teamdb.get("NED"),this.teamdb.get("CHN"),this.teamdb.get("ZAM")]),new m(this.userdb.get("Micah"),[this.teamdb.get("SWE"),this.teamdb.get("BRA"),this.teamdb.get("JAM"),this.teamdb.get("CRC")]),new m(this.userdb.get("Cooper"),[this.teamdb.get("JPN"),this.teamdb.get("NOR"),this.teamdb.get("NGA"),this.teamdb.get("RSA")])]}getUserByAbbr(f){for(const r of this.drafts)for(const c of r.teams)if(c.abbr===f)return r.user;return this.userdb.none}getDraftByUser(f){for(const r of this.drafts)if(r.user.name===f)return r;throw new Error("Unable to find draft for user named "+f)}mockDraft(){const f=[],c=(this.userdb.all(),this.teamdb.all().filter(w=>w.rank>0).filter(w=>!f.includes(w.abbr)).sort((w,M)=>w.rank-M.rank));let d=0,a=0,b="up";for(this.drafts=[new m(this.userdb.get("Keegan"),[]),new m(this.userdb.get("Ryan"),[]),new m(this.userdb.get("SBrad"),[]),new m(this.userdb.get("Andrew"),[]),new m(this.userdb.get("TJ"),[]),new m(this.userdb.get("Bardia"),[]),new m(this.userdb.get("Micah"),[]),new m(this.userdb.get("Cooper"),[])];c.length>0;){if(a>=this.drafts.length&&(b="down",a=this.drafts.length-1),a<0){if(++d>=2)break;b="up",a=0}const w=Math.min(Math.floor(Math.abs((0,s.n)(0,.5))),c.length-1);this.drafts[a].teams.push(c.splice(w,1)[0]),"up"===b?a++:"down"===b&&a--}}}return h.\u0275fac=function(f){return new(f||h)(E.LFG(y.C),E.LFG(g.Y))},h.\u0275prov=E.Yz7({token:h,factory:h.\u0275fac,providedIn:"root"}),h})()},9669:(k,T,_)=>{_.d(T,{d:()=>v});var s=_(520),m=_(4004),E=_(2826);class y{constructor(r,c,d){this.result=r,this.teamdb=c,this.draftdb=d,this.result=r,this.initalizeFromResult()}initalizeFromResult(){var r,c;this.id=this.result.MatchNumber,this.home=this.teamdb.get((null===(r=this.result.Home)||void 0===r?void 0:r.Abbreviation)?this.result.Home.Abbreviation:this.result.PlaceHolderA),this.away=this.teamdb.get((null===(c=this.result.Away)||void 0===c?void 0:c.Abbreviation)?this.result.Away.Abbreviation:this.result.PlaceHolderB),this.homeGoals=null===this.result.HomeTeamScore?0:this.result.HomeTeamScore,this.awayGoals=null===this.result.AwayTeamScore?0:this.result.AwayTeamScore,this.homePenaltyGoals=null===this.result.HomeTeamPenaltyScore?0:this.result.HomeTeamPenaltyScore,this.awayPenaltyGoals=null===this.result.AwayTeamPenaltyScore?0:this.result.AwayTeamPenaltyScore,this.active=3===this.result.MatchStatus,this.complete=0===this.result.MatchStatus,this.gt=new Date(this.result.Date).getTime(),this.homeUser=this.draftdb.getUserByAbbr(this.home.abbr),this.awayUser=this.draftdb.getUserByAbbr(this.away.abbr),this.knockout="first stage"!==this.result.StageName[0].Description.toLowerCase(),this.round=0,this.knockout&&(this.round="Round of 16"===this.result.StageName[0].Description?1:"Quarter-final"===this.result.StageName[0].Description?2:"Semi-final"===this.result.StageName[0].Description?3:"Final"===this.result.StageName[0].Description?4:-1)}status(){if(this.complete){let r=`FINAL: ${this.awayGoals} - ${this.homeGoals}`;this.knockout&&this.awayGoals===this.homeGoals&&(r+=` P[${this.awayPenaltyGoals} - ${this.homePenaltyGoals}]`);let c=0,d=0;return this.homeUser.name===this.awayUser.name?c=this.getAwardedPoints(this.home.abbr)+this.getAwardedPoints(this.away.abbr):(c=this.getAwardedPoints(this.home.abbr),d=this.getAwardedPoints(this.away.abbr)),c>0&&d>0&&!this.homeUser.isNone()&&!this.awayUser.isNone()?r+=`, ${this.homeUser.name} +${c}, ${this.awayUser.name} +${d}`:c>0&&!this.homeUser.isNone()?r+=`, ${this.homeUser.name} +${c}`:d>0&&!this.awayUser.isNone()&&(r+=`, ${this.awayUser.name} +${d}`),r}return this.active?`IN PROGRESS: ${this.awayGoals} - ${this.homeGoals}`:new Date(this.gt).toLocaleString()}miniStatusTop(){if(this.complete){let r=`FINAL: ${this.awayGoals} - ${this.homeGoals}`;return this.knockout&&this.awayGoals===this.homeGoals&&(r+=` P[${this.awayPenaltyGoals} - ${this.homePenaltyGoals}]`),r}return this.active?`IN PROGRESS: ${this.awayGoals} - ${this.homeGoals}`:new Date(this.gt).toLocaleString()}miniStatusBottom(){if(this.complete){let r="",c=0,d=0;return this.homeUser.abbr()===this.awayUser.abbr()?c=this.getAwardedPoints(this.home.abbr)+this.getAwardedPoints(this.away.abbr):(c=this.getAwardedPoints(this.home.abbr),d=this.getAwardedPoints(this.away.abbr)),c>0&&d>0&&!this.homeUser.isNone()&&!this.awayUser.isNone()?r+=`${this.homeUser.name} +${c}, ${this.awayUser.name} +${d}`:c>0&&!this.homeUser.isNone()?r+=`${this.homeUser.name} +${c}`:d>0&&!this.awayUser.isNone()&&(r+=`${this.awayUser.name} +${d}`),r}return""}roundStr(){return 1===this.round?"16":2===this.round?"QF":3===this.round?"SF":4===this.round?"F":""}tie(r){if(this.complete||r)return!this.knockout&&(r?r.homeGoals:this.homeGoals)===(r?r.awayGoals:this.awayGoals);throw Error("Attempted to get winner from incomplete game")}winner(r){if(this.complete||r){const c=r?this.teamdb.get(r.homeTeamAbbr):this.home,d=r?this.teamdb.get(r.awayTeamAbbr):this.away,a=r?r.homeGoals:this.homeGoals,b=r?r.awayGoals:this.awayGoals,w=r?r.homePenaltyGoals:this.homePenaltyGoals,M=r?r.awayPenaltyGoals:this.awayPenaltyGoals;return a===b?w>M?c:d:a>b?c:d}throw Error("Attempted to get winner from incomplete game")}winnerAbbr(r){if(this.complete||r){const c=r?r.homeTeamAbbr:this.home.abbr,d=r?r.awayTeamAbbr:this.away.abbr,a=r?r.homeGoals:this.homeGoals,b=r?r.awayGoals:this.awayGoals,w=r?r.homePenaltyGoals:this.homePenaltyGoals,M=r?r.awayPenaltyGoals:this.awayPenaltyGoals;return a===b?w>M?c:d:a>b?c:d}throw Error("Attempted to get winner from incomplete game")}winnerLogOdds(r){if(this.complete||r){const c=r?r.homeLogOdds:this.home.logOdds,d=r?r.awayLogOdds:this.away.logOdds,a=r?r.homeGoals:this.homeGoals,b=r?r.awayGoals:this.awayGoals,w=r?r.homePenaltyGoals:this.homePenaltyGoals,M=r?r.awayPenaltyGoals:this.awayPenaltyGoals;return a===b?w>M?c:d:a>b?c:d}throw Error("Attempted to get winner from incomplete game")}getAwardedPoints(r,c){if(!this.complete&&!c||-1===this.round)return 0;let d=0;1===this.round&&(d=1);let a=0;return 4===this.round&&(a=1),this.tie(c)?1:this.winnerAbbr(c)===r?3+d+a:d}gameStr(){return this.complete?this.tie()?`Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, None, ${this.awayGoals}, ${this.homeGoals}),`:`Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}, ${this.winner().cleanName()}, ${this.awayGoals}, ${this.homeGoals}),`:`Game(${this.away.cleanName()}, ${this.home.cleanName()}, ${this.round}),`}simulate(r,c,d){if(this.complete)return{homeTeamAbbr:this.home.abbr,awayTeamAbbr:this.away.abbr,winnerTeamAbbr:this.winnerAbbr(),homeLogOdds:this.home.logOdds,awayLogOdds:this.away.logOdds,homeGoals:this.homeGoals,awayGoals:this.awayGoals,homePenaltyGoals:this.homePenaltyGoals,awayPenaltyGoals:this.awayPenaltyGoals,homeAwardedPoints:this.getAwardedPoints(this.home.abbr),awayAwardedPoints:this.getAwardedPoints(this.away.abbr),round:this.round,group:this.home.group};let a={homeTeamAbbr:this.home.abbr,awayTeamAbbr:this.away.abbr,winnerTeamAbbr:"",homeLogOdds:this.home.logOdds,awayLogOdds:this.away.logOdds,homeGoals:0,awayGoals:0,homePenaltyGoals:0,awayPenaltyGoals:0,homeAwardedPoints:0,awayAwardedPoints:0,round:this.round};if(0===this.round&&(a.group=this.home.group),0===this.home.rank){if(1===this.round&&d){const M=Number(this.home.name[0])-1,C=this.home.name[1];a.homeTeamAbbr=d[C][M].abbr,a.homeLogOdds=d[C][M].logOdds}else if("W"===this.home.name[0]){const M=Number(this.home.name.substring(1))-1;a.homeTeamAbbr=this.winnerAbbr(c[M]),a.homeLogOdds=this.winnerLogOdds(c[M])}r&&(this.home=this.teamdb.get(a.homeTeamAbbr),this.homeUser=this.draftdb.getUserByAbbr(a.homeTeamAbbr))}if(0===this.away.rank){if(1===this.round&&d){const M=Number(this.away.name[0])-1,C=this.away.name[1];a.awayTeamAbbr=d[C][M].abbr,a.awayLogOdds=d[C][M].logOdds}else if("W"===this.away.name[0]){const M=Number(this.away.name.substring(1))-1;a.awayTeamAbbr=this.winnerAbbr(c[M]),a.awayLogOdds=this.winnerLogOdds(c[M])}r&&(this.away=this.teamdb.get(a.awayTeamAbbr),this.awayUser=this.draftdb.getUserByAbbr(a.awayTeamAbbr))}let b=0,w=0;if(a.homeLogOdds>a.awayLogOdds?w=a.homeLogOdds-a.awayLogOdds:b=a.awayLogOdds-a.homeLogOdds,a.homeGoals=(0,E.n)(.5,1)+b,a.awayGoals=(0,E.n)(.5,1)+w,a.homeGoals<0&&(a.awayGoals-=a.homeGoals,a.homeGoals=0),a.awayGoals<0&&(a.homeGoals-=a.awayGoals,a.awayGoals=0),a.homeGoals=Math.round(a.homeGoals),a.awayGoals=Math.round(a.awayGoals),r&&(this.homeGoals=a.homeGoals,this.awayGoals=a.awayGoals),a.homeGoals===a.awayGoals&&this.knockout){for(;a.homePenaltyGoals===a.awayPenaltyGoals;)a.homePenaltyGoals=Math.round(5*Math.random()),a.awayPenaltyGoals=Math.round(5*Math.random());r&&(this.homePenaltyGoals=a.homePenaltyGoals,this.awayPenaltyGoals=a.awayPenaltyGoals)}return a.homeAwardedPoints=this.getAwardedPoints(a.homeTeamAbbr,a),a.awayAwardedPoints=this.getAwardedPoints(a.awayTeamAbbr,a),a.winnerTeamAbbr=this.tie(a)?"TIE":this.winnerAbbr(a),r&&(this.active=!1,this.complete=!0,this.home.registerGame(this),this.away.registerGame(this)),a}includesTeam(r){return this.away.abbr===r.abbr||this.home.abbr===r.abbr}compare(r){return!(this.active!==r.active||this.complete!==r.complete||this.awayGoals!==r.awayGoals||this.homeGoals!==r.homeGoals||this.awayPenaltyGoals!==r.awayPenaltyGoals||this.homePenaltyGoals!==r.homePenaltyGoals)}}var g=_(1223),u=_(9771),h=_(8526);let v=(()=>{class f{constructor(c,d,a){this.http=c,this.teamdb=d,this.draftdb=a,this.apiUrl="https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285026",this.httpOptions={headers:new s.WM({"Content-Type":"application/json"})}}getGames(){const c=new URL(this.apiUrl);return this.http.get(c.href).pipe((0,m.U)(d=>{const a=[];for(const b of d.Results)a.push(new y(b,this.teamdb,this.draftdb));return a}))}}return f.\u0275fac=function(c){return new(c||f)(g.LFG(s.eN),g.LFG(u.Y),g.LFG(h.H))},f.\u0275prov=g.Yz7({token:f,factory:f.\u0275fac,providedIn:"root"}),f})()},9771:(k,T,_)=>{_.d(T,{Y:()=>E});class s{constructor(g,u,h,v,f){this.games=[],this.name=g,this.abbr=u,this.rank=v,this.group=h,this.odds=f,this.logOdds=Math.log10(this.odds),this.rrScore=0,this.totalScore=0,this.imgURL=this.rank>0?`https://api.fifa.com/api/v3/picture/flags-sq-1/${this.abbr}`:""}registerGame(g){if(this.games.push(g),g.complete){const u=g.getAwardedPoints(this.abbr);this.totalScore+=u,g.knockout||(this.rrScore+=u)}}cleanName(){return"Republic of Ireland"===this.name?"Ireland":"Korea Republic"===this.name?"Korea":"China PR"===this.name?"China":"W49"===this.name?"1A|2C":"W50"===this.name?"1C|2A":"W51"===this.name?"1E|2G":"W52"===this.name?"1G|2E":"W53"===this.name?"1D|2B":"W54"===this.name?"1B|2D":"W55"===this.name?"1H|2F":"W56"===this.name?"1F|2H":"W57"===this.name?"1A|2C|1E|2G":"W58"===this.name?"1C|2A|1G|2E":"W59"===this.name?"1D|2B|1H|2F":"W60"===this.name?"1B|2D|1F|2H":"W61"===this.name?"WA|WC|WE|WG":"W62"===this.name?"WB|WD|WF|WH":this.name}resetGames(){this.games=[],this.totalScore=0,this.rrScore=0}rrSort(g){if(this.rrScore===g.rrScore){const u=this.games.filter(h=>h.includesTeam(g));return 0===u.length||u[0].tie()?Math.random()-.5:u[0].winner().abbr===this.abbr?-1:1}return g.rrScore-this.rrScore}}var m=_(1223);let E=(()=>{class y{constructor(){this.teams=[new s("New Zealand","NZL","A",15,6500),new s("Norway","NOR","A",11,4e3),new s("Philippines","PHI","A",29,5e4),new s("Switzerland","SUI","A",23,25e3),new s("Australia","AUS","B",6,1200),new s("Republic of Ireland","IRL","B",19,15e3),new s("Nigeria","NGA","B",25,25e3),new s("Canada","CAN","B",10,2500),new s("Spain","ESP","C",3,650),new s("Costa Rica","CRC","C",31,5e4),new s("Zambia","ZAM","C",27,5e4),new s("Japan","JPN","C",12,4e3),new s("England","ENG","D",2,350),new s("Haiti","HAI","D",21,15e3),new s("Denmark","DEN","D",13,5e3),new s("China PR","CHN","D",17,8e3),new s("USA","USA","E",1,250),new s("Vietnam","VIE","E",28,5e4),new s("Netherlands","NED","E",8,1600),new s("Portugal","POR","E",18,1e4),new s("France","FRA","F",5,750),new s("Jamaica","JAM","F",30,5e4),new s("Brazil","BRA","F",9,2500),new s("Panama","PAN","F",32,5e4),new s("Sweden","SWE","G",7,1400),new s("South Africa","RSA","G",24,25e3),new s("Italy","ITA","G",16,6500),new s("Argentina","ARG","G",22,2e4),new s("Germany","GER","H",4,650),new s("Morocco","MAR","H",26,25e3),new s("Colombia","COL","H",20,15e3),new s("Korea Republic","KOR","H",14,6500),new s("1A","1A","X",0,.001),new s("2C","2C","X",0,.001),new s("1C","1C","X",0,.001),new s("2A","2A","X",0,.001),new s("1E","1E","X",0,.001),new s("2G","2G","X",0,.001),new s("1G","1G","X",0,.001),new s("2E","2E","X",0,.001),new s("1D","1D","X",0,.001),new s("2B","2B","X",0,.001),new s("1B","1B","X",0,.001),new s("2D","2D","X",0,.001),new s("1H","1H","X",0,.001),new s("2F","2F","X",0,.001),new s("1F","1F","X",0,.001),new s("2H","2H","X",0,.001),new s("W49","W49","X",0,.001),new s("W51","W51","X",0,.001),new s("W50","W50","X",0,.001),new s("W52","W52","X",0,.001),new s("W53","W53","X",0,.001),new s("W55","W55","X",0,.001),new s("W54","W54","X",0,.001),new s("W56","W56","X",0,.001),new s("W57","W57","X",0,.001),new s("W58","W58","X",0,.001),new s("W59","W59","X",0,.001),new s("W60","W60","X",0,.001),new s("RU61","RU61","X",0,.001),new s("RU62","RU62","X",0,.001),new s("W61","W61","X",0,.001),new s("W62","W62","X",0,.001)]}get(u){if(3===u.length){for(const v of this.teams)if(v.abbr===u)return v;throw new Error("Unable to find team with abbreviation "+u)}let h=u;"IR Iran"===h&&(h="Iran");for(const v of this.teams)if(v.name===h)return v;throw new Error("Unable to find team with name "+h)}all(){return this.teams}resetGames(){this.teams.forEach(u=>u.resetGames())}teamsByGroup(){const u={};return this.teams.filter(h=>h.rank>0).forEach(h=>{h.group in u||(u[h.group]={}),u[h.group][h.abbr]={logOdds:h.logOdds,score:0,simulations:[]}}),u}}return y.\u0275fac=function(u){return new(u||y)},y.\u0275prov=m.Yz7({token:y,factory:y.\u0275fac,providedIn:"root"}),y})()},8335:(k,T,_)=>{_.d(T,{C:()=>E});class s{constructor(g){this.name=g}abbr(){return this.name.length>0?`[${this.name.charAt(0)}]`:""}full(){return this.name.length>0?`- ${this.name}`:""}isNone(){return""===this.name}}var m=_(1223);let E=(()=>{class y{constructor(){this.users=[new s("Andrew"),new s("Bardia"),new s("Cooper"),new s("Keegan"),new s("Micah"),new s("Ryan"),new s("SBrad"),new s("TJ")],this.none=new s("")}get(u){for(const h of this.users)if(h.name===u)return h;throw new Error("Unable to find user with name "+u)}all(){return this.users}}return y.\u0275fac=function(u){return new(u||y)},y.\u0275prov=m.Yz7({token:y,factory:y.\u0275fac,providedIn:"root"}),y})()},4464:(k,T,_)=>{_.d(T,{n:()=>m});var s=_(6805);function m(E,y){const g="object"==typeof y;return new Promise((u,h)=>{let f,v=!1;E.subscribe({next:r=>{f=r,v=!0},error:h,complete:()=>{v?u(f):g?u(y.defaultValue):h(new s.K)}})})}},5560:(k,T,_)=>{_.d(T,{Il:()=>Ge,N6:()=>Be,DX:()=>ne});var s=_(1223),m=_(9808);const E=new s.OlP("cdk-dir-doc",{providedIn:"root",factory:function y(){return(0,s.f3M)(m.K0)}}),g=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;let c,h=(()=>{class i{constructor(t){if(this.value="ltr",this.change=new s.vpe,t){const o=t.documentElement?t.documentElement.dir:null;this.value=function u(i){const e=(null==i?void 0:i.toLowerCase())||"";return"auto"===e&&"undefined"!=typeof navigator&&(null==navigator?void 0:navigator.language)?g.test(navigator.language)?"rtl":"ltr":"rtl"===e?"rtl":"ltr"}((t.body?t.body.dir:null)||o||"ltr")}}ngOnDestroy(){this.change.complete()}}return i.\u0275fac=function(t){return new(t||i)(s.LFG(E,8))},i.\u0275prov=s.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})(),f=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=s.oAB({type:i}),i.\u0275inj=s.cJS({}),i})();try{c="undefined"!=typeof Intl&&Intl.v8BreakIterator}catch(i){c=!1}let d=(()=>{class i{constructor(t){this._platformId=t,this.isBrowser=this._platformId?(0,m.NF)(this._platformId):"object"==typeof document&&!!document,this.EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent),this.TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent),this.BLINK=this.isBrowser&&!(!window.chrome&&!c)&&"undefined"!=typeof CSS&&!this.EDGE&&!this.TRIDENT,this.WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT,this.IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window),this.FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent),this.ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT,this.SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT}}return i.\u0275fac=function(t){return new(t||i)(s.LFG(s.Lbi))},i.\u0275prov=s.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();const z="cdk-high-contrast-black-on-white",Y="cdk-high-contrast-white-on-black",U="cdk-high-contrast-active";let Me=(()=>{class i{constructor(t,n){this._platform=t,this._document=n}getHighContrastMode(){if(!this._platform.isBrowser)return 0;const t=this._document.createElement("div");t.style.backgroundColor="rgb(1,2,3)",t.style.position="absolute",this._document.body.appendChild(t);const n=this._document.defaultView||window,o=n&&n.getComputedStyle?n.getComputedStyle(t):null,l=(o&&o.backgroundColor||"").replace(/ /g,"");switch(t.remove(),l){case"rgb(0,0,0)":return 2;case"rgb(255,255,255)":return 1}return 0}_applyBodyHighContrastModeCssClasses(){if(!this._hasCheckedHighContrastMode&&this._platform.isBrowser&&this._document.body){const t=this._document.body.classList;t.remove(U),t.remove(z),t.remove(Y),this._hasCheckedHighContrastMode=!0;const n=this.getHighContrastMode();1===n?(t.add(U),t.add(z)):2===n&&(t.add(U),t.add(Y))}}}return i.\u0275fac=function(t){return new(t||i)(s.LFG(d),s.LFG(m.K0))},i.\u0275prov=s.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})();const Ee=new s.OlP("mat-sanity-checks",{providedIn:"root",factory:function we(){return!0}});let N=(()=>{class i{constructor(t,n,o){this._sanityChecks=n,this._document=o,this._hasDoneGlobalChecks=!1,t._applyBodyHighContrastModeCssClasses(),this._hasDoneGlobalChecks||(this._hasDoneGlobalChecks=!0)}_checkIsEnabled(t){return!function ae(){return"undefined"!=typeof __karma__&&!!__karma__||"undefined"!=typeof jasmine&&!!jasmine||"undefined"!=typeof jest&&!!jest||"undefined"!=typeof Mocha&&!!Mocha}()&&("boolean"==typeof this._sanityChecks?this._sanityChecks:!!this._sanityChecks[t])}}return i.\u0275fac=function(t){return new(t||i)(s.LFG(Me),s.LFG(Ee,8),s.LFG(m.K0))},i.\u0275mod=s.oAB({type:i}),i.\u0275inj=s.cJS({imports:[[f],f]}),i})(),Q=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=s.oAB({type:i}),i.\u0275inj=s.cJS({imports:[[N],N]}),i})();function H(i,e=0){return function Se(i){return!isNaN(parseFloat(i))&&!isNaN(Number(i))}(i)?Number(i):e}const te=["*"];class Fe{constructor(){this.columnIndex=0,this.rowIndex=0}get rowCount(){return this.rowIndex+1}get rowspan(){const e=Math.max(...this.tracker);return e>1?this.rowCount+e-1:this.rowCount}update(e,t){this.columnIndex=0,this.rowIndex=0,this.tracker=new Array(e),this.tracker.fill(0,0,this.tracker.length),this.positions=t.map(n=>this._trackTile(n))}_trackTile(e){const t=this._findMatchingGap(e.colspan);return this._markTilePosition(t,e),this.columnIndex=t+e.colspan,new ke(this.rowIndex,t)}_findMatchingGap(e){let t=-1,n=-1;do{this.columnIndex+e>this.tracker.length?(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),n=this._findGapEndIndex(t)):(t=this.tracker.indexOf(0,this.columnIndex),-1!=t?(n=this._findGapEndIndex(t),this.columnIndex=t+1):(this._nextRow(),t=this.tracker.indexOf(0,this.columnIndex),n=this._findGapEndIndex(t)))}while(n-t<e||0==n);return Math.max(t,0)}_nextRow(){this.columnIndex=0,this.rowIndex++;for(let e=0;e<this.tracker.length;e++)this.tracker[e]=Math.max(0,this.tracker[e]-1)}_findGapEndIndex(e){for(let t=e+1;t<this.tracker.length;t++)if(0!=this.tracker[t])return t;return this.tracker.length}_markTilePosition(e,t){for(let n=0;n<t.colspan;n++)this.tracker[e+n]=t.rowspan}}class ke{constructor(e,t){this.row=e,this.col=t}}const ie=new s.OlP("MAT_GRID_LIST");let ne=(()=>{class i{constructor(t,n){this._element=t,this._gridList=n,this._rowspan=1,this._colspan=1}get rowspan(){return this._rowspan}set rowspan(t){this._rowspan=Math.round(H(t))}get colspan(){return this._colspan}set colspan(t){this._colspan=Math.round(H(t))}_setStyle(t,n){this._element.nativeElement.style[t]=n}}return i.\u0275fac=function(t){return new(t||i)(s.Y36(s.SBq),s.Y36(ie,8))},i.\u0275cmp=s.Xpm({type:i,selectors:[["mat-grid-tile"]],hostAttrs:[1,"mat-grid-tile"],hostVars:2,hostBindings:function(t,n){2&t&&s.uIk("rowspan",n.rowspan)("colspan",n.colspan)},inputs:{rowspan:"rowspan",colspan:"colspan"},exportAs:["matGridTile"],ngContentSelectors:te,decls:2,vars:0,consts:[[1,"mat-grid-tile-content"]],template:function(t,n){1&t&&(s.F$t(),s.TgZ(0,"div",0),s.Hsn(1),s.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"],encapsulation:2,changeDetection:0}),i})();const Re=/^-?\d+((\.\d+)?[A-Za-z%$]?)+$/;class ${constructor(){this._rows=0,this._rowspan=0}init(e,t,n,o){this._gutterSize=se(e),this._rows=t.rowCount,this._rowspan=t.rowspan,this._cols=n,this._direction=o}getBaseTileSize(e,t){return`(${e}% - (${this._gutterSize} * ${t}))`}getTilePosition(e,t){return 0===t?"0":O(`(${e} + ${this._gutterSize}) * ${t}`)}getTileSize(e,t){return`(${e} * ${t}) + (${t-1} * ${this._gutterSize})`}setStyle(e,t,n){let o=100/this._cols,l=(this._cols-1)/this._cols;this.setColStyles(e,n,o,l),this.setRowStyles(e,t,o,l)}setColStyles(e,t,n,o){let l=this.getBaseTileSize(n,o);e._setStyle("rtl"===this._direction?"right":"left",this.getTilePosition(l,t)),e._setStyle("width",O(this.getTileSize(l,e.colspan)))}getGutterSpan(){return`${this._gutterSize} * (${this._rowspan} - 1)`}getTileSpan(e){return`${this._rowspan} * ${this.getTileSize(e,1)}`}getComputedHeight(){return null}}class xe extends ${constructor(e){super(),this.fixedRowHeight=e}init(e,t,n,o){super.init(e,t,n,o),this.fixedRowHeight=se(this.fixedRowHeight),Re.test(this.fixedRowHeight)}setRowStyles(e,t){e._setStyle("top",this.getTilePosition(this.fixedRowHeight,t)),e._setStyle("height",O(this.getTileSize(this.fixedRowHeight,e.rowspan)))}getComputedHeight(){return["height",O(`${this.getTileSpan(this.fixedRowHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["height",null]),e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}class Ne extends ${constructor(e){super(),this._parseRatio(e)}setRowStyles(e,t,n,o){this.baseTileHeight=this.getBaseTileSize(n/this.rowHeightRatio,o),e._setStyle("marginTop",this.getTilePosition(this.baseTileHeight,t)),e._setStyle("paddingTop",O(this.getTileSize(this.baseTileHeight,e.rowspan)))}getComputedHeight(){return["paddingBottom",O(`${this.getTileSpan(this.baseTileHeight)} + ${this.getGutterSpan()}`)]}reset(e){e._setListStyle(["paddingBottom",null]),e._tiles.forEach(t=>{t._setStyle("marginTop",null),t._setStyle("paddingTop",null)})}_parseRatio(e){const t=e.split(":");this.rowHeightRatio=parseFloat(t[0])/parseFloat(t[1])}}class Le extends ${setRowStyles(e,t){let l=this.getBaseTileSize(100/this._rowspan,(this._rows-1)/this._rows);e._setStyle("top",this.getTilePosition(l,t)),e._setStyle("height",O(this.getTileSize(l,e.rowspan)))}reset(e){e._tiles&&e._tiles.forEach(t=>{t._setStyle("top",null),t._setStyle("height",null)})}}function O(i){return`calc(${i})`}function se(i){return i.match(/([A-Za-z%]+)$/)?i:`${i}px`}let Ge=(()=>{class i{constructor(t,n){this._element=t,this._dir=n,this._gutter="1px"}get cols(){return this._cols}set cols(t){this._cols=Math.max(1,Math.round(H(t)))}get gutterSize(){return this._gutter}set gutterSize(t){this._gutter=`${null==t?"":t}`}get rowHeight(){return this._rowHeight}set rowHeight(t){const n=`${null==t?"":t}`;n!==this._rowHeight&&(this._rowHeight=n,this._setTileStyler(this._rowHeight))}ngOnInit(){this._checkCols(),this._checkRowHeight()}ngAfterContentChecked(){this._layoutTiles()}_checkCols(){}_checkRowHeight(){this._rowHeight||this._setTileStyler("1:1")}_setTileStyler(t){this._tileStyler&&this._tileStyler.reset(this),this._tileStyler="fit"===t?new Le:t&&t.indexOf(":")>-1?new Ne(t):new xe(t)}_layoutTiles(){this._tileCoordinator||(this._tileCoordinator=new Fe);const t=this._tileCoordinator,n=this._tiles.filter(l=>!l._gridList||l._gridList===this),o=this._dir?this._dir.value:"ltr";this._tileCoordinator.update(this.cols,n),this._tileStyler.init(this.gutterSize,t,this.cols,o),n.forEach((l,p)=>{const I=t.positions[p];this._tileStyler.setStyle(l,I.row,I.col)}),this._setListStyle(this._tileStyler.getComputedHeight())}_setListStyle(t){t&&(this._element.nativeElement.style[t[0]]=t[1])}}return i.\u0275fac=function(t){return new(t||i)(s.Y36(s.SBq),s.Y36(h,8))},i.\u0275cmp=s.Xpm({type:i,selectors:[["mat-grid-list"]],contentQueries:function(t,n,o){if(1&t&&s.Suo(o,ne,5),2&t){let l;s.iGM(l=s.CRH())&&(n._tiles=l)}},hostAttrs:[1,"mat-grid-list"],hostVars:1,hostBindings:function(t,n){2&t&&s.uIk("cols",n.cols)},inputs:{cols:"cols",gutterSize:"gutterSize",rowHeight:"rowHeight"},exportAs:["matGridList"],features:[s._Bn([{provide:ie,useExisting:i}])],ngContentSelectors:te,decls:2,vars:0,template:function(t,n){1&t&&(s.F$t(),s.TgZ(0,"div"),s.Hsn(1),s.qZA())},styles:[".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"],encapsulation:2,changeDetection:0}),i})(),Be=(()=>{class i{}return i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=s.oAB({type:i}),i.\u0275inj=s.cJS({imports:[[Q,N],Q,N]}),i})()}}]);