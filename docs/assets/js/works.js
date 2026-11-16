(function(){
  var q=document.getElementById('q');
  var chipsBox=document.getElementById('chips');
  var cardsBox=document.getElementById('cards');
  var count=document.getElementById('count');
  var empty=document.getElementById('empty');
  var loading=document.getElementById('loading');
  var items=[];
  var cat='すべて';

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function renderChips(){
    var seen={};
    items.forEach(function(l){ if(l.kind) seen[l.kind]=true; });
    var cats=['すべて'].concat(Object.keys(seen).sort());
    chipsBox.innerHTML='';
    cats.forEach(function(c){
      var b=document.createElement('button');
      b.className='chip'+(c===cat?' is-active':'');
      b.textContent=c;
      b.addEventListener('click',function(){ cat=c; renderChips(); apply(); });
      chipsBox.appendChild(b);
    });
  }

  function render(list){
    cardsBox.innerHTML=list.map(function(w){
      var tags=(w.tags||[]).map(function(t){ return '<span class="tag">#'+esc(t)+'</span>'; }).join(' ');
      var link=w.url?'<p class="card-sec"><a href="'+esc(w.url)+'" target="_blank" rel="noopener">▶ 開く／遊ぶ</a></p>':'';
      var status=w.status?'<span class="badge status">'+esc(w.status)+'</span>':'';
      return '<article class="card">'
        +'<div class="card-head"><span class="badge">'+esc(w.kind)+'</span>'+status+'<time>'+esc(w.date)+'</time></div>'
        +'<h2 class="card-title">'+esc(w.title)+'</h2>'
        +'<p class="card-sec">'+esc(w.description)+'</p>'
        +link
        +'<p class="card-tags">'+tags+'</p>'
        +'</article>';
    }).join('');
  }

  function apply(){
    var word=(q.value||'').toLowerCase();
    var list=items.filter(function(w){
      var okCat=(cat==='すべて'||w.kind===cat);
      var text=(w.title+' '+(w.description||'')+' '+(w.tags||[]).join(' ')).toLowerCase();
      return okCat && (!word || text.indexOf(word)>=0);
    });
    render(list);
    count.textContent=list.length;
    empty.hidden=list.length!==0;
  }

  q.addEventListener('input',apply);

  fetch('data/works.json')
    .then(function(r){ return r.json(); })
    .then(function(data){
      items=data.slice().sort(function(a,b){ return a.date<b.date?1:(a.date>b.date?-1:0); });
      loading.hidden=true;
      renderChips();
      apply();
    })
    .catch(function(){
      loading.textContent='作品棚の読み込みに失敗しました 🧫';
    });
})();
