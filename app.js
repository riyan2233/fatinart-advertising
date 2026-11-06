
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';
import {getFirestore,collection,doc,getDoc,getDocFromServer,getDocsFromServer,onSnapshot,setDoc,deleteDoc,writeBatch,serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
import {DEFAULT_PRODUCTS} from './products-default.js';
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const THEMES=[
 {id:'creative',name:'Creative Orange',note:'Enerjik & profesional',accent:'#f45a35',hero:'linear-gradient(115deg,#222437 0%,#403052 57%,#a14e3e 130%)',bg:'#f8f8fb',card:'#ffffff',ink:'#202331',family:'modern'},
 {id:'minimal',name:'Clean Ivory',note:'Putih, bersih & elegan',accent:'#ae653c',hero:'linear-gradient(130deg,#ebe8e2,#d9d6d1)',bg:'#f7f6f3',card:'#ffffff',ink:'#2c2b29',family:'minimal'},
 {id:'luxury',name:'Luxury Gold',note:'Hitam emas premium',accent:'#b58b43',hero:'linear-gradient(120deg,#101820,#2d2720 90%)',bg:'#f6f2eb',card:'#ffffff',ink:'#26231e',family:'editorial'},
 {id:'ocean',name:'Ocean Breeze',note:'Biru bahari segar',accent:'#1675c2',hero:'linear-gradient(120deg,#082945,#105e88,#2da5b0)',bg:'#f1f7fc',card:'#ffffff',ink:'#183650',family:'modern'},
 {id:'forest',name:'Forest Studio',note:'Hijau alami',accent:'#26734f',hero:'linear-gradient(125deg,#122c28,#295941,#517c53)',bg:'#f1f7f1',card:'#ffffff',ink:'#203a2f',family:'artisan'},
 {id:'lavender',name:'Lavender Mist',note:'Ungu lembut estetis',accent:'#8259c2',hero:'linear-gradient(110deg,#342449,#5d4685,#9578bb)',bg:'#f7f3fc',card:'#ffffff',ink:'#30243c',family:'soft'},
 {id:'sunset',name:'Sunset Glow',note:'Coral senja ceria',accent:'#eb684d',hero:'linear-gradient(115deg,#652f43,#c4504d,#ec9570)',bg:'#fff6f0',card:'#ffffff',ink:'#442d39',family:'soft'},
 {id:'rose',name:'Rose Boutique',note:'Pink butik modern',accent:'#cb5580',hero:'linear-gradient(120deg,#632d4e,#a94473,#d8839e)',bg:'#fff4f7',card:'#ffffff',ink:'#40283a',family:'soft'},
 {id:'royal',name:'Royal Blue',note:'Biru eksklusif',accent:'#425ed4',hero:'linear-gradient(120deg,#18234f,#374a98,#6885d6)',bg:'#f2f4fd',card:'#ffffff',ink:'#252d50',family:'modern'},
 {id:'emerald',name:'Emerald Pop',note:'Hijau premium',accent:'#119c78',hero:'linear-gradient(120deg,#0e3537,#137a72,#25b49a)',bg:'#effaf6',card:'#ffffff',ink:'#203b36',family:'modern'},
 {id:'sand',name:'Desert Sand',note:'Terakota & krem',accent:'#bd6c42',hero:'linear-gradient(120deg,#69483c,#a57555,#d4a879)',bg:'#fbf5ec',card:'#ffffff',ink:'#443a33',family:'artisan'},
 {id:'slate',name:'Urban Slate',note:'Abu kota minimal',accent:'#516477',hero:'linear-gradient(120deg,#1c2734,#45556a,#75879b)',bg:'#f2f5f7',card:'#ffffff',ink:'#283443',family:'minimal'},
 {id:'berry',name:'Berry Velvet',note:'Magenta dramatis',accent:'#a83776',hero:'linear-gradient(120deg,#341c39,#74335c,#b34b8b)',bg:'#fcf2f8',card:'#ffffff',ink:'#38243a',family:'editorial'},
 {id:'mono',name:'Black & White',note:'Monokrom editorial',accent:'#262b31',hero:'linear-gradient(120deg,#15191f,#3f4247)',bg:'#f3f3f3',card:'#ffffff',ink:'#242424',family:'minimal'},
 {id:'sky',name:'Sky Candy',note:'Langit biru muda',accent:'#258ac3',hero:'linear-gradient(120deg,#234c83,#52a6d6,#86cfe5)',bg:'#f1f9ff',card:'#ffffff',ink:'#24415d',family:'soft'},
 {id:'coffee',name:'Coffee House',note:'Cokelat hangat',accent:'#8b5e42',hero:'linear-gradient(125deg,#30241f,#65463b,#9d7861)',bg:'#f7f2ee',card:'#ffffff',ink:'#332822',family:'artisan'},
 {id:'cyber',name:'Neon Cyber',note:'Muda & futuristik',accent:'#793cdd',hero:'linear-gradient(125deg,#13152c,#33236d,#6440ab)',bg:'#f4f1ff',card:'#ffffff',ink:'#24213a',family:'bold'},
 {id:'coral',name:'Coral Fresh',note:'Salmon cerah',accent:'#ea695e',hero:'linear-gradient(120deg,#62404e,#d06a72,#f5a38b)',bg:'#fff7f5',card:'#ffffff',ink:'#443039',family:'soft'},
 {id:'teal',name:'Teal Professional',note:'Turkis modern',accent:'#0b8f95',hero:'linear-gradient(120deg,#13343c,#196477,#339a9b)',bg:'#eff8f8',card:'#ffffff',ink:'#203b42',family:'modern'},
 {id:'midnight',name:'Midnight Star',note:'Malam kebiruan',accent:'#5b69d5',hero:'linear-gradient(115deg,#0d1228,#22284d,#464c79)',bg:'#eef0f9',card:'#ffffff',ink:'#252944',family:'editorial'}
];
const MODES=['theme','solid','pattern','image'];
const svgData=s=>`data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
const BG_PRESETS=[
 {id:'printing-studio',name:'Studio Percetakan',note:'Suasana studio profesional',preview:'./bg-printing-studio.webp',image:'./bg-printing-studio.webp'},
 {id:'banner-press',name:'Mesin Cetak Banner',note:'Nuansa percetakan besar',preview:'./bg-banner-press.webp',image:'./bg-banner-press.webp'},
 {id:'sablon-atelier',name:'Sablon & Kaos',note:'Kreatif untuk portofolio',preview:'./bg-sablon-atelier.webp',image:'./bg-sablon-atelier.webp'},
 {id:'stempel-works',name:'Stempel & Grafis',note:'Kesan modern dan rapi',preview:'./bg-stempel-works.webp',image:'./bg-stempel-works.webp'},
 {id:'label-packaging',name:'Label & Kemasan',note:'Hangat untuk UMKM',preview:'./bg-label-packaging.webp',image:'./bg-label-packaging.webp'},
 {id:'midnight-luxury',name:'Midnight Luxury',note:'Biru gelap mewah',preview:'./bg-midnight-luxury.webp',image:'./bg-midnight-luxury.webp'},
 {id:'pearl-creative',name:'Pearl Creative',note:'Bersih, terang, premium',preview:'./bg-pearl-creative.webp',image:'./bg-pearl-creative.webp'},
 {id:'golden-studio',name:'Golden Studio',note:'Emas lembut elegan',preview:'./bg-golden-studio.webp',image:'./bg-golden-studio.webp'}
];
const validHex=s=>/^#[0-9a-fA-F]{6}$/.test(s||'');
const isVisualImage=s=>typeof s==='string'&&( /^https:\/\//.test(s) || /^\.\//.test(s) || /^\//.test(s) || /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(s) || /^data:image\/svg\+xml(?:;charset=[^,]+|;utf8)?,/i.test(s) );
function activeBackgroundSource(){return isVisualImage(settings.backgroundImage)?settings.backgroundImage:(isVisualImage(settings.welcomeImage)?settings.welcomeImage:BG_PRESETS[0].image)}
function currentTheme(){return THEMES.find(t=>t.id===settings.template)||THEMES[0]}
function customerURL(){let u=new URL(location.href);u.search='';u.hash='';return u.href}
function applyTheme(){
 const t=currentTheme(),root=document.documentElement,accent=validHex(settings.accent)?settings.accent:t.accent;
 for(const [key,val] of Object.entries({'--accent':accent,'--hero':t.hero,'--theme-bg':t.bg,'--theme-card':t.card,'--theme-ink':t.ink,'--theme-family':t.family}))root.style.setProperty(key,val);
 document.body.dataset.template=t.id;document.body.dataset.family=t.family;
 let mode=MODES.includes(settings.backgroundMode)?settings.backgroundMode:'image';
 let photo=activeBackgroundSource();
 if(mode==='theme'&&!settings.backgroundImage)mode='image';
 document.body.dataset.bgmode=mode==='image'&&!photo?'theme':mode;
 root.style.setProperty('--page-bg',validHex(settings.backgroundColor)?settings.backgroundColor:t.bg);
 if(mode==='image'&&photo)root.style.setProperty('--background-photo',`url("${photo}")`);else root.style.setProperty('--background-photo','none');
 root.style.setProperty('--background-opacity',String((!isVisualImage(settings.backgroundImage)&&mode==='image'?Math.min(60,Math.max(0,Number(settings.backgroundOverlay??52))):Math.max(0,Math.min(95,Number(settings.backgroundOverlay??52))))/100));
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',accent);
}
function socialShare(){
 const u=customerURL(),msg=`Lihat katalog ${settings.business} — percetakan, sablon, undangan, banner & kebutuhan promosi. ${u}`;
 const items=[
 ['Facebook','f','#1877f2',`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`],
 ['WhatsApp','☏','#128c7e',`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`],
 ['Telegram','➤','#279ed0',`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent('Katalog '+settings.business)}`],
 ['X / Twitter','𝕏','#24262e',`https://twitter.com/intent/tweet?text=${encodeURIComponent('Katalog '+settings.business)}&url=${encodeURIComponent(u)}`],
 ['Pinterest','P','#bd081c',`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&description=${encodeURIComponent(msg)}`],
 ];
 popup('Bagikan Katalog ke Media Sosial',`<p class="small muted">Yang dibagikan adalah link publik katalog. <strong>Panel admin tidak ditampilkan kepada pembeli.</strong></p><div class="social-grid">${items.map(([n,i,c,l])=>`<a href="${esc(l)}" target="_blank" rel="noopener noreferrer" class="social-link"><span style="background:${c}">${i}</span>${esc(n)} ↗</a>`).join('')}</div><div class="formrow" style="margin-top:16px"><label>Link katalog pembeli<input class="field" id="shareURL" value="${esc(u)}" readonly onclick="this.select()"></label></div><div class="admin-toolbar"><button class="btn" data-act="copy-link">📋 Salin Link Katalog</button><button class="btn outline" data-act="native-share">⬆ Bagikan lainnya</button></div><p class="small muted" style="margin-top:12px">Untuk Instagram, gunakan Salin Link lalu tempelkan di bio, Story, atau pesan. Facebook akan menampilkan pratinjau dari metadata publik situs.</p>`);
}
async function copyCustomerURL(){let v=customerURL();try{await navigator.clipboard.writeText(v);toast('Link pembeli tersalin.')}catch(e){let field=$('shareURL');if(field){field.select();document.execCommand('copy');toast('Link dipilih/disalin.')}else prompt('Salin tautan katalog:',v)}}
async function nativeShare(){let u=customerURL();if(navigator.share){try{await navigator.share({title:settings.business,text:'Katalog digital '+settings.business,url:u})}catch(e){}}else await copyCustomerURL()}

const def={business:'FATIN ART ADVERTISING',subtitle:'Katalog Foto Customer & Desain Grafis',headline:'Galeri hasil cetak customer <em>yang mengesankan.</em>',description:'Lihat galeri foto customer FATIN ART ADVERTISING. Cocok untuk referensi desain, kualitas hasil cetak, undangan, banner, stiker, sablon, dan kebutuhan promosi lainnya.',wa:'6282220221045',address:'Dusun Tengororejo, Desa Songgon, Banyuwangi',logo:'',accent:'#f45a35',template:'creative',showPrices:false,seeded:false,backgroundMode:'image',backgroundImage:'',backgroundColor:'#e9eef3',backgroundOverlay:18,welcomeImage:'',welcomeText:'SILAKAN MASUK TOKO'};
let settings={...def},products=[],orders=[],cart=[],category='Semua',search='',tab='products',view='catalog',user=null,isAdmin=false,authReady=false,pReady=false,sReady=false,error='',productError='',settingsError='',unsubOrders=null,busy=false;
// Produk awal bersifat pratinjau sampai koleksi products benar-benar terisi di Firestore.
function catalogProducts(){return products.length?products:DEFAULT_PRODUCTS}
function previewMode(){return products.length===0}
function updateConnectionError(){error=[productError,settingsError].filter(Boolean).join(' • ')}

