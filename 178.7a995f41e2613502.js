"use strict";(self.webpackChunkag_curl=self.webpackChunkag_curl||[]).push([[178],{3178:(z,x,c)=>{c.r(x),c.d(x,{SimulatorModule:()=>j});var h=c(9808),O=c(9140);function v(r,o,t,a,m,n,s){try{var l=r[n](s),d=l.value}catch(i){return void t(i)}l.done?o(d):Promise.resolve(d).then(a,m)}function w(r){return function(){var o=this,t=arguments;return new Promise(function(a,m){var n=r.apply(o,t);function s(d){v(n,a,m,s,l,"next",d)}function l(d){v(n,a,m,s,l,"throw",d)}s(void 0)})}}var C=c(1135),y=c(2076),A=c(4464);class g{constructor(o){this.teamData={},o.forEach(t=>{t.homeTeamAbbr in this.teamData||(this.teamData[t.homeTeamAbbr]={score:0,round:0,results:[]}),t.awayTeamAbbr in this.teamData||(this.teamData[t.awayTeamAbbr]={score:0,round:0,results:[]}),this.teamData[t.homeTeamAbbr].score+=t.homeAwardedPoints,this.teamData[t.homeTeamAbbr].round=Math.max(this.teamData[t.homeTeamAbbr].round,t.round),this.teamData[t.homeTeamAbbr].results.push(t),this.teamData[t.awayTeamAbbr].score+=t.awayAwardedPoints,this.teamData[t.awayTeamAbbr].round=Math.max(this.teamData[t.awayTeamAbbr].round,t.round),this.teamData[t.awayTeamAbbr].results.push(t)})}add(o){for(const[t,a]of Object.entries(o.teamData))this.teamData[t].round+=a.round,this.teamData[t].score+=a.score;return this}divide(o){for(const t of Object.keys(this.teamData))this.teamData[t].round/=o,this.teamData[t].score/=o;return this}raw(){const o=[];for(const[t,a]of Object.entries(this.teamData))o.push({abbr:t,score:a.score,round:a.round});return o.sort((t,a)=>a.score-t.score)}static blank(o){const t=new g([]);return o.all().forEach(a=>{a.rank>0&&(t.teamData[a.abbr]={score:0,round:0,results:[]})}),t}}var e=c(1223),M=c(9669),P=c(9771),T=c(8335),D=c(8526),b=c(5560);function S(r,o){if(1&r&&(e.TgZ(0,"div",2),e._uU(1),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.AsE("Progress (",t.iterations," Iterations): ",(t.iterate/t.iterations*100).toFixed(0),"%")}}function _(r,o){if(1&r&&(e.TgZ(0,"mat-grid-list",5)(1,"mat-grid-tile",6)(2,"div",2),e._uU(3),e.qZA()(),e.TgZ(4,"mat-grid-tile",6)(5,"div",2),e._uU(6),e.qZA()()()),2&r){const t=o.$implicit;e.xp6(3),e.Oqu(t[0]),e.xp6(3),e.hij("",t[1],"%")}}function Z(r,o){if(1&r&&(e.TgZ(0,"div",3),e.YNc(1,_,7,2,"mat-grid-list",4),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.Q6J("ngForOf",t.metaDraftSorted)}}function F(r,o){if(1&r&&(e.TgZ(0,"mat-grid-list",8)(1,"mat-grid-tile",6)(2,"div",2),e._UZ(3,"img",9),e._uU(4),e.qZA()(),e.TgZ(5,"mat-grid-tile",6)(6,"div",2),e._uU(7),e.qZA()(),e.TgZ(8,"mat-grid-tile",6)(9,"div",2),e._uU(10),e.qZA()()()),2&r){const t=o.$implicit,a=e.oxw(2);e.xp6(3),e.s9C("src",a.teamdb.get(t.abbr).imgURL,e.LSH),e.xp6(1),e.Oqu(a.teamdb.get(t.abbr).cleanName()),e.xp6(3),e.Oqu(t.score.toFixed(3)),e.xp6(3),e.Oqu(t.round.toFixed(2))}}function E(r,o){if(1&r&&(e.TgZ(0,"div",3),e.YNc(1,F,11,4,"mat-grid-list",7),e.qZA()),2&r){const t=e.oxw();e.xp6(1),e.Q6J("ngForOf",t.metaResult.raw())}}const N=r=>new Promise(o=>setTimeout(o,r));function R(r,o){r.forEach(a=>{a.group&&(o[a.group][a.homeTeamAbbr].score+=a.homeAwardedPoints,o[a.group][a.homeTeamAbbr].simulations.push(a),o[a.group][a.awayTeamAbbr].score+=a.awayAwardedPoints,o[a.group][a.awayTeamAbbr].simulations.push(a))});const t={};for(const[a,m]of Object.entries(o)){a in t||(t[a]=[]);for(const[n,s]of Object.entries(m))t[a].push({abbr:n,logOdds:s.logOdds,score:s.score});t[a].sort((n,s)=>{const l=m[n.abbr],d=m[s.abbr];if(l.score===d.score){const i=l.simulations.filter(f=>f.homeTeamAbbr===s.abbr||f.awayTeamAbbr===s.abbr);if(0===i.length)return Math.random()-.5;const u=i[0];return u.homeAwardedPoints===u.awayAwardedPoints?Math.random()-.5:u.winnerTeamAbbr===n.abbr?-1:1}return d.score-l.score})}return t}const I=[{path:"",component:(()=>{class r{constructor(t,a,m,n){this.fifaapi=t,this.teamdb=a,this.userdb=m,this.draftdb=n,this.iterate=0,this.iterations=5e4}ngOnInit(){var t=this;return w(function*(){t.allGamesSub$=new C.X(new Array),t.allGames$=t.allGamesSub$.asObservable(),t.allDrafts$=(0,y.D)([t.draftdb.drafts]),t.updateGames().then(function(){var a=w(function*(m){for(m.sort((n,s)=>n.id-s.id),t.metaResult=g.blank(t.teamdb),t.metaDraft={},t.userdb.all().forEach(n=>{t.metaDraft[n.name]=[0,0,0,0,0,0,0,0]}),t.iterate=0;t.iterate<t.iterations;t.iterate++){t.iterate%500==0&&(yield N(0));const n=[];m.forEach(i=>i.initalizeFromResult()),t.teamdb.all().forEach(i=>i.resetGames()),m.filter(i=>0===i.round).forEach(i=>{n.push(i.simulate(!0,n))});const s=R(n,t.teamdb.teamsByGroup());m.filter(i=>i.round>0).forEach(i=>{n.push(i.simulate(!1,n,s))});const l=new g(n);t.metaResult.add(l);const d=[];t.draftdb.drafts.forEach(i=>{const u=[];let f=0;i.teams.forEach(p=>{u.push([p.abbr,l.teamData[p.abbr]]),f+=l.teamData[p.abbr].score}),d.push([i.user.name,f,u])}),d.sort((i,u)=>Number(u[1])-Number(i[1])),d.forEach((i,u)=>t.metaDraft[String(i[0])][u]++)}t.metaResult.divide(t.iterations),t.metaDraftSorted=[];for(const[n,s]of Object.entries(t.metaDraft))t.metaDraftSorted.push([n,s[0]/(t.iterations/100)]);t.metaDraftSorted.sort((n,s)=>Number(s[1])-Number(n[1])),t.allGamesSub$.next(m.filter(n=>n.round>=0))});return function(m){return a.apply(this,arguments)}}())})()}updateGames(){return(0,A.n)(this.fifaapi.getGames())}}return r.\u0275fac=function(t){return new(t||r)(e.Y36(M.d),e.Y36(P.Y),e.Y36(T.C),e.Y36(D.H))},r.\u0275cmp=e.Xpm({type:r,selectors:[["app-simulator"]],decls:3,vars:3,consts:[["class","game-status",4,"ngIf"],["class","list-container",4,"ngIf"],[1,"game-status"],[1,"list-container"],["cols","2","rowHeight","2em",4,"ngFor","ngForOf"],["cols","2","rowHeight","2em"],["colspan","1"],["cols","3","rowHeight","2em",4,"ngFor","ngForOf"],["cols","3","rowHeight","2em"],[1,"team-img",3,"src"]],template:function(t,a){1&t&&(e.YNc(0,S,2,2,"div",0),e.YNc(1,Z,2,1,"div",1),e.YNc(2,E,2,1,"div",1)),2&t&&(e.Q6J("ngIf",a.iterations!==a.iterate),e.xp6(1),e.Q6J("ngIf",a.iterations===a.iterate),e.xp6(1),e.Q6J("ngIf",a.iterations===a.iterate))},directives:[h.O5,h.sg,b.Il,b.DX],styles:["h1[_ngcontent-%COMP%]{color:#fff;font-size:50px;font-weight:bolder}h2[_ngcontent-%COMP%]{color:#fff;font-size:20px;margin-bottom:0}h3[_ngcontent-%COMP%]{color:#fff;font-size:15px;margin-bottom:0}a[_ngcontent-%COMP%]{color:#5eccd6;border-bottom:2px solid transparent;transition:.5s border-bottom}.dashboard-header[_ngcontent-%COMP%]{align-items:center;box-sizing:border-box;display:flex;flex-direction:column;padding-top:1%}.dashboard-content[_ngcontent-%COMP%]{display:block;margin-top:10px}.game-flex-item[_ngcontent-%COMP%]{flex-grow:5;margin-right:10px}.pick-flex-item[_ngcontent-%COMP%]{flex-grow:4;margin-right:10px}.score-flex-item[_ngcontent-%COMP%]{flex-grow:1}.flexExpand[_ngcontent-%COMP%]{flex:1 1 auto}@media (max-width: 768px){.dashboard-content[_ngcontent-%COMP%]{display:block}.game-flex-item[_ngcontent-%COMP%], .pick-flex-item[_ngcontent-%COMP%]{margin-right:0}}.week-selector[_ngcontent-%COMP%]{margin-top:5px;background-color:#fff;width:min-content;height:51px}.list-container[_ngcontent-%COMP%]{margin-bottom:8px}.mat-grid-list[_ngcontent-%COMP%]{max-width:400px}.mat-grid-tile[_ngcontent-%COMP%]{border-width:1px;border-style:solid;border-color:#1e1e1e;background-color:#464646}.team-name[_ngcontent-%COMP%]{display:flex;align-items:center;width:100%;height:100%}.game-status[_ngcontent-%COMP%]{display:flex;align-items:center;width:100%;height:100%;color:#fff;padding-left:3px}.game-status-mini[_ngcontent-%COMP%]{display:flex;align-items:center;width:100%;height:100%;border-left:1px;border-style:solid;border-color:#1e1e1e;padding-left:3px;font-size:.6em}.team-img[_ngcontent-%COMP%]{font-weight:700;padding-left:2px;padding-right:2px;max-height:1.5em}.team-img-mini[_ngcontent-%COMP%]{padding-left:5px;padding-right:5px;max-height:1em}.tie[_ngcontent-%COMP%]{color:#dcdc28}.win[_ngcontent-%COMP%]{color:#5fff5f}.lose[_ngcontent-%COMP%]{color:#ff5f5f}.no-contest[_ngcontent-%COMP%]{color:#fff}"]}),r})()}];let Y=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[[O.Bz.forChild(I)],O.Bz]}),r})(),j=(()=>{class r{}return r.\u0275fac=function(t){return new(t||r)},r.\u0275mod=e.oAB({type:r}),r.\u0275inj=e.cJS({imports:[[h.ez,Y,b.N6]]}),r})()}}]);