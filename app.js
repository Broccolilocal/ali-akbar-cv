/* ============================================================
   Ali Akbar — Interactive CV v5 (Data-Driven)
   All content loaded from data/cv.json
   ============================================================ */
(function(){
'use strict';

document.addEventListener('DOMContentLoaded',function(){
  fetch('data/cv.json')
    .then(function(r){return r.json()})
    .then(function(data){
      renderCV(data);
      initCursor();
      initLoader();
      initBlob();
      initScrollReveals();
      initNavHighlight();
      initHamburger();
      initSmoothScroll();
      initSkillModals(data.skillModals);
      initAudio();
      initVideoCards();
      initRobot();
    });
});

/* ============================================================
   0. RENDER CV FROM JSON
   ============================================================ */
function renderCV(d){
  var p=d.personal;

  // Nav & sidebar
  var navLogo=document.getElementById('nav-logo');
  if(navLogo)navLogo.textContent=p.initials;
  var navContact=document.getElementById('nav-contact-btn');
  if(navContact)navContact.href='mailto:'+p.email;

  // Sidebar
  var sidebar=document.getElementById('sidebar-left');
  if(sidebar){
    sidebar.innerHTML=
      '<div class="sidebar-line"></div>'+
      '<a href="https://wa.me/'+p.whatsapp+'" target="_blank" class="sidebar-icon" aria-label="WhatsApp">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>'+
      '</a>'+
      '<a href="mailto:'+p.email+'" class="sidebar-icon" aria-label="Email">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>'+
      '</a>'+
      '<a href="'+p.github+'" target="_blank" class="sidebar-icon" aria-label="GitHub">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>'+
      '</a>';
  }

  // Menu modal info
  var menuName=document.getElementById('menu-name');
  if(menuName)menuName.textContent=p.name;
  var menuSub=document.getElementById('menu-subtitle');
  if(menuSub)menuSub.innerHTML=p.role+' &bull; '+p.tagline+'<br/>'+p.location;
  var menuDl=document.getElementById('menu-download-cv');
  if(menuDl)menuDl.href=p.cvFile;

  // Hero
  var heroGreeting=document.getElementById('hero-greeting');
  if(heroGreeting)heroGreeting.textContent=d.hero.greeting;
  var heroTitle=document.getElementById('hero-title');
  if(heroTitle)heroTitle.innerHTML=d.hero.titleLines.join('<br/>');

  // About
  var aboutLead=document.getElementById('about-lead');
  if(aboutLead)aboutLead.innerHTML=d.about.lead;
  var aboutBody=document.getElementById('about-body');
  if(aboutBody)aboutBody.innerHTML=d.about.paragraphs.map(function(t){return '<p>'+t+'</p>'}).join('');
  var aboutImg=document.getElementById('about-photo-img');
  if(aboutImg){aboutImg.src=p.profilePhoto;aboutImg.alt=p.name}

  // Marquee 1
  var m1=document.getElementById('marquee-1');
  if(m1){
    var items=d.marquee.map(function(t){return '<span class="marquee-item">'+t+' <span class="marquee-star">&#10038;</span></span>'}).join('');
    m1.innerHTML=items+items; // duplicate for seamless loop
  }

  // Stats
  var sh=document.getElementById('stats-headline');
  if(sh)sh.textContent=d.stats.headline;
  var ss=document.getElementById('stats-subtitle');
  if(ss)ss.textContent=d.stats.subtitle;
  var sg=document.getElementById('stats-grid');
  if(sg)sg.innerHTML=d.stats.items.map(function(s){
    return '<div class="stat-card">'+
      '<span class="stat-value">'+s.value+'<span class="stat-pct">'+s.unit+'</span></span>'+
      '<span class="stat-label">'+s.label+'</span>'+
      '<span class="stat-desc">'+s.desc+'</span>'+
    '</div>';
  }).join('');

  // Experience timeline
  var timeline=document.getElementById('timeline');
  if(timeline){
    var sides=['timeline-left','timeline-right'];
    d.experience.forEach(function(exp,i){
      var side=sides[i%2];
      var delay=i>0?(' delay-'+i):'';
      timeline.innerHTML+=
        '<div class="timeline-item '+side+' reveal'+delay+'">'+
          '<div class="timeline-dot"></div>'+
          '<div class="timeline-content">'+
            '<span class="timeline-date-badge">'+exp.date+'</span>'+
            '<h3>'+exp.title+'</h3>'+
            '<p class="timeline-company">'+exp.company+' &mdash; '+exp.companyDesc+'</p>'+
            '<p class="timeline-location">'+exp.location+'</p>'+
            '<p class="timeline-desc">'+exp.description+'</p>'+
          '</div>'+
        '</div>';
    });
  }

  // Ribbons
  var ribbonSection=document.getElementById('ribbon-section');
  if(ribbonSection&&d.ribbons){
    ribbonSection.innerHTML=d.ribbons.map(function(text,i){
      var content=text+' &#10038; '+text+' &#10038; ';
      return '<div class="ribbon ribbon-'+(i+1)+'"><span>'+content+'</span></div>';
    }).join('');
  }

  // Projects
  var pt=document.getElementById('projects-title');
  if(pt)pt.textContent=d.projects.headline;
  var ps=document.getElementById('projects-subtitle');
  if(ps)ps.textContent=d.projects.subtitle;
  var pg=document.getElementById('projects-grid');
  if(pg)pg.innerHTML=d.projects.gallery.map(function(proj){
    var cls='project-card'+(proj.large?' project-card-large':'');
    return '<div class="'+cls+'">'+
      '<img src="'+proj.image+'" alt="'+proj.alt+'" loading="lazy" />'+
      '<div class="project-overlay">'+
        '<span class="project-tag">'+proj.tag+'</span>'+
        '<h3>'+proj.title+'</h3>'+
      '</div>'+
    '</div>';
  }).join('');
  var vg=document.getElementById('video-grid');
  if(vg)vg.innerHTML=d.projects.videos.map(function(v){
    return '<div class="video-card">'+
      '<video src="'+v.src+'" muted playsinline preload="metadata"></video>'+
      '<button class="video-play-btn" aria-label="Play video"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg></button>'+
    '</div>';
  }).join('');

  // Marquee 2
  var m2=document.getElementById('marquee-2');
  if(m2){
    var items2=d.marquee2.map(function(t){return '<span class="marquee-item">'+t+' <span class="marquee-star">&#10038;</span></span>'}).join('');
    m2.innerHTML=items2+items2;
  }

  // Skills
  var skTitle=document.getElementById('skills-title');
  if(skTitle)skTitle.innerHTML=d.skills.headline;
  var skSub=document.getElementById('skills-subtitle');
  if(skSub)skSub.textContent=d.skills.subtitle;

  // Expertise icons SVGs
  var iconSvgs={
    cube:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
    chart:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
    people:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>'
  };

  var ec=document.getElementById('expertise-cols');
  if(ec)ec.innerHTML=d.skills.expertiseColumns.map(function(col){
    return '<div class="expertise-col">'+
      '<div class="expertise-icon">'+(iconSvgs[col.icon]||'')+'</div>'+
      '<h3>'+col.title+'</h3>'+
      '<p>'+col.description+'</p>'+
    '</div>';
  }).join('');

  var ts=document.getElementById('tech-stack');
  if(ts)ts.innerHTML=d.skills.categories.map(function(cat){
    return '<div class="tech-category">'+
      '<h4>'+cat.title+'</h4>'+
      '<div class="tech-tags">'+
        cat.tags.map(function(tag){
          var cls='tech-tag'+(tag.accent?' tag-accent':'');
          return '<button class="'+cls+'" data-skill="'+tag.id+'">'+tag.label+'</button>';
        }).join('')+
      '</div>'+
    '</div>';
  }).join('');

  // Education
  var eduC=document.getElementById('education-container');
  if(eduC)eduC.innerHTML=d.education.map(function(edu){
    return '<div class="edu-card reveal">'+
      '<span class="edu-badge">'+edu.badge+'</span>'+
      '<div>'+
        '<h3>'+edu.degree+'</h3>'+
        '<p class="edu-school">'+edu.school+' &bull; '+edu.years+'</p>'+
        '<p class="edu-focus">'+edu.focus+'</p>'+
      '</div>'+
    '</div>';
  }).join('');

  // Download CV
  var dlBtn=document.getElementById('download-cv-btn');
  if(dlBtn)dlBtn.href=p.cvFile;

  // Contact section
  var ci=document.getElementById('contact-icons');
  if(ci)ci.innerHTML=
    '<a href="https://wa.me/'+p.whatsapp+'" target="_blank" class="contact-icon-card">'+
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>'+
      '<span>WhatsApp</span>'+
    '</a>'+
    '<a href="mailto:'+p.email+'" class="contact-icon-card">'+
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>'+
      '<span>Email</span>'+
    '</a>'+
    '<a href="'+p.github+'" target="_blank" class="contact-icon-card">'+
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>'+
      '<span>GitHub</span>'+
    '</a>'+
    '<div class="contact-icon-card">'+
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>'+
      '<span>'+p.location.split(',')[0]+', '+p.location.split(',')[1]+'</span>'+
    '</div>';

  var cb=document.getElementById('contact-buttons');
  if(cb)cb.innerHTML=
    '<a href="https://wa.me/'+p.whatsapp+'" target="_blank" class="contact-pill">+62 813-3492-5297</a>'+
    '<a href="mailto:'+p.email+'" class="contact-pill">'+p.email+'</a>';

  var cig=document.getElementById('contact-info-grid');
  if(cig)cig.innerHTML=
    '<div class="contact-col">'+
      '<h4>LINKS</h4>'+
      '<a href="#hero">Home</a>'+
      '<a href="#about">About</a>'+
      '<a href="#experience">Experience</a>'+
      '<a href="#skills">Skills</a>'+
    '</div>'+
    '<div class="contact-col">'+
      '<h4>SOCIALS</h4>'+
      '<a href="mailto:'+p.email+'">Email</a>'+
      '<a href="https://wa.me/'+p.whatsapp+'" target="_blank">WhatsApp</a>'+
      '<a href="'+p.github+'" target="_blank">GitHub</a>'+
    '</div>'+
    '<div class="contact-col">'+
      '<h4>LOCATION</h4>'+
      '<span>'+p.location.split(',')[0]+', '+p.location.split(',')[1]+'</span>'+
      '<span>'+p.location.split(',')[2]+'</span>'+
    '</div>';

  var cbn=document.getElementById('contact-big-name');
  if(cbn)cbn.textContent=p.name.toUpperCase();
  var fn=document.getElementById('footer-name');
  if(fn)fn.textContent=p.name;
}

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
function initCursor(){
  var cursor=document.getElementById('cursor');
  var dot=document.getElementById('cursor-dot');
  if(!cursor||!dot||window.innerWidth<769)return;
  var cx=0,cy=0,dx=0,dy=0;
  document.addEventListener('mousemove',function(e){dx=e.clientX;dy=e.clientY;dot.style.left=dx+'px';dot.style.top=dy+'px'});
  (function loop(){cx+=(dx-cx)*.12;cy+=(dy-cy)*.12;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(loop)})();
}

/* ============================================================
   2. LOADER — cycling multilingual greetings + curved reveal
   ============================================================ */
function initLoader(){
  var el=document.getElementById('loader-word');
  var loader=document.getElementById('loader');
  if(!el||!loader)return;
  var words=['Hello','Halo','Bonjour','\u3053\u3093\u306B\u3061\u306F','Ciao','\u041F\u0440\u0438\u0432\u0435\u0442','Hola'];
  var i=0;
  var interval=setInterval(function(){
    i++;
    if(i>=words.length){clearInterval(interval);return}
    el.style.opacity='0';
    setTimeout(function(){el.textContent=words[i];el.style.opacity='1'},200);
  },400);
  setTimeout(function(){loader.classList.add('hidden')},words.length*400+600);
}

/* ============================================================
   3. THREE.JS MORPHING IRIDESCENT BLOB
   ============================================================ */
function initBlob(){
  var canvas=document.getElementById('blob-canvas');
  if(!canvas||typeof THREE==='undefined')return;

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
  camera.position.z=5;

  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setSize(innerWidth,innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));

  scene.add(new THREE.AmbientLight(0xffffff,0.6));
  var dLight=new THREE.DirectionalLight(0xffffff,1.2);
  dLight.position.set(5,5,5);scene.add(dLight);
  var pLight1=new THREE.PointLight(0xC8963E,.8,20);
  pLight1.position.set(-3,2,3);scene.add(pLight1);
  var pLight2=new THREE.PointLight(0x4488cc,.6,20);
  pLight2.position.set(3,-2,2);scene.add(pLight2);

  var geo=new THREE.IcosahedronGeometry(1.4,5);
  var mat=new THREE.ShaderMaterial({
    transparent:true,
    uniforms:{
      uTime:{value:0},
      uMouse:{value:new THREE.Vector2(0,0)}
    },
    vertexShader:
      'varying vec3 vNormal;'+
      'varying vec3 vViewDir;'+
      'uniform float uTime;'+
      'uniform vec2 uMouse;'+
      'vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}'+
      'vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}'+
      'vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}'+
      'float noise(vec3 p){'+
        'vec3 a=floor(p);vec3 d=p-a;d=d*d*(3.-2.*d);'+
        'vec4 b=a.xxyy+vec4(0,1,0,1);'+
        'vec4 k1=perm(b.xyxy);vec4 k2=perm(k1.xyxy+b.zzww);'+
        'vec4 c=k2+a.zzzz;vec4 k3=perm(c);vec4 k4=perm(c+1.);'+
        'vec4 o1=fract(k3*(1./41.));vec4 o2=fract(k4*(1./41.));'+
        'vec4 o3=o2*d.z+o1*(1.-d.z);vec2 o4=o3.yw*d.x+o3.xz*(1.-d.x);'+
        'return o4.y*d.y+o4.x*(1.-d.y);'+
      '}'+
      'void main(){'+
        'vec3 pos=position;'+
        'float n=noise(pos*1.5+uTime*.4)*.5'+
               '+noise(pos*3.+uTime*.6)*.25'+
               '+noise(pos*6.+uTime*.3)*.125;'+
        'pos+=normal*n*.35;'+
        'pos.x+=uMouse.x*.15;'+
        'pos.y+=uMouse.y*.1;'+
        'vNormal=normalize(normalMatrix*normal);'+
        'vec4 mvPos=modelViewMatrix*vec4(pos,1.);'+
        'vViewDir=normalize(-mvPos.xyz);'+
        'gl_Position=projectionMatrix*mvPos;'+
      '}',
    fragmentShader:
      'varying vec3 vNormal;'+
      'varying vec3 vViewDir;'+
      'uniform float uTime;'+
      'void main(){'+
        'float fresnel=1.-dot(vNormal,vViewDir);'+
        'fresnel=pow(fresnel,2.5);'+
        'float angle=atan(vNormal.y,vNormal.x)+uTime*.2;'+
        'float h=angle*.5+fresnel*3.;'+
        'vec3 c1=vec3(.95,.9,.85);'+
        'vec3 c2=vec3(.92,.78,.5);'+
        'vec3 c3=vec3(.7,.8,.95);'+
        'vec3 c4=vec3(.85,.65,.85);'+
        'vec3 c5=vec3(.6,.9,.75);'+
        'vec3 col=c1;'+
        'col=mix(col,c2,sin(h*2.)*.5+.5);'+
        'col=mix(col,c3,sin(h*3.+1.)*.5+.5);'+
        'col=mix(col,c4,sin(h*4.+2.)*.3+.3);'+
        'col=mix(col,c5,sin(h*1.5+3.)*.2+.2);'+
        'vec3 lightDir=normalize(vec3(1.,1.,1.));'+
        'float spec=pow(max(dot(reflect(-lightDir,vNormal),vViewDir),0.),40.);'+
        'col+=spec*.6;'+
        'col+=fresnel*.3*vec3(.95,.85,.7);'+
        'float alpha=.45+fresnel*.55;'+
        'gl_FragColor=vec4(col,alpha);'+
      '}'
  });

  var blob=new THREE.Mesh(geo,mat);
  scene.add(blob);

  var mouse={x:0,y:0,tx:0,ty:0};
  window.addEventListener('mousemove',function(e){
    mouse.tx=(e.clientX/innerWidth-.5)*2;
    mouse.ty=-(e.clientY/innerHeight-.5)*2;
  });
  window.addEventListener('touchmove',function(e){
    if(e.touches.length){
      mouse.tx=(e.touches[0].clientX/innerWidth-.5)*2;
      mouse.ty=-(e.touches[0].clientY/innerHeight-.5)*2;
    }
  },{passive:true});

  window.addEventListener('resize',function(){
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth,innerHeight);
  });

  var clock=new THREE.Clock();
  (function animate(){
    requestAnimationFrame(animate);
    var t=clock.getElapsedTime();
    mat.uniforms.uTime.value=t;
    mouse.x+=(mouse.tx-mouse.x)*.05;
    mouse.y+=(mouse.ty-mouse.y)*.05;
    mat.uniforms.uMouse.value.set(mouse.x,mouse.y);
    blob.rotation.y=t*.15+mouse.x*.3;
    blob.rotation.x=Math.sin(t*.1)*.2+mouse.y*.2;
    var scrollY=window.scrollY||0;
    var heroH=innerHeight;
    var scrollRatio=Math.min(scrollY/heroH,1);
    canvas.style.opacity=1-scrollRatio*1.2;
    renderer.render(scene,camera);
  })();
}

/* ============================================================
   4. SCROLL REVEAL
   ============================================================ */
function initScrollReveals(){
  var els=document.querySelectorAll('.reveal');
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:.15,rootMargin:'0px 0px -30px 0px'});
  els.forEach(function(el){obs.observe(el)});

  var tlItems=document.querySelectorAll('.timeline-item');
  var tlObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');tlObs.unobserve(e.target)}});
  },{threshold:.2});
  tlItems.forEach(function(el){tlObs.observe(el)});
}

/* ============================================================
   5. NAV HIGHLIGHT ON DARK SECTIONS
   ============================================================ */
function initNavHighlight(){
  var nav=document.querySelector('.topnav');
  var darkSections=document.querySelectorAll('.section-dark');
  window.addEventListener('scroll',function(){
    var onDark=false;
    darkSections.forEach(function(s){
      var r=s.getBoundingClientRect();
      if(r.top<80&&r.bottom>80)onDark=true;
    });
    nav.classList.toggle('on-dark',onDark);
  },{passive:true});
}

/* ============================================================
   6. HAMBURGER MENU
   ============================================================ */
function initHamburger(){
  var btn=document.getElementById('hamburger-btn');
  var modal=document.getElementById('menu-modal');
  if(!btn||!modal)return;
  btn.addEventListener('click',function(){
    btn.classList.toggle('open');
    modal.classList.toggle('open');
    document.body.style.overflow=modal.classList.contains('open')?'hidden':'';
  });
  modal.querySelectorAll('.menu-item').forEach(function(a){
    a.addEventListener('click',function(){
      btn.classList.remove('open');
      modal.classList.remove('open');
      document.body.style.overflow='';
    });
  });
}

/* ============================================================
   7. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var target=document.querySelector(a.getAttribute('href'));
      if(target)target.scrollIntoView({behavior:'smooth'});
    });
  });
}

/* ============================================================
   8. SKILL MODALS (data from JSON)
   ============================================================ */
function initSkillModals(skillData){
  var modal=document.getElementById('skill-modal');
  if(!modal||!skillData)return;
  var backdrop=modal.querySelector('.skill-modal-backdrop');
  var closeBtn=modal.querySelector('.skill-modal-close');
  var titleEl=document.getElementById('skill-modal-title');
  var levelEl=document.getElementById('skill-modal-level');
  var descEl=document.getElementById('skill-modal-desc');
  var evidenceEl=document.getElementById('skill-modal-evidence');

  function open(id){
    var s=skillData[id];if(!s)return;
    titleEl.textContent=s.title;
    levelEl.textContent=s.level==='soft'?'Soft Skill':s.level;
    levelEl.className='skill-modal-level '+s.level;
    descEl.textContent=s.desc;
    evidenceEl.innerHTML='<strong>Evidence:</strong> '+s.evidence;
    modal.classList.add('open');
  }
  function close(){modal.classList.remove('open')}

  document.querySelectorAll('[data-skill]').forEach(function(el){
    el.addEventListener('click',function(e){e.stopPropagation();open(el.dataset.skill)});
  });
  closeBtn.addEventListener('click',close);
  backdrop.addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
}

