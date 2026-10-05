/* Ubah di sini: harga per buku, nomor WhatsApp toko (format 62812xxxxxxx, tanpa + atau 0 di depan). */
var CONFIG = {
  price: 89000,
  whatsapp: "",
  title: "Untuk Perempuan 17 Tahun ke Atas"
};

var IMGS = [
  ["p1","Lebih paham, lebih siap, lebih berdaya"],
  ["p6","Bukan sekadar bacaan, tapi bekal hidup"],
  ["p9","Panduan mengenal diri dan menjaga batas"],
  ["p7","Perempuan berhak aman, berdaya, dan dilindungi"],
  ["p8","Apa yang akan kamu temukan di dalam buku ini"],
  ["p4","Buku ini untuk kamu yang"],
  ["p3","Kutipan Rinda Puspasari"],
  ["p5","Setiap perempuan berhak aman"],
  ["p2","Baca sekarang dan jadi bagian dari perubahan"]
];

function rp(n){return "Rp "+n.toLocaleString("id-ID")}
document.querySelectorAll("[data-price]").forEach(function(e){e.textContent=rp(CONFIG.price)});
document.getElementById("yr").textContent=new Date().getFullYear();

/* galeri + lightbox */
var rail=document.getElementById("rail");
IMGS.forEach(function(it){
  var b=document.createElement("button");
  b.type="button"; b.setAttribute("aria-label","Perbesar: "+it[1]);
  var im=document.createElement("img");
  im.src="img/"+it[0]+".jpg"; im.alt=it[1]; im.loading="lazy"; im.width=900; im.height=1125;
  b.appendChild(im);
  b.addEventListener("click",function(){openLb(im.src,im.alt)});
  rail.appendChild(b);
});
function openLb(src,alt){
  var d=document.createElement("div"); d.className="lb"; d.setAttribute("role","dialog"); d.setAttribute("aria-label",alt);
  var i=document.createElement("img"); i.src=src; i.alt=alt;
  var x=document.createElement("button"); x.type="button"; x.textContent="×"; x.setAttribute("aria-label","Tutup");
  function close(){d.remove();document.removeEventListener("keydown",esc)}
  function esc(e){if(e.key==="Escape")close()}
  d.addEventListener("click",function(e){if(e.target!==i)close()});
  document.addEventListener("keydown",esc);
  d.appendChild(i); d.appendChild(x); document.body.appendChild(d); x.focus();
}

/* form pesan */
var f=document.getElementById("f"), qty=document.getElementById("qty"), total=document.getElementById("total");
var err=document.getElementById("err"), prev=document.getElementById("prev"), msg=document.getElementById("msg");
var hasWa=/^\d{9,15}$/.test(CONFIG.whatsapp);
if(!hasWa) document.getElementById("sendlabel").textContent="Buat Pesan Pemesanan";
function q(){var n=parseInt(qty.value,10); return isNaN(n)||n<1?1:Math.min(n,99)}
function upd(){total.textContent=rp(q()*CONFIG.price)}
qty.addEventListener("input",upd); upd();

f.addEventListener("submit",function(e){
  e.preventDefault();
  var nama=f.nama.value.trim(), hp=f.hp.value.trim(), al=f.alamat.value.trim(), cat=f.cat.value.trim();
  if(!nama||!hp||!al){err.textContent="Lengkapi nama, nomor WhatsApp, dan alamat dulu ya."; (!nama?f.nama:!hp?f.hp:f.alamat).focus(); return}
  err.textContent="";
  var n=q();
  var text=["Halo Books & Beyond, saya mau pesan buku:","",
    "Judul: "+CONFIG.title+" (Rinda Puspasari)",
    "Jumlah: "+n+" buku",
    "Total: "+rp(n*CONFIG.price)+" (belum termasuk ongkir)","",
    "Nama: "+nama,"WhatsApp: "+hp,"Alamat: "+al]
    .concat(cat?["Catatan: "+cat]:[]).concat(["","Terima kasih!"]).join("\n");
  msg.textContent=text; prev.classList.add("on");
  document.getElementById("prevnote").textContent=hasWa
    ? "Jika WhatsApp tidak terbuka, salin pesan ini dan kirim ke nomor toko."
    : "Nomor WhatsApp toko belum diatur. Salin pesan ini dan kirim ke penjual.";
  var wl=document.getElementById("walink");
  if(hasWa){wl.href="https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(text); wl.hidden=false; wl.focus()}
});
document.getElementById("copy").addEventListener("click",function(){
  var b=this, t=msg.textContent;
  function done(){b.textContent="Tersalin"; setTimeout(function(){b.textContent="Salin Pesan"},1800)}
  function sel(){var r=document.createRange(); r.selectNodeContents(msg); var s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent="Teks terpilih, tekan salin"}
  try{navigator.clipboard.writeText(t).then(done,sel)}catch(e){sel()}
});
