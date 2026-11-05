
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
const validHex=s=>/^#[0-9a-fA-F]{6}$/.test(s||'');
function currentTheme(){return THEMES.find(t=>t.id===settings.template)||THEMES[0]}
function customerURL(){let u=new URL(location.href);u.search='';u.hash='';return u.href}
function applyTheme(){
 const t=currentTheme(),root=document.documentElement,accent=validHex(settings.accent)?settings.accent:t.accent;
 for(const [key,val] of Object.entries({'--accent':accent,'--hero':t.hero,'--theme-bg':t.bg,'--theme-card':t.card,'--theme-ink':t.ink,'--theme-family':t.family}))root.style.setProperty(key,val);
 document.body.dataset.template=t.id;document.body.dataset.family=t.family;
 let mode=MODES.includes(settings.backgroundMode)?settings.backgroundMode:'theme';
 let photo=typeof settings.backgroundImage==='string'&&/^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(settings.backgroundImage)?settings.backgroundImage:'';
 document.body.dataset.bgmode=mode==='image'&&!photo?'theme':mode;
 root.style.setProperty('--page-bg',validHex(settings.backgroundColor)?settings.backgroundColor:t.bg);
 if(mode==='image'&&photo)root.style.setProperty('--background-photo',`url("${photo}")`);else root.style.setProperty('--background-photo','none');
 root.style.setProperty('--background-opacity',String(Math.max(0,Math.min(95,Number(settings.backgroundOverlay??82)))/100));
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

const def={business:'FATIN ART ADVERTISING',subtitle:'Percetakan & Desain Grafis',headline:'Cetak impianmu, <em>jadi kenyataan.</em>',description:'Dari banner, undangan, stempel, hingga sablon. Hasil premium, proses cepat, dan harga bersahabat untuk semua kebutuhan.',wa:'6282220221045',address:'Dusun Tengororejo, Desa Songgon, Banyuwangi',logo:'',accent:'#f45a35',template:'creative',showPrices:true,seeded:false,backgroundMode:'theme',backgroundImage:'',backgroundColor:'#f8f8fb',backgroundOverlay:82};
let settings={...def},products=[],orders=[],cart=[],category='Semua',search='',tab='products',view='catalog',user=null,isAdmin=false,authReady=false,pReady=false,sReady=false,error='',productError='',settingsError='',unsubOrders=null,busy=false;
// Produk awal bersifat pratinjau sampai koleksi products benar-benar terisi di Firestore.
function catalogProducts(){return products.length?products:DEFAULT_PRODUCTS}
function previewMode(){return products.length===0}
function updateConnectionError(){error=[productError,settingsError].filter(Boolean).join(' • ')}
const wantsAdmin=new URLSearchParams(location.search).has('admin');
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'Rp '+Number(n||0).toLocaleString('id-ID');
const safeImg=s=>typeof s==='string'&&(/^https:\/\//.test(s)||/^data:image\/(jpeg|png|webp);base64,[\w+/=]+$/.test(s))?esc(s):'';
const errMsg=e=>e?.code?.includes('permission-denied')?'Firestore menolak akses. Periksa apakah Rules sudah DIPUBLISH dan cocok dengan struktur data aplikasi; periksa juga admins/UID dengan field active bertipe boolean dan bernilai true.':e?.code?.includes('invalid-credential')?'Email atau password Firebase tidak benar.':e?.code?.includes('unavailable')?'Tidak dapat menghubungi Firestore. Periksa koneksi internet dan status Firebase.':e?.code?.includes('resource-exhausted')?'Kuota atau ukuran dokumen Firestore terlampaui. Kompres foto dan periksa pemakaian Firebase.':e?.message||'Terjadi kesalahan.';
let lastWriteError='';
let photoSaving=false;
let pendingImageUrl=null;
let mediaSaveBusy=false;
const mediaStatus={logo:{text:'',type:''},background:{text:'',type:''}};
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
function updateStatusDisplay(){let el=$('firestore-diagnostic-banner');if(el)el.innerHTML=lastWriteError?`<b>⚠ ${esc(lastWriteError)}</b><br><span>Hak login Firebase tidak otomatis berarti izin menulis Firestore. Gunakan tombol <b>Diagnostik Firebase</b> dan ikuti petunjuk aturan di dalam paket.</span>`:'<b>ℹ Jika penyimpanan ditolak:</b> gunakan Diagnostik Firebase. Akses admin harus cocok dengan Rules yang telah dipublikasikan.'}

function toast(s){document.querySelector('.toast')?.remove();let el=document.createElement('div');el.className='toast';el.textContent=s;document.body.append(el);setTimeout(()=>el.remove(),4400)}
function popup(title,body){$('modal-root').innerHTML=`<div class="overlay"><div class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${esc(title)}</h2><button class="close" data-act="close">✕</button></div>${body}</div></div>`}
function closePopup(){$('modal-root').innerHTML=''}
function wa(text){let p=String(settings.wa).replace(/\D/g,'');if(p.startsWith('0'))p='62'+p.slice(1);return `https://wa.me/${p}?text=${encodeURIComponent(text)}`}
function syncBar(){const pending=!pReady||!sReady,preview=previewMode();const message=error?'Koneksi Firebase bermasalah: '+error+(preview?' • 25 produk contoh tetap ditampilkan; belum tersimpan online.':''):pending?'Memeriksa database Firebase…'+(preview?' Katalog awal ditampilkan sementara.':''):preview?'25 produk awal ditampilkan sebagai CONTOH. Admin harus klik Pulihkan 25 Produk Awal agar tersimpan online.':'Katalog tersinkron dengan Firebase secara real-time.';return `<div class="syncbar ${error?'error':(pending||preview)?'warn':''}"><span><span class="syncdot"></span>${esc(message)}</span><span>${preview?'25 contoh • 0 online':products.length+' online'}</span></div>`}
function logo(){return settings.logo?`<img class="logo" src="${safeImg(settings.logo)}" alt="Logo">`:'<div class="logo-fallback">✦</div>'}
function header(){
 let admin=view==='admin'&&isAdmin;
 let links=admin?`<a href="#produk" data-act="go-products">Katalog Produk</a><a href="#tentang" data-act="go-about">Tentang Kami</a><a href="./" data-act="share">Bagikan Katalog</a>`:`<a href="#produk">Katalog Produk</a><a href="#tentang">Tentang Kami</a><a href="./" data-act="share">Bagikan Katalog</a>`;
 return `<header class="top"><div class="container nav">${logo()}<a class="brand" href="./" data-act="catalog">${esc(settings.business)}<small>${esc(settings.subtitle).toUpperCase()}</small></a><nav class="navlinks">${links}</nav>${admin?'<button class="btn outline sm" data-act="catalog">👁 Katalog</button><button class="btn ghost sm" data-act="logout">Keluar</button>':`<button class="btn outline sm cart-button" data-act="cart">🛒 Keranjang<span class="count">${cart.reduce((a,x)=>a+x.qty,0)}</span></button>`}</div></header>`
}
function filtered(){return catalogProducts().filter(p=>(category==='Semua'||p.category===category)&&`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(search.toLowerCase()))}
function productVisual(p){
 // The original 25 records use example/placeholder images, not real printed-product photos.
 // Render styled offline thumbnails for those instead of relying on an external placeholder server.
 if(String(p.img||'').startsWith('https://placehold.co/')){
  const palette=['#ee6748','#1e6985','#304783','#24816b','#a35c85','#aa7740','#5c5597','#d27248','#396178','#ad4968'];
  const n=Number(String(p.id||'').replace(/\D/g,''))||0;
  return `<div class="mock-photo" style="--mock:${palette[n%palette.length]}"><span class="mock-brand">FATIN ART <i>✦</i></span><strong>${esc(p.name)}</strong><span class="mock-category">${esc(p.category)}</span></div>`;
 }
 return `<img loading="lazy" src="${safeImg(p.img)}" alt="${esc(p.name)}" onerror="this.style.opacity='.15'">`;
}
function cards(list){return list.length?list.map(p=>`<article class="product" data-product-id="${esc(p.id)}"><div class="photo">${productVisual(p)}<span class="tag">${esc(p.category)}</span></div><div class="product-body"><h3>${esc(p.name)}</h3><p class="desc">${esc(p.desc)}</p><div class="buyrow"><div>${settings.showPrices?`<div class="price">${money(p.price)}</div>`:'<span class="pill">Tanya harga</span>'}</div><button class="btn sm" data-add="${esc(p.id)}">+ Pesan</button></div></div></article>`).join(''):'<div class="empty">Belum ada produk atau produk tidak ditemukan.</div>'}
function publicPage(){let cats=['Semua',...new Set(catalogProducts().map(p=>p.category))];return `${header()}<div class="container">${syncBar()}<section class="hero"><div class="hero-inner"><span class="eyebrow">✦ KATALOG DIGITAL PREMIUM</span><h1>${esc(settings.headline).replaceAll('&lt;em&gt;','<em>').replaceAll('&lt;/em&gt;','</em>')}</h1><p>${esc(settings.description)}</p><div class="hero-actions"><a href="#produk" class="btn">Jelajahi Katalog ↗</a><a href="${wa('Halo, saya ingin konsultasi cetak.')}" target="_blank" rel="noopener" class="btn light">☏ Konsultasi Gratis</a><button class="btn hero-share" data-act="share">↗ Bagikan Katalog</button></div></div><div class="hero-showcase" aria-hidden="true"><div class="showcase-stack"><span class="showcase-paper a"></span><span class="showcase-paper b"></span><span class="showcase-paper c"><span class="showcase-mark">✦</span><b>PRINT IT.<br>LOVE IT.</b><small>FATIN ART STUDIO</small></span><span class="showcase-disc"></span></div></div></section><div class="benefits"><div class="benefit"><div class="benefit-icon">⚡</div><div><b>Proses Satset</b><small>Cepat dan tepat waktu</small></div></div><div class="benefit"><div class="benefit-icon">✦</div><div><b>Hasil Berkualitas</b><small>Warna tajam dan maksimal</small></div></div><div class="benefit"><div class="benefit-icon">🤝</div><div><b>Harga Bersahabat</b><small>Untuk semua kebutuhan</small></div></div></div><section id="produk"><div class="section-head"><div><h2>Pilihan produk terbaik</h2><p>Katalog otomatis mengikuti perubahan dari admin.</p></div><input id="search" class="search" placeholder="⌕ Cari produk..." value="${esc(search)}"></div><div class="filters">${cats.map(c=>`<button class="chip ${category===c?'active':''}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div id="products" class="products">${cards(filtered())}</div></section></div><footer class="foot" id="tentang"><div class="container foot-inner"><div><h3>${esc(settings.business)}</h3><p>${esc(settings.description)}</p><p>Murah – Berkualitas – Satset</p></div><div><h3>Hubungi kami</h3><p>📍 ${esc(settings.address)}</p><a href="${wa('Halo Fatin Art!')}" target="_blank" rel="noopener" class="btn sm">WhatsApp Admin ↗</a></div></div></footer>`}
function render(){applyTheme();$('app').innerHTML=view==='admin'&&isAdmin?adminPage():publicPage();if($('search'))$('search').addEventListener('input',e=>{search=e.target.value;$('products').innerHTML=cards(filtered())});updateStatusDisplay()}
function share(){socialShare()}
function openCart(){let lines=cart.map(c=>({c,p:catalogProducts().find(p=>p.id===c.id)})).filter(x=>x.p);popup('Keranjang Belanja',lines.length?`${lines.map(({c,p})=>`<div class="cartline"><img src="${safeImg(p.img)}"><div class="grow"><b>${esc(p.name)}</b><small>${money(p.price)}</small></div><div class="qty"><button data-qty="${esc(p.id)}" data-delta="-1">−</button><b>${c.qty}</b><button data-qty="${esc(p.id)}" data-delta="1">+</button></div></div>`).join('')}<div class="total"><span>Estimasi Total</span><span>${money(lines.reduce((s,x)=>s+x.c.qty*x.p.price,0))}</span></div><button class="btn full" data-act="checkout">Pesan via WhatsApp ↗</button>`:'<p class="muted">Keranjang masih kosong.</p>')}
function checkout(){popup('Data Pemesan',`<form id="checkoutForm"><div class="formrow"><label>Nama pelanggan<input class="field" name="name" maxlength="100" required></label></div><div class="formrow"><label>Nomor WhatsApp<input class="field" name="phone" maxlength="20" inputmode="tel" required></label></div><div class="formrow"><label>Spesifikasi dan catatan<textarea class="field" name="notes" rows="3" maxlength="500" placeholder="Ukuran, bahan, alamat, dll"></textarea></label></div><p class="notice">Pesanan dikirim melalui WhatsApp, bukan disimpan dalam database publik.</p><button class="btn full">Kirim Pesanan ↗</button></form>`)}
function submitCheckout(f){let d=new FormData(f),lines=cart.map(c=>({c,p:catalogProducts().find(p=>p.id===c.id)})).filter(x=>x.p),total=lines.reduce((s,x)=>s+x.c.qty*x.p.price,0);let message=`Halo Admin ${settings.business}! Saya ingin memesan.\nNama: ${d.get('name')}\nWA: ${d.get('phone')}\n\n${lines.map(x=>`• ${x.p.name} x${x.c.qty} (${money(x.c.qty*x.p.price)})`).join('\n')}\n\nEstimasi total: ${money(total)}\nSpesifikasi: ${d.get('notes')||'-'}\nMohon konfirmasi pesanan. Terima kasih.`;let url=wa(message);cart=[];closePopup();render();window.open(url,'_blank','noopener');popup('Pesanan Siap Dikirim',`<p>Buka WhatsApp, lalu tekan Kirim untuk menyampaikan pesanan Anda kepada admin.</p><a class="btn full" target="_blank" rel="noopener" href="${esc(url)}">Buka WhatsApp ↗</a>`)}

async function adminGate(){
 if(!authReady){toast('Memeriksa akun Firebase…');return}
 if(!user){popup('Masuk Admin Firebase',`<div class="notice">Gunakan email dan password yang dibuat di Firebase Authentication. Jangan bagikan password.</div><form id="loginForm"><div class="formrow"><label>Email admin<input class="field" name="email" type="email" autocomplete="username" required></label></div><div class="formrow"><label>Password Firebase<input class="field" name="password" type="password" autocomplete="current-password" required></label></div><button class="btn full" type="submit">Masuk Admin</button></form>`);return}
 try{
   const result=await getDocFromServer(doc(db,'admins',user.uid));
   isAdmin=result.exists()&&result.data().active===true;
   if(!isAdmin){popup('Izin admin belum aktif',`<p>Akun berhasil login, tetapi dokumen izin admin belum ditemukan atau belum aktif.</p><div class="notice">Proyek: <b>${esc(firebaseConfig.projectId)}</b><br>Collection: <b>admins</b><br>Document ID (UID): <code style="word-break:break-all">${esc(user.uid)}</code><br>Field: <b>active</b> — Type: <b>boolean</b> — Value: <b>true</b></div><div class="admin-toolbar"><button class="btn" data-act="copy-uid">📋 Salin UID</button><button class="btn outline" data-act="check">Periksa ulang</button></div>`);return}
   view='admin';closePopup();render();watchOrders();
 }catch(e){toast(errMsg(e));popup('Gagal memeriksa akses admin',`<p>${esc(errMsg(e))}</p><div class="notice">UID akun login: <b style="word-break:break-all">${esc(user.uid)}</b><br>Jika Firestore tetap menggunakan aturan default <code>allow read, write: if false;</code>, admin tidak akan bisa mengaksesnya.</div><div class="admin-toolbar"><button class="btn outline" data-act="check">Coba lagi</button><button class="btn" data-act="copy-uid">📋 Salin UID</button></div>`)}
}
async function login(f){let btn=f.querySelector('button');btn.disabled=true;try{await signInWithEmailAndPassword(auth,f.elements.email.value.trim(),f.elements.password.value)}catch(e){toast(errMsg(e));btn.disabled=false}}
async function logout(){try{await signOut(auth)}catch(e){toast(errMsg(e))}isAdmin=false;view='catalog';closePopup();history.replaceState(null,'',location.pathname);render()}
function watchOrders(){if(unsubOrders)unsubOrders();if(!isAdmin)return;unsubOrders=onSnapshot(collection(db,'orders'),snap=>{orders=snap.docs.map(x=>({id:x.id,...x.data()}));if(view==='admin'&&tab==='orders')render()},e=>toast(errMsg(e)))}
function adminPage(){
 return `${header()}<div class="container admin-shell"><section class="studio-hero"><div class="studio-hero-content"><span class="studio-kicker">✦ CREATIVE BUSINESS CONTROL CENTER</span><h1>Studio Admin <span>Fatin Art.</span></h1><p>Rancang katalog, pulihkan produk, atur identitas bisnis dan bagikan toko Anda dalam satu panel.</p><div class="studio-actions"><button class="btn" data-act="share">↗ Bagikan ke Facebook & Sosial Media</button><button class="btn outline" data-act="catalog">👁 Preview katalog pembeli</button></div></div><div class="studio-illustration" aria-hidden="true"><div class="studio-orbit">✦</div><div class="studio-tile one">◈ <small>20 TEMA</small></div><div class="studio-tile two">☁ <small>FIREBASE</small></div></div></section>${syncBar()}<div class="admin-fixbar"><div id="firestore-diagnostic-banner"><b>ℹ Periksa izin tulis Firebase</b><br><span>Jika tombol simpan pernah gagal, klik diagnostik untuk menemukan aturan yang perlu diperbaiki.</span></div><div class="admin-toolbar"><button type="button" class="btn outline sm" data-act="diagnose">🔎 Diagnostik Firebase</button><button type="button" class="btn outline sm" data-act="copy-uid">📋 Salin UID Admin</button></div></div><div class="statgrid stats-modern"><div class="stat"><span>📦 Produk Online</span><strong>${products.length}<small> / katalog</small></strong><p>Tersimpan di Firestore</p></div><div class="stat"><span>🎨 Template Tersedia</span><strong>${THEMES.length}<small> tema</small></strong><p>Sinkron untuk pelanggan</p></div><div class="stat"><span>🔒 Status Akses</span><strong>Admin <small>aktif</small></strong><p>Firebase Authentication</p></div></div><div class="tabs admin-tabs">${[['products','▦ Kelola Produk'],['design','🎨 20 Tema & Background'],['settings','⚙ Pengaturan'],['orders','▤ Nota'],['backup','↓ Cadangan']].map(([t,label])=>`<button class="chip ${tab===t?'active':''}" data-tab="${t}">${label}</button>`).join('')}</div><div class="panel modern-panel">${adminPanel()}</div></div>`
}
function previewAdminProducts(){return `<div class="empty-admin"><div>📦</div><h3>25 produk contoh sudah tampil untuk pembeli</h3><p>Ini <b>pratinjau bawaan, belum tersimpan online</b>. Klik <b>Pulihkan 25 Produk Awal</b> setelah aturan Firestore dan UID admin benar.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:15px"><button class="btn" data-act="restore">↻ Pulihkan 25 Produk</button><button class="btn outline" data-act="diagnose">🔎 Periksa Akses Firebase</button></div><details style="text-align:left;margin-top:18px"><summary style="cursor:pointer;font-weight:800">Lihat daftar 25 produk contoh ▾</summary><div class="preview-seed-list">${DEFAULT_PRODUCTS.map((p,i)=>`<div><span>${i+1}.</span> <b>${esc(p.name)}</b><small>${money(p.price)}</small></div>`).join('')}</div></details></div>`}
function adminPanel(){
 if(tab==='products')return `<div class="row panel-top"><div><span class="section-kicker">PRODUK DAN LAYANAN</span><h3>Kelola produk <span class="muted">(${products.length})</span> <small class="small muted">· STUDIO PRO v5</small></h3><p class="small muted">Produk yang disimpan otomatis muncul pada katalog publik.</p></div><div class="admin-toolbar"><button class="btn" data-act="add">＋ Tambah Produk</button><button class="btn outline" data-act="restore">↻ Pulihkan 25 Produk Awal</button><button class="btn outline" data-act="refresh-products">⟳ Cek Produk Online</button></div></div>${!products.length?previewAdminProducts():''}<div class="admin-products">${products.map(p=>`<div class="admin-product"><img src="${safeImg(p.img)}" alt="${esc(p.name)}" onerror="this.style.opacity='.2'"><div class="grow"><b>${esc(p.name)}</b><small>${esc(p.category)} · ${money(p.price)}</small></div><div class="admin-actions"><button class="btn ghost sm" data-edit="${esc(p.id)}">✎ Edit</button><button class="btn red sm" data-delete="${esc(p.id)}">✕</button></div></div>`).join('')}</div>`;
 if(tab==='design')return `<div class="panel-top"><span class="section-kicker">TAMPILAN KATALOG</span><h3>20 Tema Website Premium</h3><p class="small muted">Pilih tema — desain, warna, dan nuansa katalog akan diperbarui secara real-time untuk semua pengunjung.</p></div><div class="theme-grid">${THEMES.map(t=>`<button class="theme-card ${settings.template===t.id?'chosen':''}" data-template="${t.id}" type="button"><span class="theme-snapshot" style="background:${t.hero}"><span class="theme-mini-bar"></span><span class="theme-mini-title"></span><span class="theme-mini-sub"></span><span class="theme-mini-pill" style="background:${t.accent}"></span></span><span class="theme-meta"><span><b>${esc(t.name)}</b><small>${esc(t.note)}</small></span>${settings.template===t.id?'<span class="theme-check">✓</span>':''}</span></button>`).join('')}</div><div class="design-extras"><div class="design-section"><h3>Warna utama kustom</h3><p class="small muted">Gunakan warna pilihan Anda tanpa mengubah jenis tema.</p><div class="palette">${['#f45a35','#0e9f86','#5167d7','#a044a4','#d69c32','#202938','#df3e65','#b58b43','#1675c2','#26734f','#8259c2','#cb5580','#793cdd','#0b8f95'].map(c=>`<button class="swatch ${settings.accent===c?'active':''}" style="background:${c}" data-color="${c}" aria-label="Pilih warna ${c}"></button>`).join('')}</div></div><div class="design-section"><h3>Background Katalog</h3><p class="small muted">Pilih background bawaan tema, warna solid, pola, atau unggah foto PNG/JPG dari komputer.</p><form id="backgroundForm"><div class="formgrid"><div class="formrow"><label>Mode background<select name="backgroundMode" class="field">${[['theme','Background bawaan tema'],['solid','Warna solid'],['pattern','Pola geometris'],['image','Foto sendiri (PNG/JPG)']].map(([v,n])=>`<option value="${v}" ${settings.backgroundMode===v?'selected':''}>${n}</option>`).join('')}</select></label></div><div class="formrow"><label>Warna dasar<input class="field color-input" type="color" name="backgroundColor" value="${validHex(settings.backgroundColor)?settings.backgroundColor:'#f8f8fb'}"></label></div></div><div class="formrow"><label>Unggah background foto PNG/JPG/WEBP (maks. 12 MB)<input class="field" id="backgroundFile" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="small muted">Memilih foto langsung mengunggahnya ke Firestore. Tunggu status berhasil; file cetak HD disimpan terpisah.</p>${settings.backgroundImage?`<img class="preview background-preview" id="backgroundPreview" src="${safeImg(settings.backgroundImage)}">`:'<img class="preview background-preview hidden" id="backgroundPreview">'}</div><div class="formrow"><label>Lapisan terang di atas foto: <b id="overlayValue">${Number(settings.backgroundOverlay??82)}%</b><input class="field" type="range" name="backgroundOverlay" min="0" max="95" value="${Number(settings.backgroundOverlay??82)}" oninput="document.getElementById('overlayValue').textContent=this.value+'%'" style="padding:4px"></label></div>${mediaStatusMarkup('background')}<div class="admin-toolbar"><button class="btn" type="submit">💾 Simpan Mode & Warna Background</button>${settings.backgroundImage?'<button class="btn red" type="button" data-act="remove-bg">Hapus Foto Background</button>':''}</div></form></div></div>`;
 if(tab==='settings')return `<h3>Identitas, konten & kontak resmi</h3><p class="small muted">Hanya admin yang dapat mengubah pengaturan ini. Logo tersimpan otomatis setelah file dipilih.</p><button class="btn outline sm" type="button" data-tab="design" style="margin-bottom:16px">🎨 Atur Background & 20 Tema →</button><form id="settingsForm"><div class="formgrid"><div class="formrow"><label>Nama usaha<input class="field" name="business" maxlength="120" required value="${esc(settings.business)}"></label></div><div class="formrow"><label>Subjudul<input class="field" name="subtitle" maxlength="120" value="${esc(settings.subtitle)}"></label></div></div><div class="formrow"><label>Judul banner (boleh memakai &lt;em&gt;)<input class="field" name="headline" maxlength="250" value="${esc(settings.headline)}"></label></div><div class="formrow"><label>Deskripsi<textarea class="field" name="description" maxlength="1200" rows="3">${esc(settings.description)}</textarea></label></div><div class="formgrid"><div class="formrow"><label>Nomor WhatsApp admin<input class="field" name="wa" maxlength="24" required value="${esc(settings.wa)}"></label></div><div class="formrow"><label>Alamat<input class="field" name="address" maxlength="300" value="${esc(settings.address)}"></label></div></div><div class="media-editor"><div class="media-head"><div><strong>✦ Logo usaha</strong><p class="small muted">Pilih PNG/JPG/WEBP. Logo otomatis tersimpan, tanpa perlu klik tombol Simpan Pengaturan.</p></div><span class="pill">Firebase online</span></div><div class="media-preview-row"><div class="media-logo-preview" id="logoPreviewContainer">${settings.logo?`<img id="logoPreview" src="${safeImg(settings.logo)}" alt="Logo saat ini">`:'<span id="logoPreviewEmpty">✦</span>'}</div><div class="media-control"><label for="logoFile" class="btn outline">📷 Ganti Logo PNG / JPG</label><input class="visually-hidden-file" id="logoFile" type="file" accept="image/png,image/jpeg,image/webp"><p class="small muted">Logo ringan untuk website, bukan file cetak HD.</p>${settings.logo?'<button class="btn red sm" type="button" data-act="remove-logo">Hapus Logo</button>':''}</div></div>${mediaStatusMarkup('logo')}</div><div class="formrow"><label><input name="showPrices" type="checkbox" ${settings.showPrices?'checked':''}> Tampilkan harga di katalog</label></div><div id="settings-save-status" role="status" class="small muted" aria-live="polite"></div><button class="btn" type="submit">Simpan Pengaturan Online</button></form>`;
 if(tab==='orders')return `<div class="row"><div><h3>Nota dari pesanan WhatsApp</h3><p class="small muted">Hanya admin yang dapat melihat data pelanggan.</p></div><button class="btn sm" data-act="new-order">+ Buat Nota</button></div>${orders.map(o=>`<div class="admin-product" style="display:block;margin:12px 0"><div class="row"><b>${esc(o.id)} · ${esc(o.name)}</b><span class="pill">${esc(o.status)}</span></div><p class="small muted">${esc(o.date||'')} • ${esc(o.phone)} • ${money(o.total)}</p><p class="small">${esc(o.items)}</p><div class="admin-toolbar"><select class="field" style="max-width:210px" data-status="${esc(o.id)}">${['Menunggu konfirmasi','Diproses','Selesai','Lunas','Dibatalkan'].map(x=>`<option ${o.status===x?'selected':''}>${x}</option>`).join('')}</select><button class="btn outline sm" data-invoice="${esc(o.id)}">Lihat / Cetak</button><button class="btn ghost sm" data-edit-order="${esc(o.id)}">Edit</button><button class="btn red sm" data-delete-order="${esc(o.id)}">Hapus</button></div></div>`).join('')||'<p class="small muted">Belum ada nota. Buat nota setelah menerima pesanan melalui WhatsApp.</p>'}`;
 return `<h3>Cadangan dan impor data</h3><p class="small muted">Ekspor JSON untuk menyimpan salinan produk dan pengaturan. Jangan bagikan file berisi data pribadi.</p><div class="admin-toolbar"><button class="btn" data-act="export">⬇ Ekspor JSON</button><label class="btn outline">⬆ Impor JSON<input type="file" id="importFile" accept=".json,application/json" hidden></label></div><hr style="border:0;border-top:1px solid var(--border);margin:25px 0"><h3>Migrasi katalog lama</h3><p class="small muted">Mengunggah data dari versi lokal aplikasi sebelumnya pada browser ini, tanpa menghapus produk online lain.</p><button class="btn outline" data-act="migrate">Migrasikan produk lokal ke Firebase</button>`;
}
function productForm(id=''){const p=products.find(x=>x.id===id)||{name:'',category:'',price:0,desc:'',img:''};popup(id?'Edit Produk':'Tambah Produk',`<form id="productForm" data-id="${esc(id)}"><div class="formrow"><label>Nama produk<input class="field" name="name" maxlength="130" required value="${esc(p.name)}"></label></div><div class="formgrid"><div class="formrow"><label>Kategori<input class="field" name="category" maxlength="60" required value="${esc(p.category)}"></label></div><div class="formrow"><label>Harga (Rp)<input class="field" name="price" type="number" min="0" max="1000000000" required value="${Number(p.price)||0}"></label></div></div><div class="formrow"><label>Deskripsi<textarea class="field" name="desc" maxlength="1500" rows="3">${esc(p.desc)}</textarea></label></div><div class="formrow"><label>Upload PNG/JPG/WEBP maksimal 12 MB<input class="field" type="file" id="photoFile" accept="image/png,image/jpeg,image/webp"></label><p class="small muted"><b>BARU v4:</b> memilih foto akan langsung mengunggahnya ke Firebase secara otomatis. Foto dikompresi sebagai thumbnail katalog, bukan berkas cetak HD.</p><img class="preview ${p.img?'':'hidden'}" id="photoPreview" src="${safeImg(p.img)}"></div><p class="notice" style="margin:12px 0">Saat foto dipilih, sistem mulai menyimpannya otomatis. Jangan tutup jendela sampai muncul <b>✅ Foto berhasil tersimpan dan terverifikasi di Firebase</b>. Jika masih gagal, pesan error lengkap akan tampil di bawah.</p><div id="product-save-status" role="status" aria-live="polite" class="small muted" style="margin-bottom:10px"></div><div id="product-save-error" class="photo-error hidden" role="alert"></div><button class="btn full" type="submit">💾 Simpan & Verifikasi Produk</button></form>`)}
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
   console.error('[FATIN ART v4 PHOTO UPLOAD]',{stage,code,id,bytes:file?.size||0},e);
   productStatus(committed?'⚠️ Penulisan berhasil, tetapi verifikasi server belum selesai.':'❌ Simpan gagal. Coba lagi setelah membaca penjelasan di bawah.','error');
   showProductErrorDetail(message);
   lastWriteError=message;updateStatusDisplay();
   toast('Foto belum terverifikasi. Detail error ada di bawah tombol upload.');
 }finally{
   photoSaving=false;
   if(button.isConnected){button.disabled=false;button.textContent='💾 Simpan / Coba Lagi ke Firebase'}
 }
}
// Media brand disimpan per-field, tanpa menimpa tema, nama usaha atau media lainnya.
async function saveBrandAsset(kind,file=null,remove=false){
 if(!isAdmin)return setMediaStatus(kind,'Anda harus masuk sebagai admin.','error');
 if(mediaSaveBusy||busy)return setMediaStatus(kind,'Ada penyimpanan lain. Coba lagi setelah selesai.','error');
 mediaSaveBusy=true;
 const field=kind==='logo'?'logo':'backgroundImage';
 let payload={};let assetData='';
 try{
  if(!navigator.onLine)throw Object.assign(new Error('Tidak ada koneksi internet.'),{code:'offline'});
  setMediaStatus(kind,remove?'Menghapus file dari katalog online…':'Mengoptimalkan foto, mohon jangan tutup halaman…','working');
  assetData=remove?'':await shrinkMedia(file,kind==='logo'?65000:165000,kind==='logo'?450:1450);
  if(!remove&&!assetData)throw Error('Gagal memproses file gambar.');
  payload={[field]:assetData};
  if(kind==='background')payload.backgroundMode=remove?'theme':'image';
  setMediaStatus(kind,`Mengirim ${remove?'perubahan':Math.round(assetData.length/1024)+' KB gambar'} ke Firebase…`,'working');
  await firebaseTimeout(setDoc(doc(db,'public','catalog'),payload,{merge:true}),25000,'Simpan '+kind);
  setMediaStatus(kind,'Memeriksa ulang data dari server Firebase…','working');
  const snap=await firebaseTimeout(getDocFromServer(doc(db,'public','catalog')),15000,'Verifikasi '+kind);
  if(!snap.exists()||snap.data()?.[field]!==assetData)throw Error('Hasil pembacaan dari server tidak cocok dengan file baru.');
  if(kind==='background'&&snap.data()?.backgroundMode!==payload.backgroundMode)throw Error('Mode background di server belum sesuai.');
  settings={...settings,...snap.data()};
  mediaStatus[kind]={text:(kind==='logo'?'✅ Logo':'✅ Background')+(remove?' berhasil dihapus':' berhasil disimpan dan diverifikasi online. Buka katalog pembeli untuk melihatnya.'),type:'success'};
  lastWriteError='';render();
  toast(kind==='logo'?'Logo website berhasil diubah.':'Background website berhasil diubah.');
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
 for(const k of ['business','subtitle','headline','description','wa','address'])patch[k]=String(d.get(k)||'').trim();
 patch.showPrices=f.elements.showPrices.checked;
 try{
  await firebaseTimeout(setDoc(doc(db,'public','catalog'),patch,{merge:true}),20000,'Simpan pengaturan');
  const remote=await getDocFromServer(doc(db,'public','catalog'));
  if(!remote.exists()||Object.keys(patch).some(k=>remote.data()[k]!==patch[k]))throw Error('Pengaturan belum cocok dengan hasil pembacaan dari server.');
  settings={...settings,...remote.data()};lastWriteError='';render();toast('✅ Pengaturan bisnis tersimpan dan terverifikasi online.');
 }catch(e){writeFail(e,'Menyimpan pengaturan bisnis');const n=$('settings-save-status');if(n)n.textContent=errMsg(e)}
 finally{busy=false;if(b.isConnected){b.disabled=false;b.textContent='Simpan Pengaturan Online'}}
}
async function design(patch){
 if(!isAdmin||busy||mediaSaveBusy)return;
 let next={...patch};
 if(patch.template){const t=THEMES.find(x=>x.id===patch.template);if(!t)return;next.accent=t.accent;if(settings.backgroundMode==='theme')next.backgroundColor=t.bg}
 busy=true;const prev={...settings};settings={...settings,...next};render();
 try{
  await setDoc(doc(db,'public','catalog'),next,{merge:true});
  const snap=await getDocFromServer(doc(db,'public','catalog'));
  if(!snap.exists()||Object.keys(next).some(k=>snap.data()[k]!==next[k]))throw Error('Tema belum terverifikasi pada server.');
  settings={...settings,...snap.data()};lastWriteError='';render();toast('✅ Tema berhasil tersimpan untuk semua pelanggan.');
 }catch(e){settings=prev;writeFail(e,'Menyimpan tema');render()}
 finally{busy=false}
}
async function saveBackground(f){
 if(!isAdmin||busy||mediaSaveBusy)return toast('Tunggu penyimpanan sebelumnya selesai.');
 busy=true;const btn=f.querySelector('button[type="submit"]');btn.disabled=true;
 const d=new FormData(f);let mode=String(d.get('backgroundMode'));
 const patch={backgroundMode:MODES.includes(mode)?mode:'theme',backgroundColor:validHex(d.get('backgroundColor'))?d.get('backgroundColor'):currentTheme().bg,backgroundOverlay:Math.max(0,Math.min(95,Number(d.get('backgroundOverlay'))||0))};
 try{
  // Jika file dipilih dan otomatis disimpan sebelumnya, pilihan mode tetap bisa diatur.
  if(patch.backgroundMode==='image'&&!settings.backgroundImage)throw Error('Upload foto background terlebih dahulu.');
  await setDoc(doc(db,'public','catalog'),patch,{merge:true});
  const snap=await getDocFromServer(doc(db,'public','catalog'));
  if(!snap.exists()||Object.keys(patch).some(k=>snap.data()[k]!==patch[k]))throw Error('Mode dan warna background belum cocok di server.');
  settings={...settings,...snap.data()};lastWriteError='';mediaStatus.background={text:'✅ Mode dan warna background sudah tersimpan online.',type:'success'};render();toast('Background tersimpan dan diverifikasi.');
 }catch(e){setMediaStatus('background','❌ '+safeMediaError(e,'background'),'error');writeFail(e,'Menyimpan mode background')}
 finally{busy=false;if(btn.isConnected){btn.disabled=false;btn.textContent='💾 Simpan Mode & Warna Background'}}
}
async function removeBackground(){if(!isAdmin||!confirm('Hapus foto background yang sedang terpasang?'))return;await saveBrandAsset('background',null,true)}
async function removeLogo(){if(!isAdmin||!confirm('Hapus logo yang sedang terpasang?'))return;await saveBrandAsset('logo',null,true)}
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
   try {await setDoc(doc(db,'public','catalog'),{...settings,seeded:true})}
   catch(settingsErr){toast(`${uploaded} produk tersimpan. Pengaturan katalog masih gagal: ${errMsg(settingsErr)}`);return}
   lastWriteError='';toast(`Berhasil! ${uploaded} produk awal tersimpan di Firestore. Cek katalog pembeli.`);
 } catch(e){
   const message=errMsg(e);writeFail(e,uploaded?`Pemulihan (${uploaded} produk tersimpan, sisanya gagal)`:'Pemulihan 25 produk');
   popup('Pemulihan produk belum berhasil',`<p><b>${uploaded}</b> produk baru berhasil ditulis ke Firestore.</p><p>${esc(message)}</p>${adminHelp()}<button class="btn full" data-act="diagnose">🔎 Periksa Akses Firebase</button>`);
 } finally {busy=false}
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
 popup('Diagnostik Firebase',`<p class="small muted">Pemeriksaan dilakukan terhadap database online, bukan data cache browser.</p><div class="notice">${rows.map(x=>esc(x)).join('<br>')}</div>${adminHelp()}<div class="admin-toolbar"><button class="btn outline" data-act="copy-uid">📋 Salin UID</button>${canTest?'<button class="btn" data-act="test-write">🧪 Tes Izin Simpan</button>':''}</div><p class="small muted" style="margin-top:12px">Tes izin simpan menuliskan kembali pengaturan katalog yang sedang terlihat; gunakan hanya jika Anda setuju.</p>`);
}
async function testWrite(){if(!isAdmin||busy)return toast('Masuk sebagai admin terlebih dahulu.');busy=true;try{await setDoc(doc(db,'public','catalog'),{...settings});lastWriteError='';toast('Berhasil: akses tulis Firestore aktif.');popup('Izin tulis berhasil',`<p>✅ Pengaturan katalog berhasil ditulis ke Firestore.</p><p>Anda dapat mencoba ganti tema, simpan pengaturan, dan pulihkan 25 produk sekarang.</p><button class="btn full" data-act="close">Selesai</button>`)}catch(e){writeFail(e,'Tes izin simpan');popup('Tes tulis gagal',`<p>❌ ${esc(errMsg(e))}</p>${adminHelp()}<button class="btn outline full" data-act="diagnose">Periksa lagi</button>`)}finally{busy=false}
}
function oldProducts(){for(let key of ['fatin_art_premium_v1','fatin_art_state_v3'])try{let d=JSON.parse(localStorage.getItem(key));if(Array.isArray(d?.products)&&d.products.length)return d.products}catch(e){}return DEFAULT_PRODUCTS}
function cleanProduct(p,n){let img=String(p.img||'');if(!(img.startsWith('https://')||img.startsWith('data:image/jpeg;base64,'))||img.length>150000)img='';return {id:String(p.id||'p'+Date.now()+n).slice(0,100),name:String(p.name||'Produk').slice(0,130),category:String(p.category||'Lainnya').slice(0,60),price:Math.max(0,Math.min(1000000000,Number(p.price)||0)),desc:String(p.desc||'').slice(0,1500),img,updatedAt:serverTimestamp()}}
async function uploadProducts(arr,replace=false,sets=null){
 if(!isAdmin||busy)return;
 if(!arr.length||arr.length>180)return toast('Impor 1–180 produk per proses.');
 busy=true;let uploaded=0;
 try{
   // Aman terhadap kegagalan jaringan: unggah sebelum mengubah koleksi lama.
   // Produk dengan ID yang sama diperbarui; produk lain TIDAK dihapus.
   for(let i=0;i<arr.length;i+=12){const batch=writeBatch(db);const slice=arr.slice(i,i+12);slice.forEach((x,j)=>{let p=cleanProduct(x,i+j);batch.set(doc(db,'products',p.id),p)});await batch.commit();uploaded+=slice.length}
   if(sets)await setDoc(doc(db,'public','catalog'),{...sets,seeded:true});
   lastWriteError='';toast(uploaded+' produk berhasil diunggah. Data lain tetap aman.');
 }catch(e){writeFail(e,`Impor produk (${uploaded} dari ${arr.length} selesai)`)}finally{busy=false}
}
function backup(){const obj={version:2,settings,products,created:new Date().toISOString()};let url=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='FATIN_ART_BACKUP_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
async function importJSON(file){try{let d=JSON.parse(await file.text());if(!Array.isArray(d.products)||!d.settings||d.products.length>180)throw Error('Data tidak valid atau produk lebih dari 180.');if(!confirm('Impor akan menambah/memperbarui produk dengan ID sama, TANPA menghapus produk lain. Lanjutkan?'))return;let s={...settings};for(let k of ['business','subtitle','headline','description','wa','address'])if(typeof d.settings[k]==='string')s[k]=d.settings[k].slice(0,k==='description'?1200:250);if(/^#[0-9a-f]{6}$/i.test(d.settings.accent))s.accent=d.settings.accent;if(THEMES.some(t=>t.id===d.settings.template))s.template=d.settings.template;if(typeof d.settings.showPrices==='boolean')s.showPrices=d.settings.showPrices;if(typeof d.settings.logo==='string' && d.settings.logo.length<150000 && (/^https:\/\//.test(d.settings.logo)||/^data:image\/jpeg;base64,/.test(d.settings.logo)))s.logo=d.settings.logo;if(MODES.includes(d.settings.backgroundMode))s.backgroundMode=d.settings.backgroundMode;if(validHex(d.settings.backgroundColor))s.backgroundColor=d.settings.backgroundColor;if(Number.isFinite(Number(d.settings.backgroundOverlay)))s.backgroundOverlay=Math.max(0,Math.min(95,Number(d.settings.backgroundOverlay)));if(typeof d.settings.backgroundImage==='string'&&d.settings.backgroundImage.length<150000&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(d.settings.backgroundImage))s.backgroundImage=d.settings.backgroundImage;await uploadProducts(d.products,false,s)}catch(e){toast(errMsg(e))}}
function orderForm(id=''){let o=orders.find(x=>x.id===id)||{name:'',phone:'',items:'',total:0,status:'Menunggu konfirmasi',notes:''};popup(id?'Edit Nota':'Buat Nota Baru',`<form id="orderForm" data-id="${esc(id)}"><div class="formgrid"><div class="formrow"><label>Nama pemesan<input class="field" name="name" maxlength="100" required value="${esc(o.name)}"></label></div><div class="formrow"><label>Nomor WA<input class="field" name="phone" maxlength="24" value="${esc(o.phone)}"></label></div></div><div class="formrow"><label>Nama produk dan jumlah<textarea class="field" name="items" maxlength="1000" rows="3" required>${esc(o.items)}</textarea></label></div><div class="formgrid"><div class="formrow"><label>Total harga Rp<input class="field" name="total" type="number" min="0" required value="${Number(o.total)||0}"></label></div><div class="formrow"><label>Status<select class="field" name="status">${['Menunggu konfirmasi','Diproses','Selesai','Lunas','Dibatalkan'].map(x=>`<option ${o.status===x?'selected':''}>${x}</option>`).join('')}</select></label></div></div><div class="formrow"><label>Catatan<textarea class="field" name="notes" maxlength="500" rows="2">${esc(o.notes)}</textarea></label></div><button class="btn full" type="submit">Simpan Nota</button></form>`)}
async function saveOrder(f){let d=new FormData(f),id=f.dataset.id||'FA-'+Date.now().toString(36).toUpperCase(),prev=orders.find(x=>x.id===id);try{await setDoc(doc(db,'orders',id),{name:String(d.get('name')).trim(),phone:String(d.get('phone')).trim(),items:String(d.get('items')).trim(),total:Number(d.get('total'))||0,status:String(d.get('status')),notes:String(d.get('notes')).trim(),date:prev?.date||new Date().toLocaleString('id-ID')});closePopup();toast('Nota tersimpan untuk admin.')}catch(e){toast(errMsg(e))}}
function invoice(id){let o=orders.find(x=>x.id===id);if(!o)return;popup('Nota Pembayaran',`<div class="invoice"><h2>${esc(settings.business)}</h2><p class="small muted">${esc(settings.address)}</p><hr><p><b>NOTA ${esc(id)}</b> · ${esc(o.date)}</p><p>Pelanggan: ${esc(o.name)} · ${esc(o.phone)}</p><table><tr><th>Rincian</th><th class="right">Harga</th></tr><tr><td style="white-space:pre-line">${esc(o.items)}</td><td class="right">${money(o.total)}</td></tr></table><h3>Total: ${money(o.total)}</h3><p>Status: ${esc(o.status)}</p><p>${esc(o.notes)}</p><p class="small muted">Terima kasih telah mempercayakan pesanan Anda pada kami.</p></div><button class="btn full" data-print="${esc(id)}">🖨 Cetak Nota</button>`)}
function printInvoice(id){let o=orders.find(x=>x.id===id);if(!o)return;$('print-root').innerHTML=`<div class="invoice"><h2>${esc(settings.business)}</h2><p>${esc(settings.address)} • WA ${esc(settings.wa)}</p><hr><b>NOTA ${esc(id)}</b><p>${esc(o.date)}</p><p>Nama: ${esc(o.name)} • ${esc(o.phone)}</p><table><tr><th>Rincian</th><th>Total</th></tr><tr><td style="white-space:pre-line">${esc(o.items)}</td><td>${money(o.total)}</td></tr></table><h3>Total: ${money(o.total)}</h3><p>Status: ${esc(o.status)}</p><p>${esc(o.notes)}</p></div>`;window.print()}
onSnapshot(collection(db,'products'),snap=>{pReady=true;productError='';updateConnectionError();products=snap.docs.map(d=>({...d.data(),id:d.id})).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));cart=cart.filter(c=>catalogProducts().some(p=>p.id===c.id));render()},e=>{pReady=true;productError=errMsg(e);updateConnectionError();render()});
onSnapshot(doc(db,'public','catalog'),snap=>{sReady=true;settingsError='';updateConnectionError();settings={...def,...(snap.exists()?snap.data():{})};render()},e=>{sReady=true;settingsError=errMsg(e);updateConnectionError();render()});
onAuthStateChanged(auth,async u=>{authReady=true;user=u;if(!u){isAdmin=false;orders=[];unsubOrders?.();unsubOrders=null;if(view==='admin')view='catalog';if(wantsAdmin)adminGate();render();return}if(wantsAdmin)await adminGate();else render()});
document.addEventListener('click',async e=>{
 if(e.target.classList.contains('overlay'))return closePopup();
 let el=e.target.closest('[data-act],[data-cat],[data-tab],[data-add],[data-qty],[data-edit],[data-delete],[data-template],[data-color],[data-status],[data-invoice],[data-print],[data-edit-order],[data-delete-order]');
 if(!el)return;
 if(el.tagName==='A')e.preventDefault();
 if(el.hasAttribute('data-add')){let p=catalogProducts().find(p=>p.id===el.dataset.add);if(p){let c=cart.find(c=>c.id===p.id);if(c)c.qty++;else cart.push({id:p.id,qty:1});render();toast('Produk masuk keranjang.')}return}
 if(el.hasAttribute('data-qty')){let c=cart.find(c=>c.id===el.dataset.qty);if(c){c.qty+=Number(el.dataset.delta);if(c.qty<=0)cart=cart.filter(x=>x!==c)}render();openCart();return}
 if(el.hasAttribute('data-cat')){category=el.dataset.cat;render();return}
 if(el.hasAttribute('data-tab')){if(!isAdmin)return;tab=el.dataset.tab;render();return}
 if(el.hasAttribute('data-invoice'))return invoice(el.dataset.invoice);
 if(el.hasAttribute('data-print'))return printInvoice(el.dataset.print);
 let act=el.dataset.act;
 if(act==='close')return closePopup();
 if(act==='cart')return openCart();
 if(act==='checkout')return checkout();
 if(act==='catalog'){view='catalog';closePopup();render();return}
 if(act==='go-products'||act==='go-about'){view='catalog';closePopup();render();document.getElementById(act==='go-products'?'produk':'tentang')?.scrollIntoView({behavior:'smooth'});return}
 if(act==='share')return share();
 if(act==='copy-link')return copyCustomerURL();
 if(act==='native-share')return nativeShare();
 if(act==='check')return adminGate();
 if(act==='logout')return logout();
 if(!isAdmin)return;
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
 if(act==='remove-logo')return removeLogo();
 
 if(act==='new-order')return orderForm();
 if(act==='export')return backup();
 if(act==='migrate'){let ids=new Set(products.map(p=>p.id)),list=oldProducts().filter(p=>!ids.has(p.id));if(!list.length)return toast('Produk lokal sudah tersedia online.');if(confirm(`Tambahkan ${list.length} produk dari browser lama tanpa menimpa produk online?`))await uploadProducts(list);return}
});
document.addEventListener('submit',async e=>{let f=e.target;if(!['loginForm','productForm','settingsForm','backgroundForm','checkoutForm','orderForm'].includes(f.id))return;e.preventDefault();if(f.id==='loginForm')return login(f);if(f.id==='checkoutForm')return submitCheckout(f);if(!isAdmin)return toast('Hanya admin yang boleh mengubah data.');if(f.id==='productForm')return saveProduct(f);if(f.id==='settingsForm')return saveSettings(f);if(f.id==='backgroundForm')return saveBackground(f);if(f.id==='orderForm')return saveOrder(f)});
document.addEventListener('change',async e=>{const el=e.target;
 if(['photoFile','backgroundFile','logoFile'].includes(el.id)&&el.files?.[0]){
   const file=el.files[0];
   if(el.id==='logoFile'){
     const box=$('logoPreviewContainer');if(box){const url=URL.createObjectURL(file);box.innerHTML=`<img src="${url}" alt="Pratinjau logo">`;box.querySelector('img').onload=()=>URL.revokeObjectURL(url)}
     setMediaStatus('logo','Logo dipilih, menyimpan otomatis ke Firebase…','working');await saveBrandAsset('logo',file);return;
   }
   if(el.id==='backgroundFile'){
     const img=$('backgroundPreview');if(img){const url=URL.createObjectURL(file);img.src=url;img.classList.remove('hidden');img.onload=()=>URL.revokeObjectURL(url)}
     setMediaStatus('background','Foto background dipilih, menyimpan otomatis…','working');await saveBrandAsset('background',file);return;
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
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePopup()});
render();