/* ============================================================
   9. J-POP INSTRUMENTAL AUDIO
   ============================================================ */
function initAudio(){
  var toggleBtn=document.getElementById('audio-toggle');
  var volumeSlider=document.getElementById('audio-volume');
  var iconOn=document.getElementById('audio-icon-on');
  var iconOff=document.getElementById('audio-icon-off');
  if(!toggleBtn)return;

  var audioCtx=null,isPlaying=false,masterGain=null,schedulerTimer=null;
  var SCALE=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880];
  var PATTERNS=[
    [4,3,2,0,2,3,4,7],[5,4,3,2,0,2,3,4],[0,2,4,3,2,0,4,3],
    [7,5,4,3,4,5,7,9],[2,4,5,7,5,4,2,0],[3,2,0,2,4,5,4,2]
  ];

  function createSound(){
    audioCtx=new(window.AudioContext||window.webkitAudioContext)();
    masterGain=audioCtx.createGain();
    masterGain.gain.value=(volumeSlider.value/100)*.25;
    masterGain.connect(audioCtx.destination);

    var padGain=audioCtx.createGain();padGain.gain.value=.08;padGain.connect(masterGain);
    var padFilter=audioCtx.createBiquadFilter();padFilter.type='lowpass';padFilter.frequency.value=800;padFilter.connect(padGain);
    [261.63,329.63,392,440].forEach(function(f){
      var o=audioCtx.createOscillator();o.type='sine';o.frequency.value=f/2;o.connect(padFilter);o.start();
      var o2=audioCtx.createOscillator();o2.type='sine';o2.frequency.value=f/2+.5;
      var g2=audioCtx.createGain();g2.gain.value=.5;o2.connect(g2);g2.connect(padFilter);o2.start();
    });
    var lfo=audioCtx.createOscillator();lfo.type='sine';lfo.frequency.value=.15;
    var lfoG=audioCtx.createGain();lfoG.gain.value=.02;lfo.connect(lfoG);lfoG.connect(padGain.gain);lfo.start();

    var pIdx=0,nIdx=0;var tempo=.38;
    function playNote(){
      if(!isPlaying)return;
      var p=PATTERNS[pIdx%PATTERNS.length];var freq=SCALE[p[nIdx%p.length]%SCALE.length];
      var o=audioCtx.createOscillator();o.type='triangle';o.frequency.value=freq;
      var o2=audioCtx.createOscillator();o2.type='sine';o2.frequency.value=freq*2;
      var ng=audioCtx.createGain();var now=audioCtx.currentTime;
      ng.gain.setValueAtTime(0,now);ng.gain.linearRampToValueAtTime(.12,now+.02);ng.gain.exponentialRampToValueAtTime(.001,now+.8);
      var nf=audioCtx.createBiquadFilter();nf.type='lowpass';nf.frequency.setValueAtTime(2000,now);nf.frequency.exponentialRampToValueAtTime(400,now+.6);
      o.connect(nf);var hg=audioCtx.createGain();hg.gain.value=.3;o2.connect(hg);hg.connect(nf);nf.connect(ng);ng.connect(masterGain);
      o.start(now);o2.start(now);o.stop(now+1);o2.stop(now+1);
      nIdx++;if(nIdx>=p.length){nIdx=0;pIdx++}
      schedulerTimer=setTimeout(playNote,tempo*1000);
    }
    setTimeout(playNote,1500);
  }

  function toggle(){
    if(!isPlaying){
      if(!audioCtx)createSound();else audioCtx.resume();
      isPlaying=true;iconOn.classList.remove('hidden');iconOff.classList.add('hidden');
    }else{
      isPlaying=false;if(schedulerTimer)clearTimeout(schedulerTimer);if(audioCtx)audioCtx.suspend();
      iconOn.classList.add('hidden');iconOff.classList.remove('hidden');
    }
  }
  toggleBtn.addEventListener('click',toggle);
  volumeSlider.addEventListener('input',function(){if(masterGain)masterGain.gain.setTargetAtTime((volumeSlider.value/100)*.25,audioCtx.currentTime,.1)});
}