// Slider homepage: sepuluh slot, gambar dan fokus crop dapat disimpan admin secara terpisah.
const DEFAULT_BANNERS=[
 {id:'slide-1',title:'Galeri Customer FATIN ART',description:'Referensi hasil cetak dan desain terbaik untuk customer kami',image:'./background-percetakan-fatinart.png',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-2',title:'Banner & Spanduk',description:'Dokumentasi hasil banner outdoor dan indoor',image:'./banner-2.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-3',title:'Undangan Pernikahan',description:'Contoh undangan elegan dari customer FATIN ART',image:'./banner-3.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-4',title:'Sablon Kaos',description:'Galeri sablon kaos manual dan DTF',image:'./banner-4.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-5',title:'Stiker Produk',description:'Stiker kemasan dan label produk UMKM',image:'./banner-5.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-6',title:'Kalender Custom',description:'Kalender dinding dan meja custom',image:'./banner-6.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-7',title:'Kartu Nama & Brosur',description:'Media promosi perusahaan dan UMKM',image:'./banner-7.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-8',title:'Buku Yasin & Nota',description:'Cetakan kebutuhan acara dan usaha',image:'./banner-8.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-9',title:'Cetak Foto',description:'Hasil cetak foto customer berbagai ukuran',image:'./banner-9.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50},
 {id:'slide-10',title:'Packaging & Label',description:'Kemasan, label, dan bahan branding usaha',image:'./banner-10.svg',link:'#produk',enabled:true,showCaption:true,posX:50,posY:50}
];
let bannerOverrides={},bannerError='',bannersReady=false,slideIndex=0,slideTimer=null,slidePlaying=true;
const bannerItems=()=>DEFAULT_BANNERS.map(b=>{const override={...(bannerOverrides[b.id]||{})};if(b.id==='slide-1'&&override.image==='./banner-1.svg')delete override.image;return {...b,...override};});
const visibleBanners=()=>bannerItems().filter(b=>b.enabled!==false);
const bannerImage=(s)=>typeof s==='string'&&(/^\.\/banner-(?:10|[1-9])\.svg$/.test(s)||s==='./background-percetakan-fatinart.png'||/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s)||/^https:\/\//.test(s))?esc(s):'';
const bannerLink=(s)=>typeof s==='string'&&(s==='#produk'||/^https:\/\/[^\s"'<>]{1,450}$/i.test(s))?esc(s):'#produk';
function sliderMarkup(){
 const list=visibleBanners();if(!list.length)return '<div class="slider-fallback">Banner promosi sedang disiapkan.</div>';
 slideIndex=Math.min(slideIndex,list.length-1);
 return `<section class="hero-slider" aria-label="Promo FATIN ART"><div class="slider-window" id="sliderWindow"><div class="slider-track" id="sliderTrack" style="transform:translateX(-${slideIndex*100}%)">${list.map((b,i)=>`<a class="slider-slide ${b.image==='./background-percetakan-fatinart.png'?'studio-photo':''}" href="${bannerLink(b.link)}" ${String(b.link||'').startsWith('https://')?'target="_blank" rel="noopener noreferrer"':''} aria-label="${esc(b.title)}" tabindex="${i===slideIndex?'0':'-1'}"><img src="${bannerImage(b.image)}" alt="${esc(b.title)} — ${esc(b.description||'')}" loading="${i===0?'eager':'lazy'}" style="object-position:${Number.isFinite(Number(b.posX))?Number(b.posX):50}% ${Number.isFinite(Number(b.posY))?Number(b.posY):50}%" onerror="if(!this.dataset.fallback){this.dataset.fallback='yes';this.src='./banner-1.svg'}else{this.style.opacity='.12'}">${b.showCaption?`<span class="slider-caption"><strong>${esc(b.title)}</strong><small>${esc(b.description||'')}</small></span>`:''}</a>`).join('')}</div></div><div class="slider-controls"><button class="slider-circle" type="button" data-slide-prev aria-label="Banner sebelumnya">‹</button>${list.map((_,i)=>`<button class="slider-dot ${i===slideIndex?'is-current':''}" data-slide-dot="${i}" type="button" aria-label="Banner ${i+1}" aria-current="${i===slideIndex?'true':'false'}"></button>`).join('')}<button class="slider-circle" type="button" data-slide-next aria-label="Banner berikutnya">›</button><button class="slider-pause" type="button" data-slide-play aria-label="${slidePlaying?'Jeda':'Putar'} banner">${slidePlaying?'Ⅱ':'▶'}</button><span class="slider-number" id="sliderNumber">${slideIndex+1} / ${list.length}</span></div></section>`;
}
function updateSlide(next){
 const list=visibleBanners(),track=$('sliderTrack');if(!track||!list.length)return;
 slideIndex=(next+list.length)%list.length;track.style.transform=`translateX(-${slideIndex*100}%)`;
 document.querySelectorAll('[data-slide-dot]').forEach((b,i)=>{b.classList.toggle('is-current',i===slideIndex);b.setAttribute('aria-current',i===slideIndex?'true':'false')});
 document.querySelectorAll('.slider-slide').forEach((a,i)=>a.tabIndex=i===slideIndex?0:-1);
 const count=$('sliderNumber');if(count)count.textContent=`${slideIndex+1} / ${list.length}`;
}
function setupSlider(){if(slideTimer)clearInterval(slideTimer);slideTimer=null;
 if(view!=='catalog'||!$('sliderTrack'))return;
 if(slidePlaying&&!document.hidden&&visibleBanners().length>1)slideTimer=setInterval(()=>updateSlide(slideIndex+1),5500);
 const w=$('sliderWindow');if(w){let startX=null;
 w.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;startX=e.clientX});
 w.addEventListener('pointerup',e=>{if(startX===null)return;let d=e.clientX-startX;startX=null;if(Math.abs(d)>38)updateSlide(slideIndex+(d<0?1:-1))});
 }
}
document.addEventListener('visibilitychange',()=>setupSlider());
function bannerAdminPanel(){return `<div class="panel-top"><span class="section-kicker">PROMOSI HALAMAN UTAMA</span><h3>10 Foto Slider Homepage</h3><p class="small muted">Gunakan 10 slider foto customer pada halaman depan. Admin bisa mengganti foto, judul, tautan, dan menggeser posisi foto supaya crop terlihat pas di desktop maupun HP.</p></div>${bannerError?`<div class="photo-status error">⚠ ${esc(bannerError)} — Periksa aturan koleksi <code>banners</code> di Firestore.</div>`:''}<div class="slider-admin-tip">Gunakan ukuran banner 1800 × 620 px (rasio sekitar 3:1). Foto otomatis dikompresi maksimal 160 KB. Anda juga bisa mengatur fokus gambar secara horizontal/vertikal.</div><div class="banner-grid-admin">${bannerItems().map((b,i)=>`<article class="banner-card-admin"><img src="${bannerImage(b.image)}" onerror="if(!this.dataset.fallback){this.dataset.fallback='yes';this.src='./banner-1.svg'}else{this.style.opacity='.12'}" alt="${esc(b.title)}" style="object-position:${Number.isFinite(Number(b.posX))?Number(b.posX):50}% ${Number.isFinite(Number(b.posY))?Number(b.posY):50}%"><b class="banner-card-name">Slider ${i+1}: ${esc(b.title)}</b><p class="banner-card-desc">${esc(b.description||'')} · ${b.enabled===false?'Disembunyikan':'Aktif'}</p><div class="banner-card-actions"><button type="button" class="btn" data-banner-edit="${i}">✎ Edit foto</button><button type="button" class="btn outline" data-banner-reset="${i}" title="Kembalikan slider bawaan">↻ Reset</button></div></article>`).join('')}</div>`}
function bannerEdit(i){
 if(!isAdmin)return;const b=bannerItems()[i];if(!b)return;
 popup(`Edit Slider Foto ${i+1} dari 10`, `<form id="bannerForm" data-index="${i}"><div class="formrow"><label>Judul slider<input name="title" class="field" required maxlength="90" value="${esc(b.title)}"></label></div><div class="formrow"><label>Deskripsi / teks alternatif<input name="description" class="field" maxlength="170" value="${esc(b.description||'')}"></label></div><div class="formrow"><label>Tautan saat slider diklik<input name="link" class="field" maxlength="450" value="${esc(b.link||'#produk')}" placeholder="#produk atau https://..."></label><p class="small muted">Gunakan <code>#produk</code> untuk melihat katalog customer, atau URL HTTPS.</p></div><div class="formrow"><label>Ganti gambar slider (PNG/JPG/WEBP, maksimal 12 MB)<input class="field" type="file" id="bannerFile" accept="image/png,image/jpeg,image/webp"></label></div><img id="bannerEditPreview" class="banner-edit-preview" src="${bannerImage(b.image)}" alt="Pratinjau slider" style="object-position:${Number.isFinite(Number(b.posX))?Number(b.posX):50}% ${Number.isFinite(Number(b.posY))?Number(b.posY):50}%"><div class="formgrid"><div class="formrow"><label>Geser foto horizontal: <b id="bannerPosXLabel">${Number.isFinite(Number(b.posX))?Number(b.posX):50}%</b><input class="field" type="range" name="posX" min="0" max="100" value="${Number.isFinite(Number(b.posX))?Number(b.posX):50}" oninput="document.getElementById('bannerPosXLabel').textContent=this.value+'%';const im=document.getElementById('bannerEditPreview');if(im){const y=document.querySelector('input[name=posY]');im.style.objectPosition=this.value+'% '+(y?y.value:'50')+'%';}"></label></div><div class="formrow"><label>Geser foto vertikal: <b id="bannerPosYLabel">${Number.isFinite(Number(b.posY))?Number(b.posY):50}%</b><input class="field" type="range" name="posY" min="0" max="100" value="${Number.isFinite(Number(b.posY))?Number(b.posY):50}" oninput="document.getElementById('bannerPosYLabel').textContent=this.value+'%';const im=document.getElementById('bannerEditPreview');if(im){const x=document.querySelector('input[name=posX]');im.style.objectPosition=(x?x.value:'50')+'% '+this.value+'%';}"></label></div></div><div class="formrow"><label><input name="showCaption" type="checkbox" ${b.showCaption?'checked':''}> Tampilkan judul dan keterangan di atas gambar slider</label></div><div class="formrow"><label><input name="enabled" type="checkbox" ${b.enabled!==false?'checked':''}> Tampilkan slider ini di katalog</label></div><div id="banner-save-status" role="status" aria-live="polite" class="photo-status">Preview gambar belum tersimpan. Klik tombol Simpan Slider untuk mengunggahnya.</div><button type="submit" class="btn full">💾 Simpan Slider ke Firebase</button></form>`);
}
async function saveBanner(form){
 if(!isAdmin||busy)return;const i=Number(form.dataset.index),b=DEFAULT_BANNERS[i];if(!b)return;
 const btn=form.querySelector('button[type="submit"]'),status=$('banner-save-status');
 const name=form.elements.title.value.trim(),description=form.elements.description.value.trim(),url=form.elements.link.value.trim()||'#produk',posX=Math.max(0,Math.min(100,Number(form.elements.posX?.value??50))),posY=Math.max(0,Math.min(100,Number(form.elements.posY?.value??50)));
 if(!name){status.textContent='Judul banner wajib diisi.';status.className='photo-status error';return}
 if(!(url==='#produk'||/^https:\/\/[^\s"'<>]{1,450}$/i.test(url))){status.textContent='Tautan harus #produk atau alamat HTTPS yang valid.';status.className='photo-status error';return}
 busy=true;btn.disabled=true;
 try{
  status.className='photo-status';status.textContent='Memproses dan menyimpan banner ke Firebase…';
  const patch={title:name,description,link:url,showCaption:form.elements.showCaption.checked,enabled:form.elements.enabled.checked,posX,posY};
  const file=$('bannerFile')?.files?.[0];if(file)patch.image=await shrinkMedia(file,160000,1650);
  const ref=doc(db,'banners',b.id);
  await setDoc(ref,patch,{merge:true});
  status.textContent='Memverifikasi hasil penyimpanan langsung dari server…';
  const check=await getDocFromServer(ref);
  if(!check.exists()||check.data().title!==patch.title||check.data().posX!==posX||check.data().posY!==posY||(file&&check.data().image!==patch.image))throw Error('Banner atau posisi gambar belum terverifikasi di Firestore. Coba lagi.');
  bannerOverrides[b.id]={...bannerOverrides[b.id],...check.data()};bannerError='';
  closePopup();render();toast('✅ Banner '+(i+1)+' berhasil disimpan dan diverifikasi di Firebase.');
 }catch(e){status.className='photo-status error';status.textContent='❌ '+errMsg(e);bannerError=errMsg(e);console.error('[FATIN ART BANNER]',e)}finally{busy=false;if(btn.isConnected)btn.disabled=false}
}
async function resetBanner(i){
 if(!isAdmin||busy||!confirm('Kembalikan banner '+(i+1)+' ke gambar bawaan FATIN ART?'))return;
 const id=DEFAULT_BANNERS[i]?.id;if(!id)return;busy=true;
 try{await deleteDoc(doc(db,'banners',id));delete bannerOverrides[id];bannerError='';render();toast('Banner bawaan dipulihkan.')}catch(e){bannerError=errMsg(e);render();toast(bannerError)}finally{busy=false}
}

const wantsAdmin=new URLSearchParams(location.search).has('admin');
// Tampilkan sambutan hanya untuk pengunjung baru. Login admin dan deep-link tetap langsung dibuka.
const ENTRY_KEY='fatinart-store-entered-v14';
let enteredStore=(()=>{if(wantsAdmin||['#galeri','#produk','#tentang'].includes(location.hash.toLowerCase())||new URLSearchParams(location.search).has('toko'))return true;try{return sessionStorage.getItem(ENTRY_KEY)==='1'}catch(_){return false}})();
function enterStore(){enteredStore=true;try{sessionStorage.setItem(ENTRY_KEY,'1')}catch(_){}window.scrollTo({top:0,behavior:'instant'});render()}
function returnToWelcome(){enteredStore=false;try{sessionStorage.removeItem(ENTRY_KEY)}catch(_){}window.scrollTo({top:0,behavior:'instant'});render()}

const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
const safeImg=s=>typeof s==='string'&&(/^https:\/\//.test(s)||/^data:image\/(jpeg|png|webp);base64,[\w+/=]+$/.test(s))?esc(s):'';
const errMsg=e=>e?.code?.includes('permission-denied')?'Firestore menolak akses. Periksa apakah Rules sudah DIPUBLISH dan cocok dengan struktur data aplikasi; periksa juga admins/UID dengan field active bertipe boolean dan bernilai true.':e?.code?.includes('invalid-credential')?'Email atau password Firebase tidak benar.':e?.code?.includes('unavailable')?'Tidak dapat menghubungi Firestore. Periksa koneksi internet dan status Firebase.':e?.code?.includes('resource-exhausted')?'Kuota atau ukuran dokumen Firestore terlampaui. Kompres foto dan periksa pemakaian Firebase.':e?.message||'Terjadi kesalahan.';
let lastWriteError='';
let writeVerified=false;
let editorIsDirty=false;
let photoSaving=false;
let pendingImageUrl=null;
let mediaSaveBusy=false;
const mediaStatus={logo:{text:'',type:''},background:{text:'',type:''},welcome:{text:'',type:''}};
function mediaStatusMarkup(kind){const st=mediaStatus[kind];return `<div id="${kind}-save-status" role="status" aria-live="polite" class="media-status ${esc(st.type)} ${st.text?'':'hidden'}">${esc(st.text)}</div>`}
function setMediaStatus(kind,text,type='working'){
  mediaStatus[kind]={text,type};
  const n=$(kind+'-save-status');if(n){n.textContent=text;n.className='media-status '+type;}
}
function safeMediaError(e,kind){
 const raw=String(e?.code||'error');const details=e?.message||String(e);
 let hint=raw.includes('permission-denied')?'Pastikan UID admin mempunyai izin tulis ke public/catalog.':
 (raw.includes('resource-exhausted')||details.includes('1 MiB'))?'Ukuran atau kuota Firestore terlampaui. Hapus gambar lama yang terlalu besar, atau gunakan penyimpanan file khusus.':
 'Pastikan koneksi internet aktif dan coba lagi.';
 return `Penyimpanan ${kind==='logo'?'logo':'background'} belum berhasil diverifikasi: ${raw} — ${details}. ${hint}`;
}

function writeFail(e,activity='Simpan data'){lastWriteError=`${activity}: ${errMsg(e)}`;console.error('[FATIN ART] '+activity,e);toast(lastWriteError);if(view==='admin')updateStatusDisplay()}
function updateStatusDisplay(){
 const el=$('firestore-diagnostic-banner');if(!el)return;
 const frame=el.closest('.admin-fixbar');frame?.classList.toggle('is-error',!!lastWriteError);frame?.classList.toggle('is-success',!lastWriteError&&writeVerified);
 el.innerHTML=lastWriteError
 ? `<b>⚠ Gagal menyimpan: ${esc(lastWriteError)}</b><br><span>Gunakan Diagnostik Firebase untuk memeriksa izin pada dokumen yang gagal. Data katalog yang sudah online tidak dihapus.</span>`
 :writeVerified
 ? '<b>✓ Penyimpanan online berhasil diuji</b><br><span>Perubahan telah dikirim dan dibaca ulang dari Firestore pada sesi ini.</span>'
 : '<b>☁ Katalog online terbaca</b><br><span>Hak akses menulis belum diuji pada sesi ini. Ini bukan pesan error. Jalankan tes hanya bila ingin memastikan izin simpan admin.</span>';
}

function toast(s){document.querySelector('.toast')?.remove();let el=document.createElement('div');el.className='toast';el.textContent=s;document.body.append(el);setTimeout(()=>el.remove(),4400)}
function popup(title,body){$('modal-root').innerHTML=`<div class="overlay"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${esc(title)}</h2><button class="close" data-act="close">✕</button></div>${body}</div></div>`}
function closePopup(){$('modal-root').innerHTML=''}
function wa(text){let p=String(settings.wa).replace(/\D/g,'');if(p.startsWith('0'))p='62'+p.slice(1);return `https://wa.me/${p}?text=${encodeURIComponent(text)}`}
function syncBar(){const pending=!pReady||!sReady,preview=previewMode();const message=error?'Koneksi Firebase bermasalah: '+error+(preview?' • 25 produk contoh tetap ditampilkan; belum tersimpan online.':''):pending?'Memeriksa database Firebase…'+(preview?' Katalog awal ditampilkan sementara.':''):preview?'25 produk awal ditampilkan sebagai CONTOH. Admin harus klik Pulihkan 25 Produk Awal agar tersimpan online.':'Katalog tersinkron dengan Firebase secara real-time.';return `<div class="syncbar ${error?'error':(pending||preview)?'warn':''}"><span><span class="syncdot"></span>${esc(message)}</span><span>${preview?'25 contoh • 0 online':products.length+' online'}</span></div>`}
function logo(){return settings.logo?`<img class="logo" src="${safeImg(settings.logo)}" alt="Logo">`:'<div class="logo-fallback">✦</div>'}
function header(){
 let admin=view==='admin'&&isAdmin;
 let links=admin?`<a href="#produk" data-act="go-products">Katalog Produk</a><a href="#tentang" data-act="go-about">Tentang Kami</a><a href="./" data-act="share">Bagikan Katalog</a>`:`<a href="#" data-act="welcome">Beranda</a><a href="#galeri">Hasil Cetakan</a><a href="#produk">Katalog</a><a href="./" data-act="share">Bagikan Katalog</a>`;
 return `<header class="top"><div class="container nav">${logo()}<a class="brand" href="./" data-act="catalog">${esc(settings.business)}<small>${esc(settings.subtitle).toUpperCase()}</small></a><nav class="navlinks">${links}</nav>${admin?'<button class="btn outline sm" data-act="catalog">👁 Katalog</button><button class="btn ghost sm" data-act="logout">Keluar</button>':`<button class="btn outline sm mobile-share" data-act="share" aria-label="Bagikan katalog">↗ <span>Bagikan</span></button><button class="btn outline sm" data-act="manual-order">📝 <span>Pesan Manual</span></button>`}</div></header>`
}
function filtered(){return catalogProducts().filter(p=>(category==='Semua'||p.category===category)&&`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(search.toLowerCase()))}
function productVisual(p){
 // The original 25 records use example/placeholder images, not real printed-product photos.
 // Render styled offline thumbnails for those instead of relying on an external placeholder server.
 if(!p.img||String(p.img||'').startsWith('https://placehold.co/')){
  const palette=['#ee6748','#1e6985','#304783','#24816b','#a35c85','#aa7740','#5c5597','#d27248','#396178','#ad4968'];
  const n=Number(String(p.id||'').replace(/\D/g,''))||0;
  return `<div class="mock-photo" style="--mock:${palette[n%palette.length]}"><span class="mock-brand">FATIN ART <i>✦</i></span><strong>${esc(p.name)}</strong><span class="mock-category">${esc(p.category)}</span></div>`;
 }
 return `<img loading="lazy" src="${safeImg(p.img)}" alt="${esc(p.name)}" onerror="this.style.opacity='.15'">`;
}
function cards(list){return list.length?list.map(p=>`<article class="product customer-catalog" data-product-id="${esc(p.id)}"><div class="photo">${productVisual(p)}<span class="tag">${esc(p.category)}</span></div><div class="product-body"><h3>${esc(p.name)}</h3><p class="desc">${esc(p.desc)}</p><div class="buyrow"><div><span class="pill">Contoh karya</span></div><button class="btn sm" data-add="${esc(p.id)}">Isi Pesanan Manual</button></div></div></article>`).join(''):'<div class="empty">Belum ada foto customer atau data tidak ditemukan.</div>'}
// Halaman awal toko terpisah; katalog tidak menampilkan banner sambutan ganda.
function storeEntrancePage(){
 const img=safeImg(settings.welcomeImage||'./background-percetakan-fatinart.png');
 const title=esc(settings.welcomeText||'SILAKAN MASUK TOKO');
 return `<main class="store-entrance" aria-label="Halaman sambutan toko">
  <section class="entrance-card">
   <div class="entrance-image"><img src="${img}" alt="Selamat datang di ${esc(settings.business)}" loading="eager" onerror="this.onerror=null;this.src='./background-percetakan-fatinart.png'"><span class="entrance-image-caption">✦ Percetakan & Sablon • Songgon, Banyuwangi</span></div>
   <div class="entrance-content">
    <div class="entrance-brand">${logo()}<div><b>${esc(settings.business)}</b><small>Murah • Berkualitas • Satset</small></div></div>
    <span class="entrance-eyebrow">SELAMAT DATANG DI TOKO KAMI</span>
    <h1>${title}</h1>
    <p>Temukan karya cetak, dokumentasi pesanan customer, 10 banner promosi, dan berbagai layanan FATIN ART ADVERTISING.</p>
    <button type="button" class="btn entrance-cta" data-act="enter-store">MASUK TOKO <span aria-hidden="true">→</span></button>
    <span class="entrance-hint">Klik tombol untuk melihat galeri dan katalog.</span>
   </div>
  </section>
  <p class="entrance-footnote">© FATIN ART ADVERTISING · Percetakan & Desain Grafis · Banyuwangi</p>
 </main>`
}
function publicPage(){let cats=['Semua',...new Set(catalogProducts().map(p=>p.category))];return `${header()}<div class="container">${syncBar()}<div class="portfolio-intro"><div><span class="portfolio-eyebrow">FATIN ART • SHOWCASE</span><h1>Ide kreatif, hasil cetak <em>berkelas.</em></h1><p>Temukan inspirasi dari layanan cetak pilihan, karya pelanggan, dan promosi terbaru.</p></div><div class="portfolio-actions"><a href="#galeri" class="btn">Lihat hasil cetakan ↗</a><button type="button" class="btn outline" data-act="manual-order">Pesan sesuai kebutuhan</button></div></div>${sliderMarkup()}<div class="benefits"><div class="benefit"><div class="benefit-icon">📸</div><div><b>Galeri Customer</b><small>Portofolio hasil kerja terbaru</small></div></div><div class="benefit"><div class="benefit-icon">✦</div><div><b>Foto Fleksibel</b><small>Bisa dipilih sebagai referensi desain</small></div></div><div class="benefit"><div class="benefit-icon">📝</div><div><b>Pesan Manual</b><small>Isi kebutuhan sesuai permintaan</small></div></div></div>${galleryPublicMarkup()}<section id="produk"><div class="section-head"><div><h2>Pilihan layanan & inspirasi cetak</h2><p>Daftar 25 layanan lama tetap disimpan. Foto hasil pesanan customer ditampilkan khusus di bagian galeri di atas.</p></div><input id="search" class="search" placeholder="⌕ Cari foto customer..." value="${esc(search)}"></div><div class="filters">${cats.map(c=>`<button class="chip ${category===c?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="products" class="products">${cards(filtered())}</div></section></div><footer class="foot" id="tentang"><div class="container foot-inner"><div><h3>${esc(settings.business)}</h3><p>${esc(settings.description)}</p><p>Murah – Berkualitas – Satset</p></div><div><h3>Hubungi kami</h3><p>📍 ${esc(settings.address)}</p><a href="${wa('Halo Fatin Art! Saya ingin bertanya tentang katalog foto customer.')}" target="_blank" rel="noopener" class="btn sm">WhatsApp Admin ↗</a></div></div></footer>`}
function render(passive=false){applyTheme();if(passive&&view==='admin'&&(editorIsDirty||mediaSaveBusy||busy)){updateStatusDisplay();return} $('app').innerHTML=view==='admin'&&isAdmin?adminPage():!enteredStore?storeEntrancePage():publicPage();if($('search'))$('search').addEventListener('input',e=>{search=e.target.value;$('products').innerHTML=cards(filtered())});updateStatusDisplay();setupSlider();setupGalleryAutoScroll()}
function share(){socialShare()}
function openCart(){return checkout('')}
function checkout(productId=''){const picked=productId?catalogProducts().find(p=>p.id===productId):null;popup('Form Pemesanan Manual',`<form id="checkoutForm"><div class="formrow"><label>Nama customer<input class="field" name="name" maxlength="100" required></label></div><div class="formrow"><label>Nomor WhatsApp<input class="field" name="phone" maxlength="20" inputmode="tel" required></label></div><div class="formgrid"><div class="formrow"><label>Foto / katalog yang dipilih<input class="field" name="productName" maxlength="140" value="${esc(picked?.name||'')}" placeholder="Contoh: Foto wisuda keluarga"></label></div><div class="formrow"><label>Jumlah / lembar<input class="field" name="qty" type="number" min="1" max="9999" value="1"></label></div></div><div class="formgrid"><div class="formrow"><label>Ukuran / bahan<input class="field" name="size" maxlength="140" placeholder="Contoh: 4R, A3+, banner 1x2 m"></label></div><div class="formrow"><label>Tanggal dibutuhkan<input class="field" name="dueDate" type="date"></label></div></div><div class="formrow"><label>Alamat / lokasi kirim<input class="field" name="address" maxlength="180" placeholder="Opsional"></label></div><div class="formrow"><label>Detail pemesanan manual<textarea class="field" name="notes" rows="4" maxlength="800" placeholder="Tulis kebutuhan customer secara manual: warna, finishing, tambahan teks, pengiriman, dan catatan lain."></textarea></label></div><p class="notice">Pesanan dikirim melalui WhatsApp. Anda bisa mengisi semua detail secara manual agar admin mudah memproses pesanan.</p><button class="btn full">Kirim Pesanan Manual ↗</button></form>`)}
function submitCheckout(f){let d=new FormData(f);let message=`Halo Admin ${settings.business}! Saya ingin memesan secara manual.
Nama customer: ${d.get('name')}
No. WhatsApp: ${d.get('phone')}
Foto/Katalog dipilih: ${d.get('productName')||'-'}
Jumlah: ${d.get('qty')||'-'}
Ukuran/Bahan: ${d.get('size')||'-'}
Tanggal dibutuhkan: ${d.get('dueDate')||'-'}
Alamat/Lokasi: ${d.get('address')||'-'}

Detail pesanan:
${d.get('notes')||'-'}

Mohon konfirmasi pesanan. Terima kasih.`;let url=wa(message);closePopup();window.open(url,'_blank','noopener');popup('Pesanan Siap Dikirim',`<p>Buka WhatsApp, lalu tekan Kirim untuk menyampaikan pesanan manual Anda kepada admin.</p><a class="btn full" target="_blank" rel="noopener" href="${esc(url)}">Buka WhatsApp ↗</a>`)}

async function adminGate(){
 if(!authReady){toast('Memeriksa akun Firebase…');return}
 if(!user){popup('Masuk Admin Firebase',`<div class="notice">Gunakan email dan password yang dibuat di Firebase Authentication. Jangan bagikan password.</div><form id="loginForm"><div class="formrow"><label>Email admin<input class="field" name="email" type="email" autocomplete="username" required></label></div><div class="formrow"><label>Password Firebase<input class="field" name="password" type="password" autocomplete="current-password" required></label></div><button class="btn full" type="submit">Masuk Admin</button></form>`);return}
 try{
   const result=await getDocFromServer(doc(db,'admins',user.uid));
   isAdmin=result.exists()&&result.data().active===true;
   if(!isAdmin){popup('Izin admin belum aktif',`<p>Akun berhasil login, tetapi dokumen izin admin belum ditemukan atau belum aktif.</p><div class="notice">Proyek: <b>${esc(firebaseConfig.projectId)}</b><br>Collection: <b>admins</b><br>Document ID (UID): <code style="word-break:break-all">${esc(user.uid)}</code><br>Field: <b>active</b> — Type: <b>boolean</b> — Value: <b>true</b></div><div class="admin-toolbar"><button class="btn" data-act="copy-uid">📋 Salin UID</button><button class="btn outline" data-act="check">Periksa ulang</button></div>`);return}
   view='admin';closePopup();render();watchOrders();startGalleryAdminWatch();
 }catch(e){toast(errMsg(e));popup('Gagal memeriksa akses admin',`<p>${esc(errMsg(e))}</p><div class="notice">UID akun login: <b style="word-break:break-all">${esc(user.uid)}</b><br>Jika Firestore tetap menggunakan aturan default <code>allow read, write: if false;</code>, admin tidak akan bisa mengaksesnya.</div><div class="admin-toolbar"><button class="btn outline" data-act="check">Coba lagi</button><button class="btn" data-act="copy-uid">📋 Salin UID</button></div>`)}
}
async function login(f){let btn=f.querySelector('button');btn.disabled=true;try{await signInWithEmailAndPassword(auth,f.elements.email.value.trim(),f.elements.password.value)}catch(e){toast(errMsg(e));btn.disabled=false}}
async function logout(){try{await signOut(auth)}catch(e){toast(errMsg(e))}stopGalleryAdminWatch();isAdmin=false;writeVerified=false;lastWriteError='';view='catalog';closePopup();history.replaceState(null,'',location.pathname);render()}
function watchOrders(){if(unsubOrders)unsubOrders();if(!isAdmin)return;unsubOrders=onSnapshot(collection(db,'orders'),snap=>{orders=snap.docs.map(x=>({id:x.id,...x.data()}));if(view==='admin'&&tab==='orders')render()},e=>toast(errMsg(e)))}
function adminPage(){
 return `${header()}<div class="container admin-shell"><section class="studio-hero"><div class="studio-hero-content"><span class="studio-kicker">✦ CREATIVE BUSINESS CONTROL CENTER</span><h1>Studio Admin <span>Fatin Art.</span></h1><p>Rancang katalog, pulihkan produk, atur identitas bisnis dan bagikan toko Anda dalam satu panel.</p><div class="studio-actions"><button class="btn" data-act="share">↗ Bagikan ke Facebook & Sosial Media</button><button class="btn outline" data-act="catalog">👁 Preview katalog pembeli</button></div></div><div class="studio-illustration" aria-hidden="true"><div class="studio-orbit">✦</div><div class="studio-tile one">◈ <small>20 TEMA</small></div><div class="studio-tile two">☁ <small>FIREBASE</small></div></div></section>${syncBar()}<div class="admin-fixbar"><div id="firestore-diagnostic-banner"><b>☁ Katalog online terbaca</b><br><span>Hak akses menulis belum diuji pada sesi ini; bukan error.</span></div><div class="admin-toolbar"><button type="button" class="btn outline sm" data-act="diagnose">🔎 Diagnostik Firebase</button><button type="button" class="btn outline sm" data-act="copy-uid">📋 Salin UID Admin</button></div></div><div class="statgrid stats-modern"><div class="stat"><span>📦 Produk Online</span><strong>${products.length}<small> / katalog</small></strong><p>Tersimpan di Firestore</p></div><div class="stat"><span>🎨 Template Tersedia</span><strong>${THEMES.length}<small> tema</small></strong><p>Sinkron untuk pelanggan</p></div><div class="stat"><span>🔒 Status Akses</span><strong>Admin <small>aktif</small></strong><p>Firebase Authentication</p></div></div><div class="tabs admin-tabs">${[['gallery','📰 Hasil Cetakan'],['products','▦ Produk & Layanan'],['banners','🖼 10 Foto Slider'],['design','🎨 20 Tema & Background'],['settings','⚙ Pengaturan'],['orders','▤ Nota'],['backup','↓ Cadangan']].map(([t,label])=>`<button class="chip ${tab===t?'active':''}" data-tab="${t}">${label}</button>`).join('')}</div><div class="panel modern-panel">${adminPanel()}</div></div>`
}
function previewAdminProducts(){return `<div class="empty-admin"><div>📦</div><h3>25 produk contoh sudah tampil untuk pembeli</h3><p>Ini <b>pratinjau bawaan, belum tersimpan online</b>. Klik <b>Pulihkan 25 Produk Awal</b> setelah aturan Firestore dan UID admin benar.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:15px"><button class="btn" data-act="restore">↻ Pulihkan 25 Produk</button><button class="btn outline" data-act="diagnose">🔎 Periksa Akses Firebase</button></div><details style="text-align:left;margin-top:18px"><summary style="cursor:pointer;font-weight:800">Lihat daftar 25 produk contoh ▾</summary><div class="preview-seed-list">${DEFAULT_PRODUCTS.map((p,i)=>`<div><span>${i+1}.</span> <b>${esc(p.name)}</b><small>${money(p.price)}</small></div>`).join('')}</div></details></div>`}
function adminPanel(){
 if(tab==='gallery')return galleryAdminPanel();
 if(tab==='banners')return bannerAdminPanel();
 if(tab==='products')return `<div class="row panel-top"><div><span class="section-kicker">PRODUK DAN LAYANAN</span><h3>Kelola produk cetak <span class="muted">(${products.length})</span> <small class="small muted">· CUSTOMER CATALOG v10</small></h3><p class="small muted">Foto yang disimpan otomatis muncul pada katalog publik customer.</p></div><div class="admin-toolbar"><button class="btn" data-act="add">＋ Tambah Produk</button><button class="btn outline" data-act="restore">↻ Pulihkan 25 Produk Awal</button><button class="btn outline" data-act="refresh-products">⟳ Cek Produk Online</button></div></div>${!products.length?previewAdminProducts():''}<div class="admin-products">${products.map(p=>`<div class="admin-product"><img src="${safeImg(p.img)}" alt="${esc(p.name)}" onerror="this.style.opacity='.2'"><div class="grow"><b>${esc(p.name)}</b><small>${esc(p.category)} · ${money(p.price)}</small></div><div class="admin-actions"><button class="btn ghost sm" data-edit="${esc(p.id)}">✎ Edit</button><button class="btn red sm" data-delete="${esc(p.id)}">✕</button></div></div>`).join('')}</div>`;
 if(tab==='design')return `<div class="panel-top"><span class="section-kicker">TAMPILAN KATALOG</span><h3>20 Tema Website Premium</h3><p class="small muted">Pilih tema — desain, warna, dan nuansa katalog akan diperbarui secara real-time untuk semua pengunjung.</p></div><div class="theme-grid">${THEMES.map(t=>`<button class="theme-card ${settings.template===t.id?'chosen':''}" data-template="${t.id}" type="button"><span class="theme-snapshot" style="background:${t.hero}"><span class="theme-mini-bar"></span><span class="theme-mini-title"></span><span class="theme-mini-sub"></span><span class="theme-mini-pill" style="background:${t.accent}"></span></span><span class="theme-meta"><span><b>${esc(t.name)}</b><small>${esc(t.note)}</small></span>${settings.template===t.id?'<span class="theme-check">✓</span>':''}</span></button>`).join('')}</div><div class="design-extras"><div class="design-section"><h3>Warna utama kustom</h3><p class="small muted">Gunakan warna pilihan Anda tanpa mengubah jenis tema.</p><div class="palette">${['#f45a35','#0e9f86','#5167d7','#a044a4','#d69c32','#202938','#df3e65','#b58b43','#1675c2','#26734f','#8259c2','#cb5580','#793cdd','#0b8f95'].map(c=>`<button class="swatch ${settings.accent===c?'active':''}" style="background:${c}" data-color="${c}" aria-label="Pilih warna ${c}"></button>`).join('')}</div></div><div class="design-section"><h3>Wallpaper / Background Website</h3><p class="small muted">Pilih background bawaan tema, warna solid, pola, atau unggah foto PNG/JPG dari komputer.</p><form id="backgroundForm"><div class="formgrid"><div class="formrow"><label>Mode background<select name="backgroundMode" class="field">${[['image','Wallpaper/Foto background (PNG/JPG)'],['theme','Background bawaan tema'],['solid','Warna solid'],['pattern','Pola geometris']].map(([v,n])=>`<option value="${v}" ${settings.backgroundMode===v?'selected':''}>${n}</option>`).join('')}</select></label></div><div class="formrow"><label>Warna dasar<input class="field color-input" type="color" name="backgroundColor" value="${validHex(settings.backgroundColor)?settings.backgroundColor:'#e9eef3'}"></label></div></div><div class="formrow"><label>Unggah background foto PNG/JPG/WEBP (maks. 12 MB)<input class="field" id="backgroundFile" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="small muted">Foto ini akan dipakai sebagai wallpaper latar belakang halaman katalog. Agar foto terlihat jelas, atur lapisan terang sekitar 10–30%. Admin juga bisa memilih template instan di bawah ini.</p>${(settings.backgroundImage||settings.welcomeImage)?`<img class="preview background-preview" id="backgroundPreview" src="${safeImg(settings.backgroundImage||settings.welcomeImage)}">`:'<img class="preview background-preview hidden" id="backgroundPreview">'}</div><div class="formrow"><label>Pilih template background siap pakai</label><div class="bg-preset-grid">${BG_PRESETS.map(p=>`<button type="button" class="bg-preset-card ${(settings.backgroundImage||'')===p.image?'active':''}" data-act="bg-preset" data-preset="${p.id}"><span class="bg-preset-thumb" style="background-image:url('${esc(p.preview)}')"></span><span><b>${esc(p.name)}</b><small>${esc(p.note)}</small></span></button>`).join('')}<button type="button" class="bg-preset-card use-welcome" data-act="bg-use-welcome"><span class="bg-preset-thumb welcome">🖼</span><span><b>Pakai gambar sambutan</b><small>Gunakan foto sambutan sebagai background katalog</small></span></button></div></div><div class="formrow"><label>Lapisan terang di atas wallpaper: <b id="overlayValue">${Number(settings.backgroundOverlay??18)}%</b><input class="field" type="range" name="backgroundOverlay" min="0" max="95" value="${Number(settings.backgroundOverlay??18)}" oninput="document.getElementById('overlayValue').textContent=this.value+'%'" style="padding:4px"></label></div>${mediaStatusMarkup('background')}<div class="admin-toolbar"><button class="btn" type="submit">💾 Simpan Mode & Warna Background</button>${settings.backgroundImage?'<button class="btn red" type="button" data-act="remove-bg">Hapus Foto Background</button>':''}</div></form></div></div>`;
 if(tab==='settings')return `<h3>Identitas, konten & kontak resmi</h3><p class="small muted">Hanya admin yang dapat mengubah pengaturan ini. Logo dan gambar sambutan otomatis tersimpan setelah file dipilih.</p><button class="btn outline sm" type="button" data-tab="design" style="margin-bottom:16px">🎨 Atur Background & 20 Tema →</button><form id="settingsForm"><div class="formgrid"><div class="formrow"><label>Nama usaha<input class="field" name="business" maxlength="120" required value="${esc(settings.business)}"></label></div><div class="formrow"><label>Subjudul<input class="field" name="subtitle" maxlength="120" value="${esc(settings.subtitle)}"></label></div></div><div class="formrow"><label>Judul banner (boleh memakai &lt;em&gt;)<input class="field" name="headline" maxlength="250" value="${esc(settings.headline)}"></label></div><div class="formrow"><label>Deskripsi<textarea class="field" name="description" maxlength="1200" rows="3">${esc(settings.description)}</textarea></label></div><div class="formgrid"><div class="formrow"><label>Nomor WhatsApp admin<input class="field" name="wa" maxlength="24" required value="${esc(settings.wa)}"></label></div><div class="formrow"><label>Alamat<input class="field" name="address" maxlength="300" value="${esc(settings.address)}"></label></div></div><div class="formrow"><label>Tulisan sambutan pengunjung<input class="field" name="welcomeText" maxlength="120" value="${esc(settings.welcomeText||'SILAKAN MASUK TOKO')}" placeholder="Contoh: SILAKAN MASUK TOKO"></label></div><div class="media-editor"><div class="media-head"><div><strong>✦ Logo usaha</strong><p class="small muted">Pilih PNG/JPG/WEBP. Logo otomatis tersimpan, tanpa perlu klik tombol Simpan Pengaturan.</p></div><span class="pill">Firebase online</span></div><div class="media-preview-row"><div class="media-logo-preview" id="logoPreviewContainer">${settings.logo?`<img id="logoPreview" src="${safeImg(settings.logo)}" alt="Logo saat ini">`:'<span id="logoPreviewEmpty">✦</span>'}</div><div class="media-control"><label for="logoFile" class="btn outline">📷 Ganti Logo PNG / JPG</label><input class="visually-hidden-file" id="logoFile" type="file" accept="image/png,image/jpeg,image/webp"><p class="small muted">Logo ringan untuk website, bukan file cetak HD.</p>${settings.logo?'<button class="btn red sm" type="button" data-act="remove-logo">Hapus Logo</button>':''}</div></div>${mediaStatusMarkup('logo')}</div><div class="media-editor"><div class="media-head"><div><strong>🖼 Gambar sambutan pengunjung</strong><p class="small muted">Gambar ini muncul sebagai halaman pembuka tersendiri, sebelum pengunjung menekan “MASUK TOKO”. Tidak akan ditampilkan lagi di dalam katalog. Hanya admin yang bisa menggantinya.</p></div><span class="pill">Landing welcome</span></div><div class="media-preview-row"><div class="media-banner-preview" id="welcomePreviewContainer">${settings.welcomeImage?`<img id="welcomePreview" src="${safeImg(settings.welcomeImage)}" alt="Gambar sambutan">`:'<img id="welcomePreview" src="./background-percetakan-fatinart.png" alt="Gambar sambutan default">'}</div><div class="media-control"><label for="welcomeFile" class="btn outline">🖼 Ganti Gambar Sambutan</label><input class="visually-hidden-file" id="welcomeFile" type="file" accept="image/png,image/jpeg,image/webp"><p class="small muted">Gunakan foto toko, hasil percetakan, atau suasana studio. File otomatis disimpan ke Firebase.</p>${settings.welcomeImage?'<button class="btn red sm" type="button" data-act="remove-welcome">Hapus Gambar Sambutan</button>':''}</div></div>${mediaStatusMarkup('welcome')}</div><div class="formrow"><label><input name="showPrices" type="checkbox" ${settings.showPrices?'checked':''}> Tampilkan harga di katalog</label></div><div id="settings-save-status" role="status" class="small muted" aria-live="polite"></div><button class="btn" type="submit">Simpan Pengaturan Online</button></form>`;
 if(tab==='orders')return `<div class="row"><div><h3>Nota & Invoice FATIN ART</h3><p class="small muted">Pilih produk dan harga dari katalog Firebase; hitung otomatis dan cetak nota berlogo. Hanya admin yang dapat melihat data pelanggan.</p></div><button class="btn sm" data-act="new-order">+ Buat Nota</button></div>${orders.map(o=>`<div class="admin-product" style="display:block;margin:12px 0"><div class="row"><b>${esc(o.id)} · ${esc(o.name)}</b><span class="pill">${esc(o.status)}</span></div><p class="small muted">${esc(o.date||'')} • ${esc(o.phone)} • ${money(o.total)}</p><p class="small">${esc(o.items)}</p><div class="admin-toolbar"><select class="field" style="max-width:210px" data-status="${esc(o.id)}">${['Menunggu konfirmasi','Diproses','Selesai','Lunas','Dibatalkan'].map(x=>`<option ${o.status===x?'selected':''}>${x}</option>`).join('')}</select><button class="btn outline sm" data-invoice="${esc(o.id)}">Lihat / Cetak</button><button class="btn ghost sm" data-edit-order="${esc(o.id)}">Edit</button><button class="btn red sm" data-delete-order="${esc(o.id)}">Hapus</button></div></div>`).join('')||'<p class="small muted">Belum ada nota. Buat nota setelah menerima pesanan melalui WhatsApp.</p>'}`;
 return `<h3>Cadangan dan impor data</h3><p class="small muted">Ekspor JSON untuk menyimpan salinan produk dan pengaturan. Jangan bagikan file berisi data pribadi.</p><div class="admin-toolbar"><button class="btn" data-act="export">⬇ Ekspor JSON</button><label class="btn outline">⬆ Impor JSON<input type="file" id="importFile" accept=".json,application/json" hidden></label></div><hr style="border:0;border-top:1px solid var(--border);margin:25px 0"><h3>Migrasi katalog lama</h3><p class="small muted">Mengunggah data dari versi lokal aplikasi sebelumnya pada browser ini, tanpa menghapus produk online lain.</p><button class="btn outline" data-act="migrate">Migrasikan produk lokal ke Firebase</button>`;
}
function productForm(id=''){const p=products.find(x=>x.id===id)||{name:'',category:'',price:0,desc:'',img:''};popup(id?'Edit Foto Customer':'Tambah Foto Customer',`<form id="productForm" data-id="${esc(id)}"><div class="formrow"><label>Judul foto / nama customer<input class="field" name="name" maxlength="130" required value="${esc(p.name)}"></label></div><div class="formgrid"><div class="formrow"><label>Kategori foto<input class="field" name="category" maxlength="60" required value="${esc(p.category)}"></label></div><div class="formrow"><label>Harga referensi (Rp)<input class="field" name="price" type="number" min="0" max="1000000000" required value="${Number(p.price)||0}"></label></div></div><div class="formrow"><label>Keterangan foto customer<textarea class="field" name="desc" maxlength="1500" rows="3">${esc(p.desc)}</textarea></label></div><div class="formrow"><label>Upload PNG/JPG/WEBP maksimal 12 MB<input class="field" type="file" id="photoFile" accept="image/png,image/jpeg,image/webp"></label><p class="small muted"><b>UPLOAD:</b> memilih foto akan langsung mengunggahnya ke Firebase secara otomatis. Foto dikompresi sebagai thumbnail katalog, bukan berkas cetak HD.</p><img class="preview ${p.img?'':'hidden'}" id="photoPreview" src="${safeImg(p.img)}"></div><p class="notice" style="margin:12px 0">Saat foto dipilih, sistem mulai menyimpannya otomatis. Jangan tutup jendela sampai muncul <b>✅ Foto berhasil tersimpan dan terverifikasi di Firebase</b>. Jika masih gagal, pesan error lengkap akan tampil di bawah.</p><div id="product-save-status" role="status" aria-live="polite" class="small muted" style="margin-bottom:10px"></div><div id="product-save-error" class="photo-error hidden" role="alert"></div><button class="btn full" type="submit">💾 Simpan & Verifikasi Produk</button></form>`)}
async function shrink(file, maxLength=76000){
 if(!file)return '';
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>12*1024*1024)throw Error('Gunakan PNG/JPG/WEBP maksimal 12 MB.');
 let source,url='';
 try{
   if(typeof createImageBitmap==='function')source=await createImageBitmap(file);
   else{
     url=URL.createObjectURL(file);
     source=await new Promise((resolve,reject)=>{let im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Gambar tidak dapat dibuka.'));im.src=url});
   }
   let sw=source.width||source.naturalWidth,sh=source.height||source.naturalHeight;
   if(!sw||!sh)throw Error('Dimensi gambar tidak dapat dibaca.');
   const scale=Math.min(1,840/Math.max(sw,sh));
   let w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
   const canvas=document.createElement('canvas');let result='';
   for(let i=0;i<18;i++){
     canvas.width=w;canvas.height=h;
     const ctx=canvas.getContext('2d');if(!ctx)throw Error('Browser tidak mendukung kompresi gambar.');
     ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);ctx.drawImage(source,0,0,w,h);
     result=canvas.toDataURL('image/jpeg',Math.max(.39,.79-(i%5)*.075));
     if(result.startsWith('data:image/jpeg;base64,')&&result.length<=maxLength)break;
     // Turunkan resolusi bertahap agar data JPG tidak melebihi aturan Firestore.
     if(i%2===1){w=Math.max(1,Math.round(w*.83));h=Math.max(1,Math.round(h*.83));}
   }
   if(result.length>maxLength||!result.startsWith('data:image/jpeg;base64,'))throw Error('Foto belum dapat dikompresi. Coba JPG/PNG resolusi lebih kecil.');
   return result;
 }finally{if(source&&typeof source.close==='function')source.close();if(url)URL.revokeObjectURL(url)}
}
function sortOnlineProducts(){products.sort((a,b)=>String(a.id).localeCompare(String(b.id),undefined,{numeric:true}))}
function updateOnlineProduct(p){products=[...products.filter(x=>x.id!==p.id),p];sortOnlineProducts();pReady=true;productError='';updateConnectionError();render()}
async function fetchProductsFromServer(){
 if(!isAdmin) return toast('Hanya admin dapat memeriksa data online.');
 try{
  const snap=await getDocsFromServer(collection(db,'products'));
  products=snap.docs.map(d=>({...d.data(),id:d.id}));sortOnlineProducts();pReady=true;productError='';updateConnectionError();render();
  toast(`Data terbaru dari server: ${products.length} produk online.`);
 }catch(e){writeFail(e,'Memuat ulang daftar produk dari server')}
}
function productStatus(message,state='working'){
 const el=$('product-save-status');
 if(!el)return;
 el.className='photo-status '+state;
 el.textContent=message;
}
function showProductErrorDetail(message){
 const el=$('product-save-error');if(!el)return;
 el.classList.remove('hidden');
 el.textContent=message;
}
function firebaseTimeout(promise,ms,label){
 let timer;
 return Promise.race([
  promise,
  new Promise((_,reject)=>{timer=setTimeout(()=>{const e=new Error(`${label} belum mendapat respons dari Firebase selama ${Math.ceil(ms/1000)} detik. Koneksi atau server kemungkinan sedang bermasalah; periksa Cek Produk Online sebelum mengulang.`);e.code='deadline-exceeded';reject(e)},ms)})
 ]).finally(()=>clearTimeout(timer));
}
function isFormValid(f){
 if(!f?.isConnected)return false;
 const ok=f.checkValidity();
 if(!ok)f.reportValidity();
 return ok;
}
async function saveProduct(f,{automatic=false}={}){
 if(!isAdmin)return toast('Anda harus login sebagai admin.');
 if(photoSaving)return toast('Unggah sebelumnya masih berjalan.');
 if(!isFormValid(f))return productStatus('Isi nama, kategori dan harga dahulu, lalu pilih ulang fotonya.','error');
 const button=f.querySelector('button[type="submit"]');
 const id=f.dataset.id||`p${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;
 const data=new FormData(f),old=products.find(x=>x.id===id),file=f.querySelector('#photoFile')?.files?.[0];
 const errEl=$('product-save-error');if(errEl){errEl.textContent='';errEl.classList.add('hidden')}
 photoSaving=true;button.disabled=true;button.textContent='⏳ Mengunggah ke Firebase…';
 let committed=false,stage='persiapan foto';
 try{
   if(!navigator.onLine)throw Object.assign(new Error('Browser sedang offline. Sambungkan internet lalu coba lagi.'),{code:'offline'});
   productStatus(file?'📷 Mengompresi foto untuk katalog…':'⏳ Menyiapkan perubahan produk…');
   const img=file?await shrink(file,76000):old?.img||'';
   const payload={id,name:String(data.get('name')).trim(),category:String(data.get('category')).trim(),price:Number(data.get('price')),desc:String(data.get('desc')).trim(),img,updatedAt:serverTimestamp()};
   if(!payload.name||!payload.category)throw Error('Nama produk dan kategori wajib diisi.');
   if(!Number.isFinite(payload.price)||payload.price<0)throw Error('Harga produk tidak valid.');
   if(file&&(!img||!img.startsWith('data:image/jpeg;base64,')))throw Error('Hasil kompresi foto tidak valid.');
   stage='kirim ke products/'+id;
   productStatus(`☁️ Mengirim ${file?`foto thumbnail (${Math.round(img.length/1024)} KB) dan `:''}data produk ke Firestore…`);
   // setDoc resolves after Firebase mengakui penulisan ke server, bukan saat pratinjau tampil.
   await firebaseTimeout(setDoc(doc(db,'products',id),payload),25000,'Simpan foto');
   committed=true;
   stage='verifikasi server';
   productStatus('🔍 Memastikan foto terbaru tersimpan pada Firestore (server)…');
   let remote=null,lastVerifyError=null;
   for(let attempt=0;attempt<3;attempt++){
     try{
       const snap=await firebaseTimeout(getDocFromServer(doc(db,'products',id)),12000,'Verifikasi foto');
       if(!snap.exists())throw Error('Dokumen belum ditemukan setelah disimpan.');
       const fresh={...snap.data(),id:snap.id};
       if(fresh.img!==payload.img||fresh.name!==payload.name||Number(fresh.price)!==payload.price)throw Error('Data yang dibaca belum sesuai unggahan terbaru.');
       remote=fresh;break;
     }catch(e){lastVerifyError=e;if(attempt<2)await new Promise(r=>setTimeout(r,450*(attempt+1)))}
   }
   if(!remote)throw lastVerifyError||Error('Verifikasi foto di server belum berhasil.');
   updateOnlineProduct(remote);
   lastWriteError='';
   productStatus('✅ Foto dan produk berhasil tersimpan online dan terverifikasi.','success');
   closePopup();
   popup('✅ FOTO BERHASIL DISIMPAN ONLINE',`<div class="saved-photo-card"><img src="${safeImg(remote.img)}" alt="Foto produk tersimpan"><div><b>${esc(remote.name)}</b><p class="small muted">Foto sudah dibaca kembali dari server Firebase. Semua pengunjung dengan akses katalog yang sama akan melihat foto baru.</p><small>Data foto: ${Math.round(String(remote.img).length/1024)} KB</small></div></div><div class="admin-toolbar"><a class="btn" href="${esc(customerURL())}#produk" target="_blank" rel="noopener noreferrer">👁 Buka Katalog Pembeli ↗</a><button class="btn outline" type="button" data-act="close">Tutup</button></div>`);
   toast('Foto baru tersimpan di Firebase.');
 }catch(e){
   const code=e?.code||'error';
   let action='';
   if(String(code).includes('permission-denied'))action='Firestore mengizinkan login/tema tetapi menolak penulisan products/'+id+'. Periksa bagian match /products/{productId} di Rules; pastikan allow update/create untuk isAdmin() dan ukuran img sesuai aturan.';
   else if(String(code).includes('resource-exhausted'))action='Batas database/kuota tercapai. Foto katalog perlu diperkecil atau gunakan penyimpanan gambar terpisah.';
   else if(String(code).includes('unavailable')||String(code)==='offline')action='Periksa internet. Pastikan Firestore dapat diakses dan deployment Vercel terbaru sudah aktif.';
   else if(String(code).includes('deadline-exceeded'))action='Jangan langsung klik berkali-kali; tutup dan gunakan Cek Produk Online untuk mengetahui apakah perubahan telah sampai ke server.';
   else action='Coba klik Simpan lagi. Jika masih gagal, salin pesan ini untuk diperiksa.';
   const message=`❌ ${committed?'Foto sudah dikirim tetapi belum terverifikasi':'Gagal menyimpan foto'} | Tahap: ${stage} | Kode: ${code} | ${e?.message||String(e)} | ${action}`;
   console.error('[FATIN ART PHOTO UPLOAD]',{stage,code,id,bytes:file?.size||0},e);
   productStatus(committed?'⚠️ Penulisan berhasil, tetapi verifikasi server belum selesai.':'❌ Simpan gagal. Coba lagi setelah membaca penjelasan di bawah.','error');
   showProductErrorDetail(message);
   lastWriteError=message;updateStatusDisplay();
   toast('Foto belum terverifikasi. Detail error ada di bawah tombol upload.');
 }finally{
   photoSaving=false;
   if(button.isConnected){button.disabled=false;button.textContent='💾 Simpan / Coba Lagi ke Firebase'}
 }
}
// Simpan HANYA field yang berubah. Saat dokumen belum ada, lengkapi field baku
// supaya validasi Rules versi lama yang membutuhkan business/logo/backgroundImage tetap terpenuhi.
async function patchCatalog(patch,label='Simpan katalog'){
 const ref=doc(db,'public','catalog');
 const before=await firebaseTimeout(getDocFromServer(ref),15000,'Cek pengaturan katalog');
 const current=before.exists()?before.data():{};
 const missing={};
 for(const [key,value] of Object.entries(def)){
   if(!Object.prototype.hasOwnProperty.call(current,key)&&!Object.prototype.hasOwnProperty.call(patch,key))missing[key]=value;
 }
 const payload={...missing,...patch};
 await firebaseTimeout(setDoc(ref,payload,{merge:true}),25000,label);
 const result=await firebaseTimeout(getDocFromServer(ref),15000,'Verifikasi '+label);
 if(!result.exists())throw new Error('Pengaturan tidak ditemukan setelah disimpan.');
 const remote=result.data();
 for(const [key,value] of Object.entries(patch)){
   // Untuk timestamp: cek keberadaan, bukan nilai sentinelnya.
   if(key==='diagnosticAt'){if(typeof remote.diagnosticAt!=='number'||remote.diagnosticAt!==value)throw new Error('Tes izin simpan belum terverifikasi oleh server.');continue}
   if(remote[key]!==value)throw new Error('Data '+key+' yang dibaca dari server berbeda dengan data yang dikirim.');
 }
 return remote;
}
// Media brand disimpan per-field, tanpa menimpa tema, nama usaha atau media lainnya.
async function saveBrandAsset(kind,file=null,remove=false){
 if(!isAdmin)return setMediaStatus(kind,'Anda harus masuk sebagai admin.','error');
 if(mediaSaveBusy||busy)return setMediaStatus(kind,'Ada penyimpanan lain. Coba lagi setelah selesai.','error');
 mediaSaveBusy=true;
 const field=kind==='logo'?'logo':kind==='welcome'?'welcomeImage':'backgroundImage';
 let payload={};let assetData='';
 try{
  if(!navigator.onLine)throw Object.assign(new Error('Tidak ada koneksi internet.'),{code:'offline'});
  setMediaStatus(kind,remove?'Menghapus file dari katalog online…':'Mengoptimalkan foto, mohon jangan tutup halaman…','working');
  assetData=remove?'':await shrinkMedia(file,kind==='logo'?65000:(kind==='welcome'?165000:165000),kind==='logo'?450:(kind==='welcome'?1500:1450));
  if(!remove&&!assetData)throw Error('Gagal memproses file gambar.');
  payload={[field]:assetData};
  if(kind==='background')payload.backgroundMode=remove?'theme':'image';
  setMediaStatus(kind,`Mengirim ${remove?'perubahan':Math.round(assetData.length/1024)+' KB gambar'} ke Firebase…`,'working');
  const remote=await patchCatalog(payload,'Simpan '+kind);
  setMediaStatus(kind,'Data telah dibaca ulang dan cocok dengan Firebase.','working');
  settings={...settings,...remote};
  mediaStatus[kind]={text:(kind==='logo'?'✅ Logo':kind==='welcome'?'✅ Gambar sambutan':'✅ Background')+(remove?' berhasil dihapus':' berhasil disimpan dan diverifikasi online. Buka katalog pembeli untuk melihatnya.'),type:'success'};
  lastWriteError='';writeVerified=true;render(true);
  if(kind==='logo'){const node=document.querySelector('.top .logo,.top .logo-fallback');if(node)node.outerHTML=logo();}
  toast(kind==='logo'?'Logo website berhasil diubah.':kind==='welcome'?'Gambar sambutan berhasil diubah.':'Background website berhasil diubah.');
 }catch(e){const msg=safeMediaError(e,kind);console.error('[FATIN ART MEDIA UPLOAD]',{kind,field,code:e?.code},e);setMediaStatus(kind,'❌ '+msg,'error');lastWriteError=msg;updateStatusDisplay()}
 finally{mediaSaveBusy=false}
}
// Canvas secara bertahap mengecilkan gambar untuk logo/background. Logo WEBP
// mempertahankan transparansi agar tampil baik pada navbar.
async function shrinkMedia(file,maxLength,maxDimension){
 if(!file)throw Error('Pilih foto PNG, JPG atau WEBP terlebih dahulu.');
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>12*1024*1024)throw Error('Format harus PNG/JPG/WEBP, maksimal 12 MB.');
 let source=null,url='';
 try{
  if(typeof createImageBitmap==='function')source=await createImageBitmap(file);
  else{url=URL.createObjectURL(file);source=await new Promise((ok,fail)=>{let img=new Image;img.onload=()=>ok(img);img.onerror=()=>fail(Error('Gambar tidak bisa dibaca.'));img.src=url});}
  let w=source.width||source.naturalWidth,h=source.height||source.naturalHeight;
  if(!w||!h)throw Error('Dimensi foto tidak tersedia.');
  const k=Math.min(1,maxDimension/Math.max(w,h));w=Math.max(1,Math.round(w*k));h=Math.max(1,Math.round(h*k));
  const cv=document.createElement('canvas');
  let val='';
  for(let i=0;i<25;i++){
    cv.width=w;cv.height=h;
    const cx=cv.getContext('2d');if(!cx)throw Error('Browser tidak mendukung pemrosesan gambar.');
    cx.clearRect(0,0,w,h);cx.drawImage(source,0,0,w,h);
    const q=Math.max(.44,.83-(i%6)*.07);
    val=cv.toDataURL('image/webp',q);
    if(!val.startsWith('data:image/webp;base64,')){
      cx.globalCompositeOperation='destination-over';cx.fillStyle='#ffffff';cx.fillRect(0,0,w,h);
      val=cv.toDataURL('image/jpeg',q);
    }
    if(val.length<=maxLength)break;
    if(i%2===1){w=Math.max(1,Math.round(w*.82));h=Math.max(1,Math.round(h*.82));}
  }
  if(val.length>maxLength||!/^data:image\/(webp|jpeg);base64,/.test(val))throw Error('Foto terlalu kompleks; coba resolusi lebih kecil.');
  return val;
 }finally{if(source&&typeof source.close==='function')source.close();if(url)URL.revokeObjectURL(url)}
}
async function saveSettings(f){
 if(!isAdmin||busy||mediaSaveBusy)return toast('Tunggu proses upload sebelumnya selesai.');
 busy=true;const b=f.querySelector('button[type="submit"]');b.disabled=true;b.textContent='⏳ Memverifikasi penyimpanan…';
 const d=new FormData(f);let patch={};
 for(const k of ['business','subtitle','headline','description','wa','address','welcomeText'])patch[k]=String(d.get(k)||'').trim();
 patch.showPrices=f.elements.showPrices.checked;
 try{
  const remote=await patchCatalog(patch,'Simpan pengaturan');
  settings={...settings,...remote};editorIsDirty=false;lastWriteError='';writeVerified=true;render();toast('✅ Pengaturan bisnis tersimpan dan terverifikasi online.');
 }catch(e){writeFail(e,'Menyimpan pengaturan bisnis');const n=$('settings-save-status');if(n)n.textContent=errMsg(e)}
 finally{busy=false;if(b.isConnected){b.disabled=false;b.textContent='Simpan Pengaturan Online'}}
}
async function design(patch){
 if(!isAdmin||busy||mediaSaveBusy)return;
 let next={...patch};
 if(patch.template){const t=THEMES.find(x=>x.id===patch.template);if(!t)return;next.accent=t.accent;if(settings.backgroundMode==='theme')next.backgroundColor=t.bg}
 busy=true;const prev={...settings};settings={...settings,...next};render();
 try{
  const remote=await patchCatalog(next,'Simpan tema');
  settings={...settings,...remote};lastWriteError='';writeVerified=true;render();toast('✅ Tema berhasil tersimpan untuk semua pelanggan.');
 }catch(e){settings=prev;writeFail(e,'Menyimpan tema');render()}
 finally{busy=false}
}
async function applyBackgroundPreset(id){
 if(!isAdmin||busy||mediaSaveBusy)return toast('Tunggu penyimpanan lain selesai.');
 const preset=BG_PRESETS.find(x=>x.id===id);if(!preset)return;
 mediaSaveBusy=true;
 setMediaStatus('background','Menyiapkan template dan menyimpan ke Firebase…','working');
 try{
  const response=await fetch(preset.image,{cache:'force-cache'});
  if(!response.ok)throw Error('File template tidak ditemukan ('+response.status+'). Upload folder backgrounds ke GitHub.');
  const blob=await response.blob();
  if(!blob.type.startsWith('image/')||blob.size>95000)throw Error('Ukuran template tidak sesuai.');
  const photo=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Gagal membaca template.'));reader.readAsDataURL(blob)});
  if(!/^data:image\/(?:webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/i.test(photo)||photo.length>140000)throw Error('Data template gambar tidak valid.');
  const remote=await patchCatalog({backgroundMode:'image',backgroundImage:photo,backgroundOverlay:Math.max(0,Math.min(95,Number(settings.backgroundOverlay??52)))},'Template background '+preset.name);
  settings={...settings,...remote};editorIsDirty=false;lastWriteError='';writeVerified=true;
  mediaStatus.background={text:'✅ '+preset.name+' tersimpan online. Foto langsung diterapkan pada katalog.',type:'success'};render();toast('Template '+preset.name+' berhasil dipasang.');
 }catch(e){setMediaStatus('background','❌ '+safeMediaError(e,'background'),'error');writeFail(e,'Memasang template background')}
 finally{mediaSaveBusy=false}
}
async function useWelcomeAsBackground(){
 if(!isAdmin)return;
 if(!isVisualImage(settings.welcomeImage))return toast('Belum ada gambar sambutan. Upload dulu di Pengaturan.');
 setMediaStatus('background','Menggunakan gambar sambutan sebagai background…','working');
 try{
  const remote=await patchCatalog({backgroundMode:'image',backgroundImage:settings.welcomeImage,backgroundOverlay:Number(settings.backgroundOverlay??66)},'Background dari gambar sambutan');
  settings={...settings,...remote};editorIsDirty=false;lastWriteError='';writeVerified=true;mediaStatus.background={text:'✅ Background memakai gambar sambutan.',type:'success'};render();toast('Background katalog memakai gambar sambutan.');
 }catch(e){setMediaStatus('background','❌ '+safeMediaError(e,'background'),'error');writeFail(e,'Memasang background dari gambar sambutan')}
}

async function saveBackground(f){
 if(!isAdmin||busy||mediaSaveBusy)return toast('Tunggu penyimpanan sebelumnya selesai.');
 busy=true;const btn=f.querySelector('button[type="submit"]');btn.disabled=true;
 const d=new FormData(f);let mode=String(d.get('backgroundMode'));
 const patch={backgroundMode:MODES.includes(mode)?mode:'theme',backgroundColor:validHex(d.get('backgroundColor'))?d.get('backgroundColor'):currentTheme().bg,backgroundOverlay:Math.max(0,Math.min(95,Number(d.get('backgroundOverlay'))||0))};
 try{
  // Jika file dipilih dan otomatis disimpan sebelumnya, pilihan mode tetap bisa diatur.
  if(patch.backgroundMode==='image'&&!activeBackgroundSource())throw Error('Pilih template atau upload foto background terlebih dahulu.');
  const remote=await patchCatalog(patch,'Simpan pengaturan background');
  settings={...settings,...remote};editorIsDirty=false;lastWriteError='';writeVerified=true;mediaStatus.background={text:'✅ Mode dan warna background sudah tersimpan online.',type:'success'};render();toast('Background tersimpan dan diverifikasi.');
 }catch(e){setMediaStatus('background','❌ '+safeMediaError(e,'background'),'error');writeFail(e,'Menyimpan mode background')}
 finally{busy=false;if(btn.isConnected){btn.disabled=false;btn.textContent='💾 Simpan Mode & Warna Background'}}
}
async function removeBackground(){if(!isAdmin||!confirm('Hapus foto background yang sedang terpasang?'))return;await saveBrandAsset('background',null,true)}
async function removeLogo(){if(!isAdmin||!confirm('Hapus logo yang sedang terpasang?'))return;await saveBrandAsset('logo',null,true)}
async function removeWelcome(){if(!isAdmin||!confirm('Hapus gambar sambutan toko yang sedang terpasang?'))return;await saveBrandAsset('welcome',null,true)}
async function restoreDefaults(){
 if(!isAdmin||busy)return;
 if(!pReady||!sReady)return toast('Tunggu koneksi database selesai.');
 if(productError){return popup('Firestore belum mengizinkan akses',`<p>Daftar 25 produk hanya contoh lokal. Database Firestore belum bisa dibaca.</p>${adminHelp()}<button class="btn full" data-act="diagnose">🔎 Periksa Akses Firebase</button>`)}
 const existing=new Set(products.map(p=>p.id));
 const missing=DEFAULT_PRODUCTS.filter(p=>!existing.has(p.id));
 if(!missing.length)return toast('Ke-25 produk awal sudah tersedia di Firestore.');
 if(!confirm(`Simpan ${missing.length} produk awal yang belum ada ke Firestore? Produk yang sudah diubah tidak akan ditimpa.`))return;
 busy=true;let uploaded=0;
 try {
   const adminDoc=await getDoc(doc(db,'admins',user.uid));
   if(!adminDoc.exists()||adminDoc.data().active!==true)throw new Error('Dokumen admins/'+user.uid+' belum memiliki active=true (boolean).');
   for(let i=0;i<missing.length;i+=5){
     let batch=writeBatch(db);
     missing.slice(i,i+5).forEach((p,n)=>{let x=cleanProduct(p,i+n);batch.set(doc(db,'products',x.id),x)});
     await batch.commit();uploaded+=missing.slice(i,i+5).length;
   }
   try {await patchCatalog({seeded:true},'Tandai produk awal')}
   catch(settingsErr){toast(`${uploaded} produk tersimpan. Pengaturan katalog masih gagal: ${errMsg(settingsErr)}`);return}
   lastWriteError='';toast(`Berhasil! ${uploaded} produk awal tersimpan di Firestore. Cek katalog pembeli.`);
 } catch(e){
   const message=errMsg(e);writeFail(e,uploaded?`Pemulihan (${uploaded} produk tersimpan, sisanya gagal)`:'Pemulihan 25 produk');
   popup('Pemulihan produk belum berhasil',`<p><b>${uploaded}</b> produk baru berhasil ditulis ke Firestore.</p><p>${esc(message)}</p>${adminHelp()}<button class="btn full" data-act="diagnose">🔎 Periksa Akses Firebase</button>`);
 } finally {
   busy=false;
   // Snapshot selama batch sengaja tidak merender ulang form. Muat ulang setelah selesai.
   try{const fresh=await getDocsFromServer(collection(db,'products'));products=fresh.docs.map(x=>({...x.data(),id:x.id}));sortOnlineProducts();pReady=true;productError='';updateConnectionError();render();}
   catch(e){writeFail(e,'Memuat ulang produk setelah pemulihan')}
 }
}
function adminHelp(){return `<div class="notice" style="line-height:1.9"><b>Cara mengaktifkan izin tulis:</b><br>1. Firestore Database → Rules: gunakan file <b>firestore.rules</b> dari ZIP terbaru, lalu klik <b>Publish</b>.<br>2. Authentication → Users: salin UID admin yang sedang login.<br>3. Firestore Database → Data: pastikan dokumen <b>admins/UID</b> memiliki field <b>active</b> bertipe <b>boolean</b> dan nilai <b>true</b>.<br>4. Pastikan projectId konfigurasi adalah <b>percetakan-sablon</b>.<br>5. Login ulang untuk memuat izin terbaru, lalu tekan <b>Tes Izin Simpan</b>.</div>`}
async function copyUID(){if(!user)return toast('Login Firebase terlebih dahulu.');try{await navigator.clipboard.writeText(user.uid);toast('UID admin berhasil disalin.')}catch(e){prompt('Salin UID admin:',user.uid)}}
async function diagnoseFirebase(){
 if(!user)return toast('Masuk sebagai admin terlebih dahulu.');
 const rows=[`Project ID: ${firebaseConfig.projectId}`,`Email login: ${user.email||'-'}`,`UID login: ${user.uid}`];
 let adminOkay=false,publicOkay=false,productOkay=false;
 try{const d=await getDocFromServer(doc(db,'admins',user.uid));adminOkay=d.exists()&&d.data()?.active===true;rows.push(d.exists()?`Dokumen admins/UID: ADA; active=${String(d.data().active)} (${typeof d.data().active})`:'Dokumen admins/UID: TIDAK ADA')}
 catch(e){rows.push('Baca dokumen admin: '+errMsg(e))}
 try{await getDocFromServer(doc(db,'public','catalog'));publicOkay=true;rows.push('Baca public/catalog: BERHASIL')}
 catch(e){rows.push('Baca public/catalog: '+errMsg(e))}
 try{await getDocFromServer(doc(db,'products','p1'));productOkay=true;rows.push('Baca products/p1: BERHASIL (ada atau belum ada dokumen)')}
 catch(e){rows.push('Baca products/p1: '+errMsg(e))}
 rows.push(`Status akses admin: ${adminOkay?'AKTIF':'BELUM TERBUKTI'}`);
 const canTest=adminOkay&&publicOkay&&productOkay;
 popup('Diagnostik Firebase',`<p class="small muted">Pemeriksaan dilakukan terhadap database online, bukan data cache browser.</p><div class="notice">${rows.map(x=>esc(x)).join('<br>')}</div>${adminHelp()}<div class="admin-toolbar"><button class="btn outline" data-act="copy-uid">📋 Salin UID</button>${canTest?'<button class="btn" data-act="test-write">🧪 Tes Izin Simpan</button>':''}</div><p class="small muted" style="margin-top:12px">Tes izin hanya menambahkan waktu pemeriksaan (diagnosticAt). Tidak mengganti logo, background, atau tema.</p>`);
}
async function testWrite(){if(!isAdmin||busy)return toast('Masuk sebagai admin terlebih dahulu.');busy=true;try{await patchCatalog({diagnosticAt:Date.now()},'Tes izin simpan');lastWriteError='';writeVerified=true;updateStatusDisplay();toast('Berhasil: akses tulis Firestore aktif.');popup('Izin tulis berhasil',`<p>✅ Pengaturan katalog berhasil ditulis ke Firestore.</p><p>Anda dapat mencoba ganti tema, simpan pengaturan, dan pulihkan 25 produk sekarang.</p><button class="btn full" data-act="close">Selesai</button>`)}catch(e){writeFail(e,'Tes izin simpan');popup('Tes tulis gagal',`<p>❌ ${esc(errMsg(e))}</p>${adminHelp()}<button class="btn outline full" data-act="diagnose">Periksa lagi</button>`)}finally{busy=false}
}
function oldProducts(){for(let key of ['fatin_art_premium_v1','fatin_art_state_v3'])try{let d=JSON.parse(localStorage.getItem(key));if(Array.isArray(d?.products)&&d.products.length)return d.products}catch(e){}return DEFAULT_PRODUCTS}
function cleanProduct(p,n){let img=String(p.img||'');if(!(img.startsWith('https://')||/^data:image\/(jpeg|webp|png);base64,/.test(img))||img.length>150000)img='';return {id:String(p.id||'p'+Date.now()+n).slice(0,100),name:String(p.name||'Produk').slice(0,130),category:String(p.category||'Lainnya').slice(0,60),price:Math.max(0,Math.min(1000000000,Number(p.price)||0)),desc:String(p.desc||'').slice(0,1500),img,updatedAt:serverTimestamp()}}
async function uploadProducts(arr,replace=false,sets=null){
 if(!isAdmin||busy)return;
 if(!arr.length||arr.length>180)return toast('Impor 1–180 produk per proses.');
 busy=true;let uploaded=0;
 try{
   // Aman terhadap kegagalan jaringan: unggah sebelum mengubah koleksi lama.
   // Produk dengan ID yang sama diperbarui; produk lain TIDAK dihapus.
   for(let i=0;i<arr.length;i+=12){const batch=writeBatch(db);const slice=arr.slice(i,i+12);slice.forEach((x,j)=>{let p=cleanProduct(x,i+j);batch.set(doc(db,'products',p.id),p)});await batch.commit();uploaded+=slice.length}
   if(sets)await patchCatalog({...sets,seeded:true},'Impor pengaturan');
   lastWriteError='';toast(uploaded+' produk berhasil diunggah. Data lain tetap aman.');
 }catch(e){writeFail(e,`Impor produk (${uploaded} dari ${arr.length} selesai)`)}finally{
   busy=false;
   try{const fresh=await getDocsFromServer(collection(db,'products'));products=fresh.docs.map(x=>({...x.data(),id:x.id}));sortOnlineProducts();pReady=true;render()}
   catch(e){writeFail(e,'Memuat ulang produk setelah impor')}
 }
}
function backup(){const obj={version:2,settings,products,created:new Date().toISOString()};let url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='FATIN_ART_BACKUP_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function importJSON(file){try{let d=JSON.parse(await file.text());if(!Array.isArray(d.products)||!d.settings||d.products.length>180)throw Error('Data tidak valid atau produk lebih dari 180.');if(!confirm('Impor akan menambah/memperbarui produk dengan ID sama, TANPA menghapus produk lain. Lanjutkan?'))return;let s={...settings};for(let k of ['business','subtitle','headline','description','wa','address'])if(typeof d.settings[k]==='string')s[k]=d.settings[k].slice(0,k==='description'?1200:250);if(/^#[0-9a-f]{6}$/i.test(d.settings.accent))s.accent=d.settings.accent;if(THEMES.some(t=>t.id===d.settings.template))s.template=d.settings.template;if(typeof d.settings.showPrices==='boolean')s.showPrices=d.settings.showPrices;if(typeof d.settings.logo==='string' && d.settings.logo.length<150000 && (/^https:\/\//.test(d.settings.logo)||/^data:image\/(jpeg|webp|png);base64,/.test(d.settings.logo)))s.logo=d.settings.logo;if(MODES.includes(d.settings.backgroundMode))s.backgroundMode=d.settings.backgroundMode;if(validHex(d.settings.backgroundColor))s.backgroundColor=d.settings.backgroundColor;if(Number.isFinite(Number(d.settings.backgroundOverlay)))s.backgroundOverlay=Math.max(0,Math.min(95,Number(d.settings.backgroundOverlay)));if(typeof d.settings.backgroundImage==='string'&&d.settings.backgroundImage.length<150000&&/^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/=]+$/.test(d.settings.backgroundImage))s.backgroundImage=d.settings.backgroundImage;if(typeof d.settings.welcomeImage==='string'&&d.settings.welcomeImage.length<150000&&/^data:image\/(jpeg|webp|png);base64,[A-Za-z0-9+/=]+$/.test(d.settings.welcomeImage))s.welcomeImage=d.settings.welcomeImage;await uploadProducts(d.products,false,s)}catch(e){toast(errMsg(e))}}

// QR engine derived from Kazuhiko Arase's QRCode for JavaScript (2009), MIT License.
// Local, offline encoder: No customer information is sent to a third-party QR service.
const FATIN_ART_QR = (() => {
 const modules = {
'QRMode': function(module, require) {
module.exports = {
    MODE_NUMBER :       1 << 0,
    MODE_ALPHA_NUM :    1 << 1,
    MODE_8BIT_BYTE :    1 << 2,
    MODE_KANJI :        1 << 3
};

},
'QRErrorCorrectLevel': function(module, require) {
module.exports = {
	L : 1,
	M : 0,
	Q : 3,
	H : 2
};


},
'QRMaskPattern': function(module, require) {
module.exports = {
	PATTERN000 : 0,
	PATTERN001 : 1,
	PATTERN010 : 2,
	PATTERN011 : 3,
	PATTERN100 : 4,
	PATTERN101 : 5,
	PATTERN110 : 6,
	PATTERN111 : 7
};

},
'QRMath': function(module, require) {
var QRMath = {

	glog : function(n) {
	
		if (n < 1) {
			throw new Error("glog(" + n + ")");
		}
		
		return QRMath.LOG_TABLE[n];
	},
	
	gexp : function(n) {
	
		while (n < 0) {
			n += 255;
		}
	
		while (n >= 256) {
			n -= 255;
		}
	
		return QRMath.EXP_TABLE[n];
	},
	
	EXP_TABLE : new Array(256),
	
	LOG_TABLE : new Array(256)

};
	
for (var i = 0; i < 8; i++) {
	QRMath.EXP_TABLE[i] = 1 << i;
}
for (var i = 8; i < 256; i++) {
	QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4]
		^ QRMath.EXP_TABLE[i - 5]
		^ QRMath.EXP_TABLE[i - 6]
		^ QRMath.EXP_TABLE[i - 8];
}
for (var i = 0; i < 255; i++) {
	QRMath.LOG_TABLE[QRMath.EXP_TABLE[i] ] = i;
}

module.exports = QRMath;

},
'QRPolynomial': function(module, require) {
var QRMath = require('./QRMath');

function QRPolynomial(num, shift) {
	if (num.length === undefined) {
		throw new Error(num.length + "/" + shift);
	}

	var offset = 0;

	while (offset < num.length && num[offset] === 0) {
		offset++;
	}

	this.num = new Array(num.length - offset + shift);
	for (var i = 0; i < num.length - offset; i++) {
		this.num[i] = num[i + offset];
	}
}

QRPolynomial.prototype = {

	get : function(index) {
		return this.num[index];
	},
	
	getLength : function() {
		return this.num.length;
	},
	
	multiply : function(e) {
	
		var num = new Array(this.getLength() + e.getLength() - 1);
	
		for (var i = 0; i < this.getLength(); i++) {
			for (var j = 0; j < e.getLength(); j++) {
				num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i) ) + QRMath.glog(e.get(j) ) );
			}
		}
	
		return new QRPolynomial(num, 0);
	},
	
	mod : function(e) {
	
		if (this.getLength() - e.getLength() < 0) {
			return this;
		}
	
		var ratio = QRMath.glog(this.get(0) ) - QRMath.glog(e.get(0) );
	
		var num = new Array(this.getLength() );
		
		for (var i = 0; i < this.getLength(); i++) {
			num[i] = this.get(i);
		}
		
		for (var x = 0; x < e.getLength(); x++) {
			num[x] ^= QRMath.gexp(QRMath.glog(e.get(x) ) + ratio);
		}
	
		// recursive call
		return new QRPolynomial(num, 0).mod(e);
	}
};

module.exports = QRPolynomial;

},
'QRRSBlock': function(module, require) {
var QRErrorCorrectLevel = require('./QRErrorCorrectLevel');

function QRRSBlock(totalCount, dataCount) {
	this.totalCount = totalCount;
	this.dataCount  = dataCount;
}

QRRSBlock.RS_BLOCK_TABLE = [

	// L
	// M
	// Q
	// H

	// 1
	[1, 26, 19],
	[1, 26, 16],
	[1, 26, 13],
	[1, 26, 9],
	
	// 2
	[1, 44, 34],
	[1, 44, 28],
	[1, 44, 22],
	[1, 44, 16],

	// 3
	[1, 70, 55],
	[1, 70, 44],
	[2, 35, 17],
	[2, 35, 13],

	// 4		
	[1, 100, 80],
	[2, 50, 32],
	[2, 50, 24],
	[4, 25, 9],
	
	// 5
	[1, 134, 108],
	[2, 67, 43],
	[2, 33, 15, 2, 34, 16],
	[2, 33, 11, 2, 34, 12],
	
	// 6
	[2, 86, 68],
	[4, 43, 27],
	[4, 43, 19],
	[4, 43, 15],
	
	// 7		
	[2, 98, 78],
	[4, 49, 31],
	[2, 32, 14, 4, 33, 15],
	[4, 39, 13, 1, 40, 14],
	
	// 8
	[2, 121, 97],
	[2, 60, 38, 2, 61, 39],
	[4, 40, 18, 2, 41, 19],
	[4, 40, 14, 2, 41, 15],
	
	// 9
	[2, 146, 116],
	[3, 58, 36, 2, 59, 37],
	[4, 36, 16, 4, 37, 17],
	[4, 36, 12, 4, 37, 13],
	
	// 10		
	[2, 86, 68, 2, 87, 69],
	[4, 69, 43, 1, 70, 44],
	[6, 43, 19, 2, 44, 20],
	[6, 43, 15, 2, 44, 16],

	// 11
	[4, 101, 81],
	[1, 80, 50, 4, 81, 51],
	[4, 50, 22, 4, 51, 23],
	[3, 36, 12, 8, 37, 13],

	// 12
	[2, 116, 92, 2, 117, 93],
	[6, 58, 36, 2, 59, 37],
	[4, 46, 20, 6, 47, 21],
	[7, 42, 14, 4, 43, 15],

	// 13
	[4, 133, 107],
	[8, 59, 37, 1, 60, 38],
	[8, 44, 20, 4, 45, 21],
	[12, 33, 11, 4, 34, 12],

	// 14
	[3, 145, 115, 1, 146, 116],
	[4, 64, 40, 5, 65, 41],
	[11, 36, 16, 5, 37, 17],
	[11, 36, 12, 5, 37, 13],

	// 15
	[5, 109, 87, 1, 110, 88],
	[5, 65, 41, 5, 66, 42],
	[5, 54, 24, 7, 55, 25],
	[11, 36, 12],

	// 16
	[5, 122, 98, 1, 123, 99],
	[7, 73, 45, 3, 74, 46],
	[15, 43, 19, 2, 44, 20],
	[3, 45, 15, 13, 46, 16],

	// 17
	[1, 135, 107, 5, 136, 108],
	[10, 74, 46, 1, 75, 47],
	[1, 50, 22, 15, 51, 23],
	[2, 42, 14, 17, 43, 15],

	// 18
	[5, 150, 120, 1, 151, 121],
	[9, 69, 43, 4, 70, 44],
	[17, 50, 22, 1, 51, 23],
	[2, 42, 14, 19, 43, 15],

	// 19
	[3, 141, 113, 4, 142, 114],
	[3, 70, 44, 11, 71, 45],
	[17, 47, 21, 4, 48, 22],
	[9, 39, 13, 16, 40, 14],

	// 20
	[3, 135, 107, 5, 136, 108],
	[3, 67, 41, 13, 68, 42],
	[15, 54, 24, 5, 55, 25],
	[15, 43, 15, 10, 44, 16],

	// 21
	[4, 144, 116, 4, 145, 117],
	[17, 68, 42],
	[17, 50, 22, 6, 51, 23],
	[19, 46, 16, 6, 47, 17],

	// 22
	[2, 139, 111, 7, 140, 112],
	[17, 74, 46],
	[7, 54, 24, 16, 55, 25],
	[34, 37, 13],

	// 23
	[4, 151, 121, 5, 152, 122],
	[4, 75, 47, 14, 76, 48],
	[11, 54, 24, 14, 55, 25],
	[16, 45, 15, 14, 46, 16],

	// 24
	[6, 147, 117, 4, 148, 118],
	[6, 73, 45, 14, 74, 46],
	[11, 54, 24, 16, 55, 25],
	[30, 46, 16, 2, 47, 17],

	// 25
	[8, 132, 106, 4, 133, 107],
	[8, 75, 47, 13, 76, 48],
	[7, 54, 24, 22, 55, 25],
	[22, 45, 15, 13, 46, 16],

	// 26
	[10, 142, 114, 2, 143, 115],
	[19, 74, 46, 4, 75, 47],
	[28, 50, 22, 6, 51, 23],
	[33, 46, 16, 4, 47, 17],

	// 27
	[8, 152, 122, 4, 153, 123],
	[22, 73, 45, 3, 74, 46],
	[8, 53, 23, 26, 54, 24],
	[12, 45, 15, 28, 46, 16],

	// 28
	[3, 147, 117, 10, 148, 118],
	[3, 73, 45, 23, 74, 46],
	[4, 54, 24, 31, 55, 25],
	[11, 45, 15, 31, 46, 16],

	// 29
	[7, 146, 116, 7, 147, 117],
	[21, 73, 45, 7, 74, 46],
	[1, 53, 23, 37, 54, 24],
	[19, 45, 15, 26, 46, 16],

	// 30
	[5, 145, 115, 10, 146, 116],
	[19, 75, 47, 10, 76, 48],
	[15, 54, 24, 25, 55, 25],
	[23, 45, 15, 25, 46, 16],

	// 31
	[13, 145, 115, 3, 146, 116],
	[2, 74, 46, 29, 75, 47],
	[42, 54, 24, 1, 55, 25],
	[23, 45, 15, 28, 46, 16],

	// 32
	[17, 145, 115],
	[10, 74, 46, 23, 75, 47],
	[10, 54, 24, 35, 55, 25],
	[19, 45, 15, 35, 46, 16],

	// 33
	[17, 145, 115, 1, 146, 116],
	[14, 74, 46, 21, 75, 47],
	[29, 54, 24, 19, 55, 25],
	[11, 45, 15, 46, 46, 16],

	// 34
	[13, 145, 115, 6, 146, 116],
	[14, 74, 46, 23, 75, 47],
	[44, 54, 24, 7, 55, 25],
	[59, 46, 16, 1, 47, 17],

	// 35
	[12, 151, 121, 7, 152, 122],
	[12, 75, 47, 26, 76, 48],
	[39, 54, 24, 14, 55, 25],
	[22, 45, 15, 41, 46, 16],

	// 36
	[6, 151, 121, 14, 152, 122],
	[6, 75, 47, 34, 76, 48],
	[46, 54, 24, 10, 55, 25],
	[2, 45, 15, 64, 46, 16],

	// 37
	[17, 152, 122, 4, 153, 123],
	[29, 74, 46, 14, 75, 47],
	[49, 54, 24, 10, 55, 25],
	[24, 45, 15, 46, 46, 16],

	// 38
	[4, 152, 122, 18, 153, 123],
	[13, 74, 46, 32, 75, 47],
	[48, 54, 24, 14, 55, 25],
	[42, 45, 15, 32, 46, 16],

	// 39
	[20, 147, 117, 4, 148, 118],
	[40, 75, 47, 7, 76, 48],
	[43, 54, 24, 22, 55, 25],
	[10, 45, 15, 67, 46, 16],

	// 40
	[19, 148, 118, 6, 149, 119],
	[18, 75, 47, 31, 76, 48],
	[34, 54, 24, 34, 55, 25],
	[20, 45, 15, 61, 46, 16]
];

QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
	
	var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
	
	if (rsBlock === undefined) {
		throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
	}

	var length = rsBlock.length / 3;
	
	var list = [];
	
	for (var i = 0; i < length; i++) {

		var count = rsBlock[i * 3 + 0];
		var totalCount = rsBlock[i * 3 + 1];
		var dataCount  = rsBlock[i * 3 + 2];

		for (var j = 0; j < count; j++) {
			list.push(new QRRSBlock(totalCount, dataCount) );	
		}
	}
	
	return list;
};

QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {

	switch(errorCorrectLevel) {
	case QRErrorCorrectLevel.L :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
	case QRErrorCorrectLevel.M :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
	case QRErrorCorrectLevel.Q :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
	case QRErrorCorrectLevel.H :
		return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
	default :
		return undefined;
	}
};

module.exports = QRRSBlock;

},
'QRBitBuffer': function(module, require) {
function QRBitBuffer() {
	this.buffer = [];
	this.length = 0;
}

QRBitBuffer.prototype = {

	get : function(index) {
		var bufIndex = Math.floor(index / 8);
		return ( (this.buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
	},
	
	put : function(num, length) {
		for (var i = 0; i < length; i++) {
			this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
		}
	},
	
	getLengthInBits : function() {
		return this.length;
	},
	
	putBit : function(bit) {
	
		var bufIndex = Math.floor(this.length / 8);
		if (this.buffer.length <= bufIndex) {
			this.buffer.push(0);
		}
	
		if (bit) {
			this.buffer[bufIndex] |= (0x80 >>> (this.length % 8) );
		}
	
		this.length++;
	}
};

module.exports = QRBitBuffer;

},
'QR8bitByte': function(module, require) {
var QRMode = require('./QRMode');

function QR8bitByte(data) {
	this.mode = QRMode.MODE_8BIT_BYTE;
	this.data = data;
}

QR8bitByte.prototype = {

	getLength : function() {
		return this.data.length;
	},
	
	write : function(buffer) {
		for (var i = 0; i < this.data.length; i++) {
			// not JIS ...
			buffer.put(this.data.charCodeAt(i), 8);
		}
	}
};

module.exports = QR8bitByte;

},
'QRUtil': function(module, require) {
var QRMode = require('./QRMode');
var QRPolynomial = require('./QRPolynomial');
var QRMath = require('./QRMath');
var QRMaskPattern = require('./QRMaskPattern');

var QRUtil = {

    PATTERN_POSITION_TABLE : [
        [],
        [6, 18],
        [6, 22],
        [6, 26],
        [6, 30],
        [6, 34],
        [6, 22, 38],
        [6, 24, 42],
        [6, 26, 46],
        [6, 28, 50],
        [6, 30, 54],        
        [6, 32, 58],
        [6, 34, 62],
        [6, 26, 46, 66],
        [6, 26, 48, 70],
        [6, 26, 50, 74],
        [6, 30, 54, 78],
        [6, 30, 56, 82],
        [6, 30, 58, 86],
        [6, 34, 62, 90],
        [6, 28, 50, 72, 94],
        [6, 26, 50, 74, 98],
        [6, 30, 54, 78, 102],
        [6, 28, 54, 80, 106],
        [6, 32, 58, 84, 110],
        [6, 30, 58, 86, 114],
        [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122],
        [6, 30, 54, 78, 102, 126],
        [6, 26, 52, 78, 104, 130],
        [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138],
        [6, 30, 58, 86, 114, 142],
        [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150],
        [6, 24, 50, 76, 102, 128, 154],
        [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162],
        [6, 26, 54, 82, 110, 138, 166],
        [6, 30, 58, 86, 114, 142, 170]
    ],

    G15 : (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G18 : (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
    G15_MASK : (1 << 14) | (1 << 12) | (1 << 10)    | (1 << 4) | (1 << 1),

    getBCHTypeInfo : function(data) {
        var d = data << 10;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
            d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) ) );    
        }
        return ( (data << 10) | d) ^ QRUtil.G15_MASK;
    },

    getBCHTypeNumber : function(data) {
        var d = data << 12;
        while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
            d ^= (QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) ) );    
        }
        return (data << 12) | d;
    },

    getBCHDigit : function(data) {

        var digit = 0;

        while (data !== 0) {
            digit++;
            data >>>= 1;
        }

        return digit;
    },

    getPatternPosition : function(typeNumber) {
        return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
    },

    getMask : function(maskPattern, i, j) {
        
        switch (maskPattern) {
            
        case QRMaskPattern.PATTERN000 : return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001 : return i % 2 === 0;
        case QRMaskPattern.PATTERN010 : return j % 3 === 0;
        case QRMaskPattern.PATTERN011 : return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100 : return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 === 0;
        case QRMaskPattern.PATTERN101 : return (i * j) % 2 + (i * j) % 3 === 0;
        case QRMaskPattern.PATTERN110 : return ( (i * j) % 2 + (i * j) % 3) % 2 === 0;
        case QRMaskPattern.PATTERN111 : return ( (i * j) % 3 + (i + j) % 2) % 2 === 0;

        default :
            throw new Error("bad maskPattern:" + maskPattern);
        }
    },

    getErrorCorrectPolynomial : function(errorCorrectLength) {

        var a = new QRPolynomial([1], 0);

        for (var i = 0; i < errorCorrectLength; i++) {
            a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0) );
        }

        return a;
    },

    getLengthInBits : function(mode, type) {

        if (1 <= type && type < 10) {

            // 1 - 9

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 10;
            case QRMode.MODE_ALPHA_NUM  : return 9;
            case QRMode.MODE_8BIT_BYTE  : return 8;
            case QRMode.MODE_KANJI      : return 8;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 27) {

            // 10 - 26

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 12;
            case QRMode.MODE_ALPHA_NUM  : return 11;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 10;
            default :
                throw new Error("mode:" + mode);
            }

        } else if (type < 41) {

            // 27 - 40

            switch(mode) {
            case QRMode.MODE_NUMBER     : return 14;
            case QRMode.MODE_ALPHA_NUM  : return 13;
            case QRMode.MODE_8BIT_BYTE  : return 16;
            case QRMode.MODE_KANJI      : return 12;
            default :
                throw new Error("mode:" + mode);
            }

        } else {
            throw new Error("type:" + type);
        }
    },

    getLostPoint : function(qrCode) {
        
        var moduleCount = qrCode.getModuleCount();
        var lostPoint = 0;
        var row = 0; 
        var col = 0;

        
        // LEVEL1
        
        for (row = 0; row < moduleCount; row++) {

            for (col = 0; col < moduleCount; col++) {

                var sameCount = 0;
                var dark = qrCode.isDark(row, col);

                for (var r = -1; r <= 1; r++) {

                    if (row + r < 0 || moduleCount <= row + r) {
                        continue;
                    }

                    for (var c = -1; c <= 1; c++) {

                        if (col + c < 0 || moduleCount <= col + c) {
                            continue;
                        }

                        if (r === 0 && c === 0) {
                            continue;
                        }

                        if (dark === qrCode.isDark(row + r, col + c) ) {
                            sameCount++;
                        }
                    }
                }

                if (sameCount > 5) {
                    lostPoint += (3 + sameCount - 5);
                }
            }
        }

        // LEVEL2

        for (row = 0; row < moduleCount - 1; row++) {
            for (col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                if (qrCode.isDark(row,     col    ) ) count++;
                if (qrCode.isDark(row + 1, col    ) ) count++;
                if (qrCode.isDark(row,     col + 1) ) count++;
                if (qrCode.isDark(row + 1, col + 1) ) count++;
                if (count === 0 || count === 4) {
                    lostPoint += 3;
                }
            }
        }

        // LEVEL3

        for (row = 0; row < moduleCount; row++) {
            for (col = 0; col < moduleCount - 6; col++) {
                if (qrCode.isDark(row, col) && 
                        !qrCode.isDark(row, col + 1) && 
                         qrCode.isDark(row, col + 2) && 
                         qrCode.isDark(row, col + 3) && 
                         qrCode.isDark(row, col + 4) && 
                        !qrCode.isDark(row, col + 5) && 
                         qrCode.isDark(row, col + 6) ) {
                    lostPoint += 40;
                }
            }
        }

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount - 6; row++) {
                if (qrCode.isDark(row, col) &&
                        !qrCode.isDark(row + 1, col) &&
                         qrCode.isDark(row + 2, col) &&
                         qrCode.isDark(row + 3, col) &&
                         qrCode.isDark(row + 4, col) &&
                        !qrCode.isDark(row + 5, col) &&
                         qrCode.isDark(row + 6, col) ) {
                    lostPoint += 40;
                }
            }
        }

        // LEVEL4
        
        var darkCount = 0;

        for (col = 0; col < moduleCount; col++) {
            for (row = 0; row < moduleCount; row++) {
                if (qrCode.isDark(row, col) ) {
                    darkCount++;
                }
            }
        }
        
        var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += ratio * 10;

        return lostPoint;       
    }

};

module.exports = QRUtil;

},
'index': function(module, require) {
//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of 
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
// Modified to work in node for this project (and some refactoring)
//---------------------------------------------------------------------

var QR8bitByte = require('./QR8bitByte');
var QRUtil = require('./QRUtil');
var QRPolynomial = require('./QRPolynomial');
var QRRSBlock = require('./QRRSBlock');
var QRBitBuffer = require('./QRBitBuffer');

function QRCode(typeNumber, errorCorrectLevel) {
	this.typeNumber = typeNumber;
	this.errorCorrectLevel = errorCorrectLevel;
	this.modules = null;
	this.moduleCount = 0;
	this.dataCache = null;
	this.dataList = [];
}

QRCode.prototype = {
	
	addData : function(data) {
		var newData = new QR8bitByte(data);
		this.dataList.push(newData);
		this.dataCache = null;
	},
	
	isDark : function(row, col) {
		if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
			throw new Error(row + "," + col);
		}
		return this.modules[row][col];
	},

	getModuleCount : function() {
		return this.moduleCount;
	},
	
	make : function() {
		// Calculate automatically typeNumber if provided is < 1
		if (this.typeNumber < 1 ){
			var typeNumber = 1;
			for (typeNumber = 1; typeNumber < 40; typeNumber++) {
				var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel);

				var buffer = new QRBitBuffer();
				var totalDataCount = 0;
				for (var i = 0; i < rsBlocks.length; i++) {
					totalDataCount += rsBlocks[i].dataCount;
				}

				for (var x = 0; x < this.dataList.length; x++) {
					var data = this.dataList[x];
					buffer.put(data.mode, 4);
					buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
					data.write(buffer);
				}
				if (buffer.getLengthInBits() <= totalDataCount * 8)
					break;
			}
			this.typeNumber = typeNumber;
		}
		this.makeImpl(false, this.getBestMaskPattern() );
	},
	
	makeImpl : function(test, maskPattern) {
		
		this.moduleCount = this.typeNumber * 4 + 17;
		this.modules = new Array(this.moduleCount);
		
		for (var row = 0; row < this.moduleCount; row++) {
			
			this.modules[row] = new Array(this.moduleCount);
			
			for (var col = 0; col < this.moduleCount; col++) {
				this.modules[row][col] = null;//(col + row) % 3;
			}
		}
	
		this.setupPositionProbePattern(0, 0);
		this.setupPositionProbePattern(this.moduleCount - 7, 0);
		this.setupPositionProbePattern(0, this.moduleCount - 7);
		this.setupPositionAdjustPattern();
		this.setupTimingPattern();
		this.setupTypeInfo(test, maskPattern);
		
		if (this.typeNumber >= 7) {
			this.setupTypeNumber(test);
		}
	
		if (this.dataCache === null) {
			this.dataCache = QRCode.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
		}
	
		this.mapData(this.dataCache, maskPattern);
	},

	setupPositionProbePattern : function(row, col)  {
		
		for (var r = -1; r <= 7; r++) {
			
			if (row + r <= -1 || this.moduleCount <= row + r) continue;
			
			for (var c = -1; c <= 7; c++) {
				
				if (col + c <= -1 || this.moduleCount <= col + c) continue;
				
				if ( (0 <= r && r <= 6 && (c === 0 || c === 6) ) || 
                     (0 <= c && c <= 6 && (r === 0 || r === 6) ) || 
                     (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
					this.modules[row + r][col + c] = true;
				} else {
					this.modules[row + r][col + c] = false;
				}
			}		
		}		
	},
	
	getBestMaskPattern : function() {
	
		var minLostPoint = 0;
		var pattern = 0;
	
		for (var i = 0; i < 8; i++) {
			
			this.makeImpl(true, i);
	
			var lostPoint = QRUtil.getLostPoint(this);
	
			if (i === 0 || minLostPoint >  lostPoint) {
				minLostPoint = lostPoint;
				pattern = i;
			}
		}
	
		return pattern;
	},
	
	createMovieClip : function(target_mc, instance_name, depth) {
	
		var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth);
		var cs = 1;
	
		this.make();

		for (var row = 0; row < this.modules.length; row++) {
			
			var y = row * cs;
			
			for (var col = 0; col < this.modules[row].length; col++) {
	
				var x = col * cs;
				var dark = this.modules[row][col];
			
				if (dark) {
					qr_mc.beginFill(0, 100);
					qr_mc.moveTo(x, y);
					qr_mc.lineTo(x + cs, y);
					qr_mc.lineTo(x + cs, y + cs);
					qr_mc.lineTo(x, y + cs);
					qr_mc.endFill();
				}
			}
		}
		
		return qr_mc;
	},

	setupTimingPattern : function() {
		
		for (var r = 8; r < this.moduleCount - 8; r++) {
			if (this.modules[r][6] !== null) {
				continue;
			}
			this.modules[r][6] = (r % 2 === 0);
		}
	
		for (var c = 8; c < this.moduleCount - 8; c++) {
			if (this.modules[6][c] !== null) {
				continue;
			}
			this.modules[6][c] = (c % 2 === 0);
		}
	},
	
	setupPositionAdjustPattern : function() {
	
		var pos = QRUtil.getPatternPosition(this.typeNumber);
		
		for (var i = 0; i < pos.length; i++) {
		
			for (var j = 0; j < pos.length; j++) {
			
				var row = pos[i];
				var col = pos[j];
				
				if (this.modules[row][col] !== null) {
					continue;
				}
				
				for (var r = -2; r <= 2; r++) {
				
					for (var c = -2; c <= 2; c++) {
					
						if (Math.abs(r) === 2 || 
                            Math.abs(c) === 2 ||
                            (r === 0 && c === 0) ) {
							this.modules[row + r][col + c] = true;
						} else {
							this.modules[row + r][col + c] = false;
						}
					}
				}
			}
		}
	},
	
	setupTypeNumber : function(test) {
	
		var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        var mod;
	
		for (var i = 0; i < 18; i++) {
			mod = (!test && ( (bits >> i) & 1) === 1);
			this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
		}
	
		for (var x = 0; x < 18; x++) {
			mod = (!test && ( (bits >> x) & 1) === 1);
			this.modules[x % 3 + this.moduleCount - 8 - 3][Math.floor(x / 3)] = mod;
		}
	},
	
	setupTypeInfo : function(test, maskPattern) {
	
		var data = (this.errorCorrectLevel << 3) | maskPattern;
		var bits = QRUtil.getBCHTypeInfo(data);
        var mod;
	
		// vertical		
		for (var v = 0; v < 15; v++) {
	
			mod = (!test && ( (bits >> v) & 1) === 1);
	
			if (v < 6) {
				this.modules[v][8] = mod;
			} else if (v < 8) {
				this.modules[v + 1][8] = mod;
			} else {
				this.modules[this.moduleCount - 15 + v][8] = mod;
			}
		}
	
		// horizontal
		for (var h = 0; h < 15; h++) {
	
			mod = (!test && ( (bits >> h) & 1) === 1);
			
			if (h < 8) {
				this.modules[8][this.moduleCount - h - 1] = mod;
			} else if (h < 9) {
				this.modules[8][15 - h - 1 + 1] = mod;
			} else {
				this.modules[8][15 - h - 1] = mod;
			}
		}
	
		// fixed module
		this.modules[this.moduleCount - 8][8] = (!test);
	
	},
	
	mapData : function(data, maskPattern) {
		
		var inc = -1;
		var row = this.moduleCount - 1;
		var bitIndex = 7;
		var byteIndex = 0;
		
		for (var col = this.moduleCount - 1; col > 0; col -= 2) {
	
			if (col === 6) col--;
	
			while (true) {
	
				for (var c = 0; c < 2; c++) {
					
					if (this.modules[row][col - c] === null) {
						
						var dark = false;
	
						if (byteIndex < data.length) {
							dark = ( ( (data[byteIndex] >>> bitIndex) & 1) === 1);
						}
	
						var mask = QRUtil.getMask(maskPattern, row, col - c);
	
						if (mask) {
							dark = !dark;
						}
						
						this.modules[row][col - c] = dark;
						bitIndex--;
	
						if (bitIndex === -1) {
							byteIndex++;
							bitIndex = 7;
						}
					}
				}
								
				row += inc;
	
				if (row < 0 || this.moduleCount <= row) {
					row -= inc;
					inc = -inc;
					break;
				}
			}
		}
		
	}

};

QRCode.PAD0 = 0xEC;
QRCode.PAD1 = 0x11;

QRCode.createData = function(typeNumber, errorCorrectLevel, dataList) {
	
	var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
	
	var buffer = new QRBitBuffer();
	
	for (var i = 0; i < dataList.length; i++) {
		var data = dataList[i];
		buffer.put(data.mode, 4);
		buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber) );
		data.write(buffer);
	}

	// calc num max data.
	var totalDataCount = 0;
	for (var x = 0; x < rsBlocks.length; x++) {
		totalDataCount += rsBlocks[x].dataCount;
	}

	if (buffer.getLengthInBits() > totalDataCount * 8) {
		throw new Error("code length overflow. (" + 
            buffer.getLengthInBits() + 
            ">" +  
            totalDataCount * 8 + 
            ")");
	}

	// end code
	if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
		buffer.put(0, 4);
	}

	// padding
	while (buffer.getLengthInBits() % 8 !== 0) {
		buffer.putBit(false);
	}

	// padding
	while (true) {
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD0, 8);
		
		if (buffer.getLengthInBits() >= totalDataCount * 8) {
			break;
		}
		buffer.put(QRCode.PAD1, 8);
	}

	return QRCode.createBytes(buffer, rsBlocks);
};

QRCode.createBytes = function(buffer, rsBlocks) {

	var offset = 0;
	
	var maxDcCount = 0;
	var maxEcCount = 0;
	
	var dcdata = new Array(rsBlocks.length);
	var ecdata = new Array(rsBlocks.length);
	
	for (var r = 0; r < rsBlocks.length; r++) {

		var dcCount = rsBlocks[r].dataCount;
		var ecCount = rsBlocks[r].totalCount - dcCount;

		maxDcCount = Math.max(maxDcCount, dcCount);
		maxEcCount = Math.max(maxEcCount, ecCount);
		
		dcdata[r] = new Array(dcCount);
		
		for (var i = 0; i < dcdata[r].length; i++) {
			dcdata[r][i] = 0xff & buffer.buffer[i + offset];
		}
		offset += dcCount;
		
		var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
		var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);

		var modPoly = rawPoly.mod(rsPoly);
		ecdata[r] = new Array(rsPoly.getLength() - 1);
		for (var x = 0; x < ecdata[r].length; x++) {
            var modIndex = x + modPoly.getLength() - ecdata[r].length;
			ecdata[r][x] = (modIndex >= 0)? modPoly.get(modIndex) : 0;
		}

	}
	
	var totalCodeCount = 0;
	for (var y = 0; y < rsBlocks.length; y++) {
		totalCodeCount += rsBlocks[y].totalCount;
	}

	var data = new Array(totalCodeCount);
	var index = 0;

	for (var z = 0; z < maxDcCount; z++) {
		for (var s = 0; s < rsBlocks.length; s++) {
			if (z < dcdata[s].length) {
				data[index++] = dcdata[s][z];
			}
		}
	}

	for (var xx = 0; xx < maxEcCount; xx++) {
		for (var t = 0; t < rsBlocks.length; t++) {
			if (xx < ecdata[t].length) {
				data[index++] = ecdata[t][xx];
			}
		}
	}

	return data;

};

module.exports = QRCode;

}
 };
 const cache={};
 function req(name){const k=String(name).replace(/^\.\//,'');if(cache[k])return cache[k].exports;if(!modules[k])throw Error('Modul QR tidak ditemukan: '+k);const module={exports:{}};cache[k]=module;modules[k](module,req);return module.exports}
 const QRCode=req('index');
 return function toPng(payload){
  const ascii=String(payload).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\x0a\x0d\x20-\x7e]/g,'?');
  const qr=new QRCode(-1,0);qr.addData(ascii);qr.make();
  const n=qr.getModuleCount(),scale=7,border=4;
  const canvas=document.createElement('canvas');canvas.width=(n+border*2)*scale;canvas.height=canvas.width;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas QR tidak tersedia');
  ctx.imageSmoothingEnabled=false;ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#132e42';for(let y=0;y<n;y++){for(let x=0;x<n;x++){if(qr.isDark(y,x))ctx.fillRect((x+border)*scale,(y+border)*scale,scale,scale)}}
  return canvas.toDataURL('image/png');
 }
})();

// FATIN ART v18 — nota berbasis produk online Firebase, dengan kompatibilitas nota lama.
let invoiceDraftRows=[],invoiceSaving=false;
const invNumber=(v,max=1e9)=>Math.max(0,Math.min(max,Math.round(Number(v)||0)));
const invoiceCatalog=()=>products.filter(p=>typeof p.name==='string'&&p.name.trim()).map(p=>({id:String(p.id),name:String(p.name),price:invNumber(p.price)}));
const invoiceProduct=id=>invoiceCatalog().find(p=>p.id===id);
const invoiceToday=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function invoiceRowForProduct(id){const p=invoiceProduct(id);return p?{productId:p.id,name:p.name,quantity:1,unitPrice:p.price,custom:false}:{productId:'',name:'',quantity:1,unitPrice:0,custom:true}}
function invoiceRowsFromOrder(order){
 if(Array.isArray(order.lineItems)&&order.lineItems.length){return order.lineItems.slice(0,40).map(r=>({productId:String(r.productId||''),name:String(r.name||''),quantity:Math.max(1,invNumber(r.quantity,9999)),unitPrice:invNumber(r.unitPrice),custom:!r.productId||!!r.custom}))}
 // Nota lama memakai items berupa teks dan total manual. Tetap dapat dibaca dan diedit.
 if(String(order.items||'').trim())return [{productId:'',name:String(order.items||'').slice(0,900),quantity:1,unitPrice:invNumber(order.total),custom:true}];
 return [invoiceRowForProduct(invoiceCatalog()[0]?.id||'')];
}
function invoiceTotals(rows=invoiceDraftRows,discount=0){const subtotal=rows.reduce((s,r)=>s+Math.max(1,invNumber(r.quantity,9999))*invNumber(r.unitPrice),0),disc=Math.min(subtotal,invNumber(discount)),total=Math.max(0,subtotal-disc);return {subtotal,discount:disc,total,units:rows.reduce((s,r)=>s+Math.max(1,invNumber(r.quantity,9999)),0)}}
function invoiceOptionMarkup(selected=''){let opts=invoiceCatalog().map(p=>`<option value="${esc(p.id)}" ${p.id===selected?'selected':''}>${esc(p.name)} — ${money(p.price)}</option>`).join('');return `<option value="">✎ Item khusus / harga manual</option>${opts}`}
function invoiceLineMarkup(r,i){const available=!!invoiceProduct(r.productId),custom=r.custom||!available,qty=Math.max(1,invNumber(r.quantity,9999)),price=invNumber(r.unitPrice);return `<div class="invoice-line" data-invoice-index="${i}"><div class="invoice-line-product"><span class="invoice-line-number">${i+1}</span><div class="invoice-line-main"><select class="field" data-invoice-product="${i}" aria-label="Produk baris ${i+1}"><option value="" ${custom?'selected':''}>✎ Item khusus / harga manual</option>${invoiceCatalog().map(p=>`<option value="${esc(p.id)}" ${!custom&&r.productId===p.id?'selected':''}>${esc(p.name)} — ${money(p.price)}</option>`).join('')}</select>${custom?`<input class="field invoice-custom-name" maxlength="900" aria-label="Nama barang khusus" data-invoice-custom-name="${i}" value="${esc(r.name)}" placeholder="Nama produk / deskripsi pesanan">`:''}</div></div><div class="invoice-line-qty"><button type="button" class="invoice-step" data-invoice-step="${i}" data-delta="-1" aria-label="Kurangi jumlah">−</button><input class="field" data-invoice-qty="${i}" type="number" min="1" max="9999" value="${qty}" aria-label="Jumlah produk baris ${i+1}"><button type="button" class="invoice-step" data-invoice-step="${i}" data-delta="1" aria-label="Tambah jumlah">+</button></div><div class="invoice-line-price">${custom?`<input class="field" type="number" data-invoice-price="${i}" min="0" max="1000000000" value="${price}" aria-label="Harga manual">`:`<span title="Harga dari katalog pada saat nota dibuat">${money(price)}</span>`}</div><strong class="invoice-line-subtotal">${money(price*qty)}</strong><button type="button" class="invoice-trash" data-invoice-remove="${i}" aria-label="Hapus baris ${i+1}">✕</button></div>`}
function drawInvoiceRows(){const box=$('invoiceLines');if(box)box.innerHTML=invoiceDraftRows.map(invoiceLineMarkup).join('');updateInvoiceTotals()}
function updateInvoiceTotals(){const f=$('orderForm');if(!f)return;const t=invoiceTotals(invoiceDraftRows,f.elements.discount?.value);const x=$('invoiceSubtotal');if(x)x.textContent=money(t.subtotal);const y=$('invoiceTotal');if(y)y.textContent=money(t.total);const z=$('invoiceUnits');if(z)z.textContent=t.units+' unit';const s=$('invoiceDiscountHint');if(s)s.textContent=invNumber(f.elements.discount?.value)>t.subtotal?'Diskon tidak boleh melebihi subtotal; akan dibatasi otomatis.':'';const spans=document.querySelectorAll('.invoice-line-subtotal');spans.forEach((el,i)=>{const r=invoiceDraftRows[i];if(r)el.textContent=money(Math.max(1,invNumber(r.quantity,9999))*invNumber(r.unitPrice))})}
function orderForm(id=''){
 if(!isAdmin)return;const o=orders.find(x=>x.id===id)||{name:'',phone:'',items:'',total:0,discount:0,status:'Menunggu konfirmasi',notes:''};invoiceDraftRows=invoiceRowsFromOrder(o);
 const date=/^\d{4}-\d{2}-\d{2}$/.test(o.issuedDate||'')?o.issuedDate:invoiceToday();
 const hasOnline=invoiceCatalog().length>0;
 const body=`<div class="invoice-form-brand"><div class="invoice-brand-left">${settings.logo?`<img src="${safeImg(settings.logo)}" alt="Logo FATIN ART">`:'<span class="invoice-brand-mark">✦</span>'}<div><strong>${esc(settings.business)}</strong><small>${esc(settings.subtitle||'Percetakan & Desain Grafis')}</small></div></div><span class="invoice-secure">🔒 Hanya admin · Firebase</span></div><form id="orderForm" data-id="${esc(id)}"><div class="invoice-form-grid"><div class="formrow"><label>Nama pemesan <b class="required-star">*</b><input class="field" name="name" maxlength="100" autocomplete="name" required value="${esc(o.name)}" placeholder="Nama pelanggan"></label></div><div class="formrow"><label>Nomor WhatsApp<input class="field" name="phone" maxlength="24" inputmode="tel" value="${esc(o.phone)}" placeholder="Contoh: 0822... "></label></div><div class="formrow"><label>Tanggal nota <b class="required-star">*</b><input class="field" name="issuedDate" type="date" required value="${esc(date)}"></label></div><div class="formrow"><label>Status pesanan<select class="field" name="status">${['Menunggu konfirmasi','Diproses','Selesai','Lunas','Dibatalkan'].map(x=>`<option ${o.status===x?'selected':''}>${x}</option>`).join('')}</select></label></div></div><div class="invoice-section"><div class="invoice-section-title"><div><h3>🛒 Produk dari Katalog</h3><p>Pilih produk; harga otomatis diambil dari katalog Firebase yang sedang online.</p></div><span class="invoice-sync ${hasOnline?'':'warning'}">${hasOnline?'✓ '+invoiceCatalog().length+' produk online':'⚠ Produk online belum terbaca'}</span></div><div class="invoice-table-head"><span>Produk / layanan</span><span>Jumlah</span><span>Harga satuan</span><span>Subtotal</span><span></span></div><div id="invoiceLines">${invoiceDraftRows.map(invoiceLineMarkup).join('')}</div><div class="invoice-add-row"><button type="button" class="btn outline sm" data-act="invoice-add-line">＋ Tambah Barang</button><span class="small muted">${hasOnline?'Harga mengikuti data produk saat dipilih.':'Periksa koneksi katalog; item khusus tetap bisa dipakai.'} Nota lama menggunakan harga saat transaksi.</span></div><div class="invoice-bottom-grid"><div class="invoice-note-box"><b>Catatan Pesanan</b><textarea class="field" name="notes" maxlength="500" rows="4" placeholder="Jenis bahan, ukuran, finishing, tanggal pengambilan, dan lainnya">${esc(o.notes||'')}</textarea><small>Item khusus dapat diisi harga manual. Harga katalog baru otomatis terisi ketika barang dipilih.</small></div><div class="invoice-summary"><div><span>Jumlah barang</span><b id="invoiceUnits">0 unit</b></div><div><span>Subtotal</span><b id="invoiceSubtotal">Rp 0</b></div><div><label for="invoiceDiscount">Diskon (Rp)</label><input class="field" name="discount" id="invoiceDiscount" type="number" min="0" value="${invNumber(o.discount)}"></div><small id="invoiceDiscountHint" class="invoice-discount-hint"></small><div class="invoice-grandtotal"><strong>TOTAL BAYAR</strong><strong id="invoiceTotal">Rp 0</strong></div></div></div></div><div class="invoice-feedback" id="invoiceSaveStatus" role="status" aria-live="polite"></div><div class="invoice-form-actions"><button type="button" class="btn outline" data-act="invoice-preview">🖨 Cetak Draft</button><button type="submit" class="btn invoice-save-btn">💾 ${id?'Simpan Perubahan Nota':'Simpan Nota ke Firebase'}</button></div></form>`;
 popup(id?'Edit Nota':'Buat Nota Baru',body);$('modal-root')?.querySelector('.modal')?.classList.add('invoice-editor-modal');updateInvoiceTotals();
}
function invoiceCollectForm(f){
 const name=String(f.elements.name.value||'').trim();if(!name)throw Error('Nama pemesan harus diisi.');
 const lines=invoiceDraftRows.map(r=>({productId:r.custom?'':String(r.productId||''),name:String(r.name||'').trim(),quantity:Math.max(1,invNumber(r.quantity,9999)),unitPrice:invNumber(r.unitPrice),custom:!!r.custom}));
 if(!lines.length||lines.some(r=>!r.name))throw Error('Masukkan minimal satu produk dengan nama yang jelas.');
 if(lines.length>40)throw Error('Maksimal 40 jenis barang untuk satu nota.');
 const rawDiscount=invNumber(f.elements.discount.value),t=invoiceTotals(lines,rawDiscount);
 if(rawDiscount>t.subtotal)throw Error('Diskon tidak boleh lebih besar dari subtotal.');
 const issuedDate=String(f.elements.issuedDate.value||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(issuedDate))throw Error('Tanggal nota belum benar.');
 return {name,phone:String(f.elements.phone.value||'').trim(),lineItems:lines,items:lines.map(r=>`${r.quantity} x ${r.name} @ ${money(r.unitPrice)} = ${money(r.quantity*r.unitPrice)}`).join('\n').slice(0,1000),subtotal:t.subtotal,discount:t.discount,total:t.total,status:String(f.elements.status.value),notes:String(f.elements.notes.value||'').trim(),issuedDate};
}
function invoiceFeedback(message,failed=false){const el=$('invoiceSaveStatus');if(el){el.textContent=message;el.className='invoice-feedback '+(failed?'error':'success')}}
async function saveOrder(f){if(!isAdmin||invoiceSaving)return;let payload;
 try{payload=invoiceCollectForm(f)}catch(e){invoiceFeedback(e.message,true);return}
 const id=f.dataset.id||'FA-'+Date.now().toString(36).toUpperCase(),prev=orders.find(x=>x.id===id);invoiceSaving=true;
 const btn=f.querySelector('button[type="submit"]');if(btn)btn.disabled=true;invoiceFeedback('Menyimpan nota dan memverifikasi data di Firebase...');
 try{const docRef=doc(db,'orders',id);await setDoc(docRef,{...payload,date:prev?.date||new Date().toLocaleString('id-ID'),currency:'IDR'},{merge:true});
 const checked=await getDocFromServer(docRef);if(!checked.exists()||checked.data().total!==payload.total||checked.data().name!==payload.name||!Array.isArray(checked.data().lineItems)||checked.data().lineItems.length!==payload.lineItems.length)throw Error('Data nota belum cocok ketika diverifikasi dari server. Periksa koneksi lalu cek daftar nota sebelum menyimpan ulang.');
 const saved={id,...checked.data()};orders=orders.filter(x=>x.id!==id).concat([saved]);closePopup();render();toast('✅ Nota tersimpan dan terverifikasi di Firebase.');invoice(id);
 }catch(e){invoiceFeedback('❌ '+errMsg(e),true);console.error('[FATIN ART NOTA]',e)}finally{invoiceSaving=false;if(btn?.isConnected)btn.disabled=false}
}

// V19 - QR ringkasan nota. QR ini BUKAN tanda tangan elektronik tersertifikasi.
function receiptQrPayload(o,id,total,date){
 return [
  'FATIN ART ADVERTISING',
  'QR DATA NOTA (NON-TERSERTIFIKASI)',
  'NOMOR: '+String(id).slice(0,90),
  'TANGGAL: '+String(date).slice(0,40),
  'TOTAL: IDR '+String(invNumber(total)),
  'STATUS: '+String(o.status||'Belum diproses').slice(0,60)
 ].join('\n');
}
function receiptQrMarkup(o,id,total,date,preview){
 if(preview)return '<div class="receipt-qr-area receipt-qr-draft"><div class="receipt-qr-placeholder">DRAF</div><div><strong>QR Nota Digital</strong><small>QR tampil setelah nota disimpan ke Firebase.</small></div></div>';
 let src='';try{src=FATIN_ART_QR(receiptQrPayload(o,id,total,date))}catch(err){console.error('[FATIN ART QR]',err)}
 if(!src)return '<div class="receipt-qr-area"><div><strong>QR tidak dapat dibuat</strong><small>Nomor nota tetap tercetak. Periksa browser lalu coba cetak lagi.</small></div></div>';
 return `<div class="receipt-qr-area"><img class="receipt-qr-image" src="${src}" alt="QR data nota ${esc(id)}"><div><span class="receipt-qr-label">QR TTE INTERNAL</span><strong>Data Nota Digital</strong><small>Scan untuk membaca nomor nota, tanggal, total, dan status; cocokkan dengan isi nota.</small><span class="receipt-qr-code">${esc(id)}</span></div></div>`;
}

function invoicePrintableMarkup(o,id,preview=false){
 const lines=invoiceRowsFromOrder(o);const t=invoiceTotals(lines,o.discount||0);const date=o.issuedDate||o.date||new Date().toLocaleDateString('id-ID');const total=Number.isFinite(Number(o.total))?Number(o.total):t.total;
 return `<section class="invoice-printable" aria-label="Nota FATIN ART"><div class="receipt-brand">${settings.logo?`<img class="receipt-logo" src="${safeImg(settings.logo)}" alt="Logo FATIN ART">`:'<div class="receipt-logo-fallback">✦</div>'}<div><h2>${esc(settings.business)}</h2><p>${esc(settings.subtitle||'Percetakan & Desain Grafis')}</p><p>${esc(settings.address)} · WA ${esc(settings.wa)}</p></div></div><div class="receipt-header"><div><span class="receipt-kicker">NOTA PEMESANAN / INVOICE</span><h3>${esc(id)}</h3></div>${preview?'<span class="receipt-draft">DRAF · BELUM DISIMPAN</span>':`<span class="receipt-status">${esc(o.status||'Menunggu konfirmasi')}</span>`}</div><div class="receipt-meta"><div><small>Pelanggan</small><b>${esc(o.name||'-')}</b><span>${esc(o.phone||'-')}</span></div><div><small>Tanggal Nota</small><b>${esc(date)}</b><span>Status: ${esc(o.status||'-')}</span></div></div><table class="receipt-items"><thead><tr><th>Produk / layanan</th><th class="num">Qty</th><th class="num">Harga</th><th class="num">Subtotal</th></tr></thead><tbody>${lines.map(r=>`<tr><td>${esc(r.name||'-')}</td><td class="num">${invNumber(r.quantity)||1}</td><td class="num">${money(r.unitPrice)}</td><td class="num">${money(invNumber(r.quantity||1)*invNumber(r.unitPrice))}</td></tr>`).join('')}</tbody></table><div class="receipt-total-panel"><div><span>Subtotal</span><b>${money(t.subtotal)}</b></div><div><span>Diskon</span><b>− ${money(t.discount)}</b></div><div class="receipt-total"><span>TOTAL BAYAR</span><b>${money(total)}</b></div></div>${o.notes?`<div class="receipt-notes"><b>Catatan:</b><p>${esc(o.notes)}</p></div>`:''}<div class="receipt-signature"><div class="receipt-signature-admin"><span class="receipt-qr-label">DITERBITKAN OLEH</span><b>${esc(settings.business)}</b><p>Nota dibuat melalui sistem administrasi toko. QR di samping adalah ringkasan data nota.</p><div class="receipt-signature-rule">Admin / Penanggung Jawab</div></div>${receiptQrMarkup(o,id,total,date,preview)}</div><p class="receipt-qr-disclaimer"><b>Catatan:</b> QR ini untuk pemeriksaan data nota secara internal. Bukan tanda tangan elektronik tersertifikasi dan tidak menyediakan verifikasi ke server publik.</p><div class="receipt-thanks">Terima kasih atas kepercayaan Anda kepada <b>${esc(settings.business)}</b>.<small>Murah • Berkualitas • Satset</small></div></section>`;
}
async function printInvoiceData(o,id,preview=false){const root=$('print-root');if(!root)return;root.innerHTML=invoicePrintableMarkup(o,id,preview);const imgs=Array.from(root.querySelectorAll('img'));try{await Promise.race([Promise.all(imgs.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve())),new Promise(resolve=>setTimeout(resolve,900))])}catch(_){/* Lanjut ke dialog cetak meskipun ada gambar lain yang gagal */}window.print()}
function invoice(id){let o=orders.find(x=>x.id===id);if(!o)return;popup('Lihat & Cetak Nota',`${invoicePrintableMarkup(o,id)}<div class="invoice-print-actions"><button class="btn outline" data-edit-order="${esc(id)}">✎ Edit Nota</button><button class="btn" data-print="${esc(id)}">🖨 Cetak Nota</button></div>`);$('modal-root')?.querySelector('.modal')?.classList.add('invoice-view-modal')}
function printInvoice(id){const o=orders.find(x=>x.id===id);if(!o)return;printInvoiceData(o,id)}
function printInvoiceDraft(){const f=$('orderForm');if(!f)return;try{const payload=invoiceCollectForm(f);printInvoiceData(payload,f.dataset.id||'DRAF',true)}catch(e){invoiceFeedback(e.message,true)}}
// FATIN ART v12 — galeri editorial; hanya admin boleh menambah, mengedit, dan menghapus.
let customerGallery=[], galleryError='';
const galleryImg=(v)=>typeof v==='string'&&/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(v)?esc(v):safeImg(v||'');
function galleryPublishedDate(v){
 if(typeof v!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v))return '';
 const d=new Date(v+'T12:00:00');
 return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(d);
}
function galleryNewsCard(g,admin=false){
 const title=esc(g.title||'Hasil Pesanan Customer');
 const date=galleryPublishedDate(g.completedAt);
 const orderLabel=String(g.orderLabel||'').trim();
 const customerLabel=String(g.customerLabel||'').trim();
 const info=[orderLabel?`<span>Pesanan: ${esc(orderLabel)}</span>`:'',customerLabel?`<span>Customer: ${esc(customerLabel)}</span>`:'',date?`<time datetime="${esc(g.completedAt)}">${esc(date)}</time>`:''].filter(Boolean).join('<span class="gallery-meta-dot" aria-hidden="true">·</span>');
 return `<article class="customer-photo-card gallery-news-card">
   <div class="customer-photo-frame"><img src="${galleryImg(g.image)}" alt="${title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.style.display='none';this.parentNode.classList.add('gallery-image-missing');this.parentNode.setAttribute('aria-label','Gambar belum tersedia');"></div>
   <div class="customer-photo-copy"><span class="gallery-news-category">${esc(g.category||'Hasil Cetakan')}</span><h3>${title}</h3>${info?`<div class="gallery-news-meta">${info}</div>`:''}${g.caption?`<p>${esc(g.caption)}</p>`:''}
   ${admin?`<div class="admin-toolbar"><button class="btn sm" data-gallery-edit="${esc(g.id)}">✎ Edit Artikel</button><button class="btn red sm" data-gallery-delete="${esc(g.id)}">Hapus</button></div>`:'<button class="btn sm gallery-news-cta" data-act="manual-order">Pesan Model Serupa ↗</button>'}</div>
 </article>`;
}

// Galeri customer bergerak otomatis seperti carousel berita, berhenti saat pelanggan membaca atau menyentuhnya.
let galleryScrollTimer=null, galleryScrollPaused=false;
function galleryStep(direction){
 const rail=$('galleryPhotoRail');if(!rail)return;
 const first=rail.querySelector('.gallery-news-card');if(!first)return;
 const gap=parseFloat(getComputedStyle(rail).columnGap||getComputedStyle(rail).gap)||14;
 rail.scrollBy({left:direction*(first.getBoundingClientRect().width+gap),behavior:'smooth'});
}
function setupGalleryAutoScroll(){
 if(galleryScrollTimer){clearInterval(galleryScrollTimer);galleryScrollTimer=null;}
 const rail=$('galleryPhotoRail');galleryScrollPaused=false;
 if(!rail||view!=='catalog'||!enteredStore||rail.children.length<2)return;
 rail.addEventListener('mouseenter',()=>galleryScrollPaused=true);
 rail.addEventListener('mouseleave',()=>galleryScrollPaused=false);
 rail.addEventListener('focusin',()=>galleryScrollPaused=true);
 rail.addEventListener('focusout',()=>galleryScrollPaused=false);
 rail.addEventListener('pointerdown',()=>galleryScrollPaused=true);
 rail.addEventListener('pointerup',()=>{galleryScrollPaused=false});
 rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();galleryStep(e.key==='ArrowRight'?1:-1)}});
 if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
 galleryScrollTimer=setInterval(()=>{
  if(galleryScrollPaused||document.hidden||!rail.isConnected)return;
  const max=rail.scrollWidth-rail.clientWidth;
  if(max<=2)return;
  if(rail.scrollLeft>=max-4)rail.scrollTo({left:0,behavior:'smooth'});
  else galleryStep(1);
 },3900);
}

function galleryPublicMarkup(){
 return `<section class="customer-gallery-section gallery-editorial" id="galeri">
 <div class="gallery-heading"><div><span class="section-kicker">PORTOFOLIO • GALERI HASIL PESANAN</span><h2>Hasil Cetakan dan Pemesanan</h2><p>Foto hasil cetakan dan pesanan customer FATIN ART. Galeri bergulir otomatis, dan Anda juga bisa menggeser foto secara manual.</p></div><div class="gallery-reel-controls" aria-label="Kontrol galeri"><button type="button" data-gallery-prev aria-label="Foto sebelumnya">‹</button><button type="button" data-gallery-next aria-label="Foto selanjutnya">›</button></div></div>
 ${galleryError?`<p class="photo-status error">Galeri belum bisa dibaca dari Firebase: ${esc(galleryError)}. Periksa Rules koleksi customer_gallery.</p>`:''}
 ${customerGallery.length?`<div class="customer-gallery-grid gallery-news-grid gallery-photo-reel" id="galleryPhotoRail" tabindex="0" aria-label="Galeri foto hasil cetakan, dapat digeser ke samping">${customerGallery.map(g=>galleryNewsCard(g)).join('')}</div>`:'<div class="gallery-empty"><div class="gallery-empty-icon">📰</div><h3>Dokumentasi hasil cetakan segera hadir</h3><p>Admin akan mengunggah foto pesanan yang sudah selesai dan memperoleh izin pemilik.</p></div>'}
 </section>`;
}
function galleryAdminPanel(){
 return `<div class="panel-top"><span class="section-kicker">MANAJEMEN PORTOFOLIO</span><h3>Hasil Cetakan dan Pemesanan</h3><p class="small muted">Hanya admin yang dapat mengunggah, memperbarui, dan menghapus foto pesanan. Foto potret maupun landscape akan tampil utuh sesuai rasio aslinya di katalog publik.</p></div>
 <div class="admin-toolbar gallery-toolbar"><button class="btn" type="button" data-act="gallery-add">＋ Upload Foto Hasil Pesanan</button><button class="btn outline" type="button" data-act="catalog">👁 Lihat Galeri Publik</button></div>
 <div class="gallery-admin-stat"><span><b>${customerGallery.length}</b> foto yang dipublikasikan</span><span>🔒 Unggah hanya oleh admin Firebase</span></div>
 ${customerGallery.length?`<div class="customer-gallery-grid gallery-admin-grid gallery-news-grid compact-news-grid">${customerGallery.map(g=>galleryNewsCard(g,true)).join('')}</div>`:'<div class="gallery-empty"><div class="gallery-empty-icon">📷</div><h3>Belum ada foto di galeri</h3><p>Gunakan tombol Upload Foto Hasil Pesanan untuk mengunggah karya yang sudah mendapat izin customer.</p></div>'}`;
}
function galleryAdminEditor(id=''){
 if(!isAdmin)return;
 const item=customerGallery.find(g=>g.id===id)||{title:'',caption:'',category:'Hasil Cetakan',orderLabel:'',customerLabel:'',completedAt:'',image:''};
 popup(id?'Edit Dokumentasi Pesanan':'Tambah Foto Hasil Cetakan',`<form id="galleryAdminForm" data-id="${esc(id)}">
 <div class="formrow"><label>Judul berita / hasil cetakan<input name="title" class="field" required maxlength="100" value="${esc(item.title)}" placeholder="Contoh: Cetak Kemasan Kopi Pendowo"></label></div>
 <div class="formgrid"><div class="formrow"><label>Kategori cetakan<input name="category" class="field" required maxlength="60" value="${esc(item.category||'Hasil Cetakan')}" placeholder="Contoh: Stiker Kemasan"></label></div>
 <div class="formrow"><label>Tanggal pesanan selesai (opsional)<input name="completedAt" class="field" type="date" value="${esc(item.completedAt||'')}"></label></div></div>
 <div class="formgrid"><div class="formrow"><label>Referensi pesanan (opsional)<input name="orderLabel" class="field" maxlength="80" value="${esc(item.orderLabel||'')}" placeholder="Contoh: ORD-025 / Pesanan Undangan"></label></div>
 <div class="formrow"><label>Nama/inisial customer untuk ditampilkan (opsional)<input name="customerLabel" class="field" maxlength="70" value="${esc(item.customerLabel||'')}" placeholder="Contoh: Customer Songgon"></label></div></div>
 <div class="formrow"><label>Keterangan hasil cetak<textarea name="caption" class="field" maxlength="170" rows="3" placeholder="Contoh: Cetak full color, bahan pilihan, selesai sesuai permintaan">${esc(item.caption||'')}</textarea></label></div>
 <div class="formrow"><label>Foto hasil pesanan (PNG/JPG/WEBP, maksimal 12 MB)<input name="image" class="field" type="file" accept="image/png,image/jpeg,image/webp" ${id?'':'required'}></label>
 ${item.image?`<img class="preview gallery-editor-preview" src="${galleryImg(item.image)}" alt="Pratinjau foto hasil cetak">`:''}<p class="small muted">Foto potret maupun landscape tidak dipotong pada galeri publik. File dioptimalkan untuk website, bukan hasil cetak HD.</p></div>
 <label class="gallery-consent"><input name="consent" type="checkbox" required> Saya telah mendapat izin pemilik foto dan memastikan tidak ada informasi pribadi yang tidak boleh dipublikasikan.</label>
 <div class="photo-status" id="gallery-admin-status" role="status">Foto akan muncul setelah berhasil disimpan dan diverifikasi di Firebase.</div>
 <button type="submit" class="btn full">💾 Simpan Dokumentasi Online</button></form>`);
}
async function galleryAdminSave(f){
 if(!isAdmin)return;const d=new FormData(f),id=f.dataset.id,btn=f.querySelector('[type=submit]'),status=$('gallery-admin-status');btn.disabled=true;
 try{
  const existing=customerGallery.find(x=>x.id===id);let image=existing?.image||'';
  const file=d.get('image');if(file?.size)image=await shrinkMedia(file,135000,1100);
  if(!image)throw Error('Foto wajib dipilih.');
  const ref=id?doc(db,'customer_gallery',id):doc(collection(db,'customer_gallery'));
  const payload={title:String(d.get('title')||'').trim().slice(0,100),category:String(d.get('category')||'Hasil Cetakan').trim().slice(0,60),caption:String(d.get('caption')||'').trim().slice(0,170),orderLabel:String(d.get('orderLabel')||'').trim().slice(0,80),customerLabel:String(d.get('customerLabel')||'').trim().slice(0,70),completedAt:String(d.get('completedAt')||'').trim().slice(0,10),image,updatedAt:serverTimestamp()};
  await setDoc(ref,payload,{merge:true});const check=await getDocFromServer(ref);
  if(!check.exists()||check.data().image!==image)throw Error('Verifikasi foto dari server belum berhasil.');
  closePopup();toast('Foto galeri tersimpan online.');
 }catch(e){status.className='photo-status error';status.textContent='Gagal menyimpan: '+errMsg(e);btn.disabled=false}
}
// Pelanggan tidak dapat mengunggah foto; hanya admin melalui galleryAdminSave.
function startGalleryAdminWatch(){}
function stopGalleryAdminWatch(){}
onSnapshot(collection(db,'customer_gallery'),s=>{galleryError='';customerGallery=s.docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>((b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0)));render(true)},e=>{galleryError=errMsg(e);render(true)});

onSnapshot(collection(db,'banners'),snap=>{bannerError='';bannersReady=true;bannerOverrides={};snap.docs.forEach(d=>{if(/^slide-(?:10|[1-9])$/.test(d.id))bannerOverrides[d.id]=d.data()});render(true)},e=>{bannerError=errMsg(e);bannersReady=true;render(true)});
onSnapshot(collection(db,'products'),snap=>{pReady=true;productError='';updateConnectionError();products=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));cart=cart.filter(c=>catalogProducts().some(p=>p.id===c.id));render(true)},e=>{pReady=true;productError=errMsg(e);updateConnectionError();render(true)});
onSnapshot(doc(db,'public','catalog'),snap=>{sReady=true;settingsError='';updateConnectionError();settings={...def,...(snap.exists()?snap.data():{})};render(true)},e=>{sReady=true;settingsError=errMsg(e);updateConnectionError();render(true)});
onAuthStateChanged(auth,async u=>{authReady=true;user=u;if(!u){stopGalleryAdminWatch();isAdmin=false;orders=[];unsubOrders?.();unsubOrders=null;if(view==='admin')view='catalog';if(wantsAdmin)adminGate();render();return}if(wantsAdmin)await adminGate();else render()});
document.addEventListener('click',async e=>{
 if(e.target.classList.contains('overlay'))return closePopup();
 let el=e.target.closest('[data-act],[data-cat],[data-tab],[data-add],[data-qty],[data-edit],[data-delete],[data-slide-prev],[data-slide-next],[data-slide-dot],[data-slide-play],[data-banner-edit],[data-banner-reset],[data-gallery-edit],[data-gallery-delete],[data-gallery-prev],[data-gallery-next],button[data-template],[data-color],[data-status],[data-invoice],[data-print],[data-invoice-step],[data-invoice-remove],[data-edit-order],[data-delete-order]');
 if(!el||el===document.body)return;
 if(el.tagName==='A')e.preventDefault();
 if(el.hasAttribute('data-gallery-prev')){galleryStep(-1);return}
 if(el.hasAttribute('data-gallery-next')){galleryStep(1);return}
 if(el.hasAttribute('data-slide-prev')){updateSlide(slideIndex-1);return}
 if(el.hasAttribute('data-slide-next')){updateSlide(slideIndex+1);return}
 if(el.hasAttribute('data-slide-dot')){updateSlide(Number(el.dataset.slideDot));return}
 if(el.hasAttribute('data-slide-play')){slidePlaying=!slidePlaying;el.textContent=slidePlaying?'Ⅱ':'▶';el.setAttribute('aria-label',slidePlaying?'Jeda banner':'Putar banner');setupSlider();return}
 if(el.hasAttribute('data-banner-edit')){if(isAdmin)bannerEdit(Number(el.dataset.bannerEdit));return}
 if(el.hasAttribute('data-banner-reset')){if(isAdmin)await resetBanner(Number(el.dataset.bannerReset));return}
 if(el.hasAttribute('data-add')){checkout(el.dataset.add);return}
 if(el.hasAttribute('data-qty')){let c=cart.find(c=>c.id===el.dataset.qty);if(c){c.qty+=Number(el.dataset.delta);if(c.qty<=0)cart=cart.filter(x=>x!==c)}render();openCart();return}
 if(el.hasAttribute('data-cat')){category=el.dataset.cat;render();return}
 if(el.hasAttribute('data-tab')){if(!isAdmin)return;editorIsDirty=false;tab=el.dataset.tab;render();return}
 if(el.hasAttribute('data-invoice'))return invoice(el.dataset.invoice);
 if(el.hasAttribute('data-print'))return printInvoice(el.dataset.print);
 if(el.hasAttribute('data-invoice-step')){if(!isAdmin)return;const i=Number(el.dataset.invoiceStep),r=invoiceDraftRows[i];if(!r)return;r.quantity=Math.max(1,Math.min(9999,invNumber(r.quantity,9999)+Number(el.dataset.delta||0)));drawInvoiceRows();return}
 if(el.hasAttribute('data-invoice-remove')){if(!isAdmin)return;invoiceDraftRows.splice(Number(el.dataset.invoiceRemove),1);drawInvoiceRows();return}
 let act=el.dataset.act;
 if(act==='enter-store')return enterStore();
 if(act==='welcome')return returnToWelcome();
 if(act==='close')return closePopup();
 if(act==='cart')return openCart();
 if(act==='manual-order')return checkout('');
 if(act==='checkout')return checkout();
 if(act==='catalog'){view='catalog';closePopup();render();return}
 if(act==='go-products'||act==='go-about'){view='catalog';closePopup();render();document.getElementById(act==='go-products'?'produk':'tentang')?.scrollIntoView({behavior:'smooth'});return}
 if(act==='share')return share();
 if(act==='copy-link')return copyCustomerURL();
 if(act==='native-share')return nativeShare();
 if(act==='check')return adminGate();
 if(act==='logout')return logout();
 if(!isAdmin)return;
 if(act==='gallery-add')return galleryAdminEditor();
 if(el.hasAttribute('data-gallery-edit'))return galleryAdminEditor(el.dataset.galleryEdit);
 if(el.hasAttribute('data-gallery-delete')){if(!confirm('Hapus foto ini dari galeri publik?'))return;try{await deleteDoc(doc(db,'customer_gallery',el.dataset.galleryDelete));toast('Foto dihapus dari galeri.')}catch(e){toast(errMsg(e))}return}
 if(el.hasAttribute('data-edit'))return productForm(el.dataset.edit);
 if(el.hasAttribute('data-delete')){if(confirm('Hapus produk ini dari semua perangkat?'))try{await deleteDoc(doc(db,'products',el.dataset.delete));toast('Produk dihapus.')}catch(e){toast(errMsg(e))}return}
 if(el.hasAttribute('data-template'))return design({template:el.dataset.template});
 if(el.hasAttribute('data-color'))return design({accent:el.dataset.color});
 if(el.hasAttribute('data-edit-order'))return orderForm(el.dataset.editOrder);
 if(el.hasAttribute('data-delete-order')){if(confirm('Hapus nota ini?'))try{await deleteDoc(doc(db,'orders',el.dataset.deleteOrder));toast('Nota dihapus.')}catch(e){toast(errMsg(e))}return}
 if(act==='add')return productForm();
 if(act==='restore'||act==='seed')return restoreDefaults();
 if(act==='diagnose')return diagnoseFirebase();
 if(act==='refresh-products')return fetchProductsFromServer();
 if(act==='copy-uid')return copyUID();
 if(act==='test-write')return testWrite();
 if(act==='remove-bg')return removeBackground();
 if(act==='bg-preset')return applyBackgroundPreset(el.dataset.preset);
 if(act==='bg-use-welcome')return useWelcomeAsBackground();
 if(act==='remove-logo')return removeLogo();
 if(act==='remove-welcome')return removeWelcome();
 
 if(act==='invoice-add-line'){if(invoiceDraftRows.length>=40)return toast('Maksimal 40 jenis barang.');invoiceDraftRows.push(invoiceRowForProduct(invoiceCatalog()[0]?.id||''));drawInvoiceRows();return}
 if(act==='invoice-preview')return printInvoiceDraft();
 if(act==='new-order')return orderForm();
 if(act==='export')return backup();
 if(act==='migrate'){let ids=new Set(products.map(p=>p.id)),list=oldProducts().filter(p=>!ids.has(p.id));if(!list.length)return toast('Produk lokal sudah tersedia online.');if(confirm(`Tambahkan ${list.length} produk dari browser lama tanpa menimpa produk online?`))await uploadProducts(list);return}
});
document.addEventListener('submit',async e=>{let f=e.target;if(!['loginForm','productForm','settingsForm','backgroundForm','bannerForm','checkoutForm','orderForm','galleryAdminForm'].includes(f.id))return;e.preventDefault();if(f.id==='loginForm')return login(f);if(f.id==='checkoutForm')return submitCheckout(f);if(!isAdmin)return toast('Hanya admin yang boleh mengubah data.');if(f.id==='galleryAdminForm')return galleryAdminSave(f);if(f.id==='productForm')return saveProduct(f);if(f.id==='settingsForm')return saveSettings(f);if(f.id==='backgroundForm')return saveBackground(f);if(f.id==='bannerForm')return saveBanner(f);if(f.id==='orderForm')return saveOrder(f)});
document.addEventListener('change',async e=>{const el=e.target;
 if(el.hasAttribute('data-invoice-product')){const i=Number(el.dataset.invoiceProduct);if(!invoiceDraftRows[i])return;const selected=String(el.value||'');invoiceDraftRows[i]=invoiceRowForProduct(selected);drawInvoiceRows();return}
 if(el.hasAttribute('data-invoice-qty')){const i=Number(el.dataset.invoiceQty);if(invoiceDraftRows[i]){invoiceDraftRows[i].quantity=Math.max(1,invNumber(el.value,9999));el.value=String(invoiceDraftRows[i].quantity)}updateInvoiceTotals();return}
 if(el.hasAttribute('data-invoice-price')){const i=Number(el.dataset.invoicePrice);if(invoiceDraftRows[i])invoiceDraftRows[i].unitPrice=invNumber(el.value);updateInvoiceTotals();return}
 if(el.hasAttribute('data-invoice-custom-name')){const i=Number(el.dataset.invoiceCustomName);if(invoiceDraftRows[i])invoiceDraftRows[i].name=el.value;return}

 if(el.id==='bannerFile'&&el.files?.[0]){const file=el.files[0],im=$('bannerEditPreview');if(im){const url=URL.createObjectURL(file);im.src=url;im.onload=()=>URL.revokeObjectURL(url)}const st=$('banner-save-status');if(st){st.textContent='Foto dipilih. Klik Simpan Slider untuk mengunggah dan memverifikasinya di Firebase.';st.className='photo-status'}return}

 if(['photoFile','backgroundFile','logoFile','welcomeFile'].includes(el.id)&&el.files?.[0]){
   const file=el.files[0];
   if(el.id==='logoFile'){
     const box=$('logoPreviewContainer');if(box){const url=URL.createObjectURL(file);box.innerHTML=`<img src="${url}" alt="Pratinjau logo">`;box.querySelector('img').onload=()=>URL.revokeObjectURL(url)}
     setMediaStatus('logo','Logo dipilih, menyimpan otomatis ke Firebase…','working');await saveBrandAsset('logo',file);return;
   }
   if(el.id==='backgroundFile'){
     const img=$('backgroundPreview');if(img){const url=URL.createObjectURL(file);img.src=url;img.classList.remove('hidden');img.onload=()=>URL.revokeObjectURL(url)}
     setMediaStatus('background','Foto background dipilih, menyimpan otomatis…','working');await saveBrandAsset('background',file);return;
   }
   if(el.id==='welcomeFile'){
     const box=$('welcomePreviewContainer');if(box){const url=URL.createObjectURL(file);box.innerHTML=`<img id="welcomePreview" src="${url}" alt="Pratinjau gambar sambutan">`;box.querySelector('img').onload=()=>URL.revokeObjectURL(url)}
     setMediaStatus('welcome','Gambar sambutan dipilih, menyimpan otomatis ke Firebase…','working');await saveBrandAsset('welcome',file);return;
   }
   if(el.id==='photoFile'){
     const img=$('photoPreview');if(img){const url=URL.createObjectURL(file);img.src=url;img.classList.remove('hidden');img.onload=()=>URL.revokeObjectURL(url)}
     const form=el.closest('form');if(isAdmin&&form?.id==='productForm'){productStatus('Foto dipilih. Mengunggah otomatis ke Firebase…');await saveProduct(form,{automatic:true})}
     return;
   }
 }
 if(!isAdmin)return;
 if(el.id==='importFile'&&el.files?.[0])return importJSON(el.files[0]);
 if(el.hasAttribute('data-status'))try{await setDoc(doc(db,'orders',el.dataset.status),{status:el.value},{merge:true});toast('Status diperbarui.')}catch(e){toast(errMsg(e))}
});
document.addEventListener('input',e=>{const el=e.target;if(el.hasAttribute('data-invoice-qty')){const i=Number(el.dataset.invoiceQty);if(invoiceDraftRows[i])invoiceDraftRows[i].quantity=Math.max(1,invNumber(el.value,9999));updateInvoiceTotals();return}if(el.hasAttribute('data-invoice-price')){const i=Number(el.dataset.invoicePrice);if(invoiceDraftRows[i])invoiceDraftRows[i].unitPrice=invNumber(el.value);updateInvoiceTotals();return}if(el.hasAttribute('data-invoice-custom-name')){const i=Number(el.dataset.invoiceCustomName);if(invoiceDraftRows[i])invoiceDraftRows[i].name=el.value;return}if(el.id==='invoiceDiscount'){updateInvoiceTotals();return}if(view==='admin'&&el.closest('#settingsForm,#backgroundForm'))editorIsDirty=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePopup()});
render();
