// Gramin Saathi - shared blog helpers (koi hardcoded blog nahi, sab Supabase se)
(function () {
  'use strict';

  var DEFAULT_IMAGE = 'images/h2news1.jpg';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  window.gsEsc = esc;

  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return '';
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function postLink(p) {
    return 'blog-details.html?slug=' + encodeURIComponent(p.slug);
  }

  // khali line = naya paragraph | "## " = heading | "- " = bullet | **text** = bold
  function formatContent(text) {
    var lines = String(text == null ? '' : text).replace(/\r\n?/g, '\n').split('\n');
    var out = [], para = [], inList = false;
    function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
    function flushPara() {
      if (para.length) { out.push('<p>' + para.map(inline).join('<br>') + '</p>'); para = []; }
    }
    function closeList() { if (inList) { out.push('</ul>'); inList = false; } }
    lines.forEach(function (raw) {
      var line = raw.trim();
      if (!line) { flushPara(); closeList(); return; }
      var h = line.match(/^#{1,3}\s+(.*)$/);
      if (h) { flushPara(); closeList(); out.push('<h4>' + inline(h[1]) + '</h4>'); return; }
      var li = line.match(/^[-*\u2022]\s+(.*)$/);
      if (li) {
        flushPara();
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push('<li>' + inline(li[1]) + '</li>');
        return;
      }
      closeList();
      para.push(line);
    });
    flushPara();
    closeList();
    return out.join('');
  }
  window.gsFormatContent = formatContent;

  var clientPromise = null;
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Script load nahi hua: ' + src)); };
      document.head.appendChild(s);
    });
  }
  function getClient() {
    if (clientPromise) return clientPromise;
    clientPromise = Promise.resolve().then(function () {
      if (typeof supabaseClient !== 'undefined') return supabaseClient;
      var libReady = (window.supabase && window.supabase.createClient)
        ? Promise.resolve()
        : loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      return libReady
        .then(function () { return loadScript('js/supabase-config.js'); })
        .then(function () {
          if (typeof supabaseClient === 'undefined') throw new Error('Supabase client nahi bana');
          return supabaseClient;
        });
    });
    return clientPromise;
  }
  window.gsGetClient = getClient;

  var COLS = 'id,title,slug,excerpt,image_url,category,created_at';

  function fetchPosts(limit) {
    return getClient().then(function (c) {
      var q = c.from('blogs').select(COLS).eq('published', true).order('created_at', { ascending: false });
      if (limit) q = q.limit(limit);
      return q;
    }).then(function (res) {
      if (res.error) throw res.error;
      return res.data || [];
    });
  }
  window.gsFetchPosts = fetchPosts;

  // Footer / sidebar "Latest Posts":  <ul data-latest-posts="3">
  function fillLatestLists() {
    var lists = document.querySelectorAll('ul[data-latest-posts]');
    if (!lists.length) return Promise.resolve();
    return fetchPosts(3).then(function (posts) {
      lists.forEach(function (ul) {
        if (!posts.length) {
          ul.innerHTML = '<li style="padding:0;">Naye articles jaldi aayenge.</li>';
          return;
        }
        ul.innerHTML = posts.map(function (p) {
          return '<li> <img src="' + esc(p.image_url || DEFAULT_IMAGE) + '" alt="' + esc(p.title) +
            '" style="width:68px;height:68px;object-fit:cover;"> <strong><a href="' + postLink(p) + '">' +
            esc(p.title) + '</a></strong> <span class="pdate"><i>Posted:</i> ' + esc(fmtDate(p.created_at)) + '</span> </li>';
        }).join('');
      });
    }).catch(function (e) {
      console.error('Latest posts load nahi hue:', e);
      lists.forEach(function (ul) { ul.innerHTML = ''; });
    });
  }

  // Homepage "News & Articles":  <section id="homeNewsSection"> ... <div id="homeNews">
  function fillHomeNews() {
    var section = document.getElementById('homeNewsSection');
    var box = document.getElementById('homeNews');
    if (!section || !box) return Promise.resolve();
    return fetchPosts(3).then(function (posts) {
      if (!posts.length) { section.style.display = 'none'; return; }
      var big = posts[0], small = posts.slice(1);
      var html = '<div class="col-md-6"><div class="blog-post-large">' +
        '<div class="post-thumb"> <a href="' + postLink(big) + '"><i class="fas fa-link"></i></a> <img src="' +
        esc(big.image_url || DEFAULT_IMAGE) + '" alt="' + esc(big.title) + '"></div>' +
        '<div class="post-txt"><ul class="post-meta"><li><i class="fas fa-calendar-alt"></i> ' + esc(fmtDate(big.created_at)) +
        '</li></ul><h5><a href="' + postLink(big) + '">' + esc(big.title) + '</a></h5></div></div></div>';
      if (small.length) {
        html += '<div class="col-md-6">' + small.map(function (p) {
          return '<div class="blog-small-post"><div class="post-thumb"> <a href="' + postLink(p) +
            '"><i class="fas fa-link"></i></a> <img src="' + esc(p.image_url || DEFAULT_IMAGE) + '" alt="' + esc(p.title) + '"> </div>' +
            '<div class="post-txt"><span class="pdate"> <i class="fas fa-calendar-alt"></i> ' + esc(fmtDate(p.created_at)) +
            '</span><h5><a href="' + postLink(p) + '">' + esc(p.title) + '</a></h5><p>' + esc(p.excerpt || '') +
            '</p><a href="' + postLink(p) + '" class="rm">Read More</a></div></div>';
        }).join('') + '</div>';
      }
      box.innerHTML = html;
      section.style.display = '';
    }).catch(function (e) {
      console.error('Home news load nahi hui:', e);
      section.style.display = 'none';
    });
  }

  function init() { fillLatestLists(); fillHomeNews(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