/* ============================================================
   10. VIDEO CARDS — play/pause on click
   ============================================================ */
function initVideoCards(){
  document.querySelectorAll('.video-card').forEach(function(card){
    var video=card.querySelector('video');
    var btn=card.querySelector('.video-play-btn');
    if(!video||!btn)return;
    video.muted=true;
    btn.addEventListener('click',function(){
      if(video.paused){
        video.play();
        btn.style.opacity='0';
      }else{
        video.pause();
        btn.style.opacity='1';
      }
    });
    video.addEventListener('ended',function(){btn.style.opacity='1'});
    video.addEventListener('click',function(){
      if(!video.paused){video.pause();btn.style.opacity='1'}
    });
  });
}

/* ============================================================
   11. ROBOT 3D — Three.js rendered with head tracking cursor
   ============================================================ */
function initRobot(){
  var container=document.getElementById('robot-container');
  if(!container||typeof THREE==='undefined')return;

  var staticImg=document.getElementById('robot-img');
  if(staticImg)staticImg.style.display='none';
  var staticShadow=document.getElementById('robot-shadow');
  if(staticShadow)staticShadow.style.display='none';

  var canvas=document.createElement('canvas');
  canvas.width=560;canvas.height=560;
  canvas.style.width='280px';canvas.style.height='280px';
  container.appendChild(canvas);

  var scene=new THREE.Scene();
  var camera=new THREE.PerspectiveCamera(40,1,.1,100);
  camera.position.set(0,.5,5.5);
  camera.lookAt(0,0,0);

  var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});
  renderer.setSize(560,560);
  renderer.setPixelRatio(2);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;

  var amb=new THREE.AmbientLight(0xffeedd,.7);scene.add(amb);
  var dir=new THREE.DirectionalLight(0xffffff,1.2);
  dir.position.set(3,5,4);dir.castShadow=true;
  dir.shadow.mapSize.width=512;dir.shadow.mapSize.height=512;
  scene.add(dir);
  var rim=new THREE.PointLight(0xC8963E,.6,15);
  rim.position.set(-3,2,2);scene.add(rim);
  var fill=new THREE.PointLight(0x4488cc,.4,15);
  fill.position.set(2,-1,3);scene.add(fill);

  var bodyMat=new THREE.MeshStandardMaterial({color:0xB87333,roughness:.45,metalness:.7});
  var darkMat=new THREE.MeshStandardMaterial({color:0x333333,roughness:.6,metalness:.5});
  var eyeWhiteMat=new THREE.MeshStandardMaterial({color:0xf0ede8,roughness:.2,metalness:0});
  var eyeIrisMat=new THREE.MeshStandardMaterial({color:0x556B2F,roughness:.3,metalness:.2});
  var eyePupilMat=new THREE.MeshStandardMaterial({color:0x111111,roughness:.1,metalness:0});
  var screenMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:.1,metalness:.8,emissive:0x332200,emissiveIntensity:.3});
  var wheelMat=new THREE.MeshStandardMaterial({color:0x5c3a1a,roughness:.7,metalness:.3});
  var antennaMat=new THREE.MeshStandardMaterial({color:0x888888,roughness:.3,metalness:.9});

  var robotGroup=new THREE.Group();
  var bodyGroup=new THREE.Group();
  var headGroup=new THREE.Group();

  var bodyGeo=new THREE.BoxGeometry(1.2,1,.9);
  bodyGeo.translate(0,0,0);
  var body=new THREE.Mesh(bodyGeo,bodyMat);body.castShadow=true;
  bodyGroup.add(body);

  var screenGeo=new THREE.BoxGeometry(.4,.35,.05);
  var screen=new THREE.Mesh(screenGeo,screenMat);
  screen.position.set(0,.05,.48);bodyGroup.add(screen);

  var boltGeo=new THREE.CylinderGeometry(.04,.04,.06,8);
  [[-0.35,.3,.46],[.35,.3,.46],[-.35,-.3,.46],[.35,-.3,.46]].forEach(function(p){
    var bolt=new THREE.Mesh(boltGeo,darkMat);
    bolt.rotation.x=Math.PI/2;bolt.position.set(p[0],p[1],p[2]);bodyGroup.add(bolt);
  });

  for(var i=0;i<3;i++){
    var ventGeo=new THREE.BoxGeometry(.05,.08,.7);
    var vent=new THREE.Mesh(ventGeo,darkMat);
    vent.position.set(.63,.15-i*.15,0);bodyGroup.add(vent);
    var vent2=new THREE.Mesh(ventGeo,darkMat);
    vent2.position.set(-.63,.15-i*.15,0);bodyGroup.add(vent2);
  }

  var armGeo=new THREE.CylinderGeometry(.08,.07,.6,8);
  var handGeo=new THREE.SphereGeometry(.12,8,8);

  var leftArm=new THREE.Group();
  var la=new THREE.Mesh(armGeo,darkMat);la.rotation.z=Math.PI/4;la.position.set(-.15,-.1,0);leftArm.add(la);
  var lh=new THREE.Mesh(handGeo,bodyMat);lh.position.set(-.35,-.3,.1);leftArm.add(lh);
  leftArm.position.set(-.7,0,.2);bodyGroup.add(leftArm);

  var rightArmPivot=new THREE.Group();
  rightArmPivot.position.set(.7,.15,.2);

  var upperArmGeo=new THREE.CylinderGeometry(.08,.07,.35,8);
  var upperArm=new THREE.Mesh(upperArmGeo,darkMat);
  upperArm.position.set(0,.18,0);
  rightArmPivot.add(upperArm);

  var elbowGeo=new THREE.SphereGeometry(.09,8,8);
  var elbow=new THREE.Mesh(elbowGeo,darkMat);
  elbow.position.set(0,.36,0);
  rightArmPivot.add(elbow);

  var forearmPivot=new THREE.Group();
  forearmPivot.position.set(0,.36,0);
  var forearmGeo=new THREE.CylinderGeometry(.07,.06,.35,8);
  var forearm=new THREE.Mesh(forearmGeo,darkMat);
  forearm.position.set(0,.18,0);
  forearmPivot.add(forearm);

  var handGroupR=new THREE.Group();
  handGroupR.position.set(0,.36,0);
  var palm=new THREE.Mesh(new THREE.SphereGeometry(.11,8,8),bodyMat);
  handGroupR.add(palm);
  for(var f=0;f<4;f++){
    var fingerGeo=new THREE.CylinderGeometry(.025,.02,.1,6);
    var finger=new THREE.Mesh(fingerGeo,bodyMat);
    var angle=(f-1.5)*.22;
    finger.position.set(Math.sin(angle)*.08,.08,Math.cos(angle)*.08);
    finger.rotation.x=-.3;
    handGroupR.add(finger);
  }
  var thumbGeo=new THREE.CylinderGeometry(.028,.022,.08,6);
  var thumb=new THREE.Mesh(thumbGeo,bodyMat);
  thumb.position.set(-.1,.03,.05);thumb.rotation.z=.6;
  handGroupR.add(thumb);

  forearmPivot.add(handGroupR);
  rightArmPivot.add(forearmPivot);
  bodyGroup.add(rightArmPivot);

  rightArmPivot.rotation.z=-1.2;
  rightArmPivot.rotation.x=-.2;

  var legGeo=new THREE.BoxGeometry(.3,.5,.35);
  var wheelGeo=new THREE.CylinderGeometry(.2,.2,.15,12);
  var ll=new THREE.Mesh(legGeo,bodyMat);ll.position.set(-.35,-.7,.15);bodyGroup.add(ll);
  var lw=new THREE.Mesh(wheelGeo,wheelMat);lw.rotation.z=Math.PI/2;lw.position.set(-.35,-.95,.15);lw.castShadow=true;bodyGroup.add(lw);
  var rl=new THREE.Mesh(legGeo,bodyMat);rl.position.set(.35,-.7,.15);bodyGroup.add(rl);
  var rw=new THREE.Mesh(wheelGeo,wheelMat);rw.rotation.z=Math.PI/2;rw.position.set(.35,-.95,.15);rw.castShadow=true;bodyGroup.add(rw);

  var neckGeo=new THREE.CylinderGeometry(.12,.15,.2,8);
  var neck=new THREE.Mesh(neckGeo,darkMat);neck.position.set(0,.6,0);headGroup.add(neck);

  var headGeoM=new THREE.SphereGeometry(.65,16,12,0,Math.PI*2,0,Math.PI*.6);
  var head=new THREE.Mesh(headGeoM,bodyMat);head.position.set(0,1.05,0);head.castShadow=true;headGroup.add(head);

  var faceGeo=new THREE.BoxGeometry(.9,.45,.65);
  var face=new THREE.Mesh(faceGeo,new THREE.MeshStandardMaterial({color:0xc8b878,roughness:.5,metalness:.4}));
  face.position.set(0,.85,.08);headGroup.add(face);

  function makeEye(x){
    var g=new THREE.Group();
    var white=new THREE.Mesh(new THREE.SphereGeometry(.18,16,16),eyeWhiteMat);
    g.add(white);
    var iris=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),eyeIrisMat);
    iris.position.z=.1;g.add(iris);
    iris.name='iris';
    var pupil=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),eyePupilMat);
    pupil.position.z=.16;g.add(pupil);
    pupil.name='pupil';
    var specGeoE=new THREE.SphereGeometry(.03,6,6);
    var specMatE=new THREE.MeshBasicMaterial({color:0xffffff});
    var spec=new THREE.Mesh(specGeoE,specMatE);spec.position.set(.04,.06,.19);g.add(spec);
    g.position.set(x,.9,.35);
    return g;
  }
  var leftEye=makeEye(-.22);headGroup.add(leftEye);
  var rightEye=makeEye(.22);headGroup.add(rightEye);

  var smileCurve=new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-.14,.7,.36),
    new THREE.Vector3(0,.65,.38),
    new THREE.Vector3(.14,.7,.36)
  );
  var smileGeo=new THREE.TubeGeometry(smileCurve,12,.025,8,false);
  var mouth=new THREE.Mesh(smileGeo,darkMat);headGroup.add(mouth);

  var eyelidMat=new THREE.MeshStandardMaterial({color:0xB87333,roughness:.45,metalness:.7});
  function makeEyelid(x){
    var lid=new THREE.Mesh(new THREE.SphereGeometry(.19,16,8,0,Math.PI*2,0,Math.PI*.5),eyelidMat);
    lid.position.set(x,.9,.35);
    lid.rotation.x=Math.PI;
    lid.scale.y=0.01;
    return lid;
  }
  var leftLid=makeEyelid(-.22);headGroup.add(leftLid);
  var rightLid=makeEyelid(.22);headGroup.add(rightLid);

  var ant1Geo=new THREE.CylinderGeometry(.02,.02,.35,6);
  var ant1=new THREE.Mesh(ant1Geo,antennaMat);ant1.position.set(-.2,1.5,0);headGroup.add(ant1);
  var ant1Ball=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),antennaMat);ant1Ball.position.set(-.2,1.7,0);headGroup.add(ant1Ball);
  var ant2=new THREE.Mesh(ant1Geo,antennaMat);ant2.position.set(.2,1.5,0);headGroup.add(ant2);
  var ant2Ball=new THREE.Mesh(new THREE.SphereGeometry(.05,8,8),antennaMat);ant2Ball.position.set(.2,1.7,0);headGroup.add(ant2Ball);

  for(var vi=0;vi<2;vi++){
    var slitGeo=new THREE.BoxGeometry(.04,.06,.3);
    var slitL=new THREE.Mesh(slitGeo,darkMat);slitL.position.set(-.5,1.0-vi*.12,-.05);headGroup.add(slitL);
    var slitR=new THREE.Mesh(slitGeo,darkMat);slitR.position.set(.5,1.0-vi*.12,-.05);headGroup.add(slitR);
  }

  var shadowGeoR=new THREE.PlaneGeometry(2,.6);
  var shadowMatR=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.12});
  var groundShadow=new THREE.Mesh(shadowGeoR,shadowMatR);
  groundShadow.rotation.x=-Math.PI/2;groundShadow.position.y=-1.1;
  robotGroup.add(groundShadow);

  robotGroup.add(bodyGroup);
  robotGroup.add(headGroup);
  robotGroup.position.y=-.3;
  scene.add(robotGroup);

  var targetHeadRotY=0,targetHeadRotX=0;
  var curHeadRotY=0,curHeadRotX=0;
  var targetEyeX=0,targetEyeY=0;
  var curEyeX=0,curEyeY=0;

  document.addEventListener('mousemove',function(e){
    var rect=canvas.getBoundingClientRect();
    var cxR=rect.left+rect.width/2;
    var cyR=rect.top+rect.height/2;
    var dxR=e.clientX-cxR;
    var dyR=e.clientY-cyR;

    targetHeadRotY=Math.atan2(dxR,400)*.9;
    targetHeadRotX=Math.atan2(dyR,400)*.7;

    var maxD=600;
    targetEyeX=Math.min(Math.max(dxR/maxD,-1),1)*.07;
    targetEyeY=Math.min(Math.max(-dyR/maxD,-1),1)*.06;
  });

  var clockR=new THREE.Clock();
  var blinkTimer=0;
  var blinkState=0;
  var blinkProgress=0;
  var nextBlink=2+Math.random()*3;
  var lastTime=0;

  (function animate(){
    requestAnimationFrame(animate);
    var t=clockR.getElapsedTime();
    var dt=t-lastTime;lastTime=t;

    curHeadRotY+=(targetHeadRotY-curHeadRotY)*.07;
    curHeadRotX+=(targetHeadRotX-curHeadRotX)*.07;
    headGroup.rotation.y=curHeadRotY;
    headGroup.rotation.x=curHeadRotX;
    headGroup.rotation.z=-curHeadRotY*.15;

    curEyeX+=(targetEyeX-curEyeX)*.12;
    curEyeY+=(targetEyeY-curEyeY)*.12;
    [leftEye,rightEye].forEach(function(eye){
      eye.children.forEach(function(c){
        if(c.name==='iris'||c.name==='pupil'){
          c.position.x=curEyeX;
          c.position.y=curEyeY;
        }
      });
    });

    var waveSpeed=3.5;
    var waveCycle=Math.sin(t*waveSpeed);
    forearmPivot.rotation.z=Math.sin(t*waveSpeed*1.4)*.45;
    handGroupR.rotation.z=Math.sin(t*waveSpeed*2)*.3;
    handGroupR.rotation.x=Math.sin(t*waveSpeed*1.2)*.15;
    rightArmPivot.rotation.z=-1.2+waveCycle*.12;

    var breathe=Math.sin(t*2)*.008;
    bodyGroup.scale.y=1+breathe;

    ant1Ball.position.x=-.2+Math.sin(t*3)*.025;
    ant1Ball.position.y=1.7+Math.sin(t*2.5)*.01;
    ant2Ball.position.x=.2+Math.sin(t*3+1)*.025;
    ant2Ball.position.y=1.7+Math.sin(t*2.5+.5)*.01;

    screenMat.emissiveIntensity=.3+Math.sin(t*1.5)*.15;

    blinkTimer+=dt;
    if(blinkState===0&&blinkTimer>=nextBlink){
      blinkState=1;blinkProgress=0;blinkTimer=0;
    }
    if(blinkState===1){
      blinkProgress+=dt*12;
      if(blinkProgress>=1){blinkProgress=1;blinkState=2}
    }
    if(blinkState===2){
      blinkProgress-=dt*10;
      if(blinkProgress<=0){blinkProgress=0;blinkState=0;blinkTimer=0;nextBlink=2+Math.random()*4}
    }
    var lidScale=blinkProgress;
    leftLid.scale.y=Math.max(lidScale,.01);
    rightLid.scale.y=Math.max(lidScale,.01);

    renderer.render(scene,camera);
  })();
}

})();
