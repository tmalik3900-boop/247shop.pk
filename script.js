const WHATSAPP='923337400125';
const KEY='247shop_products';
const demo=[
{id:1,name:'iPhone Display',category:'LCD & OLED',price:81000,icon:'📱'},
{id:2,name:'Original Mobile Battery',category:'Batteries',price:3500,icon:'🔋'},
{id:3,name:'Charging Port Flex',category:'Charging Parts',price:1200,icon:'🔌'},
{id:4,name:'Charging IC',category:'Charging IC',price:900,icon:'▣'},
{id:5,name:'iPhone Camera Module',category:'Cameras',price:12500,icon:'📷'},
{id:6,name:'Mobile Speaker',category:'Speakers',price:1800,icon:'🔊'},
{id:7,name:'Precision Repair Tool Kit',category:'Repair Tools',price:2200,icon:'🪛'},
{id:8,name:'Fast Charger + Cable',category:'Accessories',price:2500,icon:'🔌'},
{id:9,name:'iPhone 15 Pro Max Display',category:'LCD & OLED',price:81000,icon:'📱'},
{id:10,name:'Type-C Charging Cable',category:'Accessories',price:1200,icon:'🔗'}
];
let cart=JSON.parse(localStorage.getItem('247cart')||'[]');
let currentCategory='All';

function getProducts(){
  try{
    const saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(Array.isArray(saved)&&saved.length) return saved;
  }catch(e){}
  return demo;
}
function money(n){return 'Rs. '+Number(n||0).toLocaleString('en-PK')}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function render(){
 const q=(document.getElementById('search')?.value||'').trim().toLowerCase();
 const sc=document.getElementById('searchCategory')?.value||'All';
 const cat=currentCategory!=='All'?currentCategory:sc;
 const list=getProducts().filter(p=>{
   const hay=(p.name+' '+p.category+' '+(p.desc||'')).toLowerCase();
   return (cat==='All'||p.category===cat||hay.includes(cat.toLowerCase())) && (!q||hay.includes(q));
 });
 document.getElementById('productsGrid').innerHTML=list.map(p=>{
   const visual=p.image?`<img src="${p.image}" alt="${esc(p.name)}">`:`<div class="product-placeholder">${esc(p.icon||'📦')}</div>`;
   return `<article class="product"><div class="product-img">${visual}</div><h3>${esc(p.name)}</h3><p>${esc(p.category)}</p><div class="price">${money(p.price)}</div><button class="btn shop-btn" onclick="addToCart(${Number(p.id)})">ADD TO CART</button></article>`;
 }).join('')||'<p>No products found.</p>';
 updateCart();
}
function setCategory(c){currentCategory=c;document.getElementById('searchCategory').value=['All','LCD & OLED','Batteries','Charging Parts','Charging IC','Cameras','Speakers','Repair Tools','Accessories'].includes(c)?c:'All';render();document.getElementById('products').scrollIntoView({behavior:'smooth'});}
function filterProducts(){currentCategory='All';render();document.getElementById('products').scrollIntoView({behavior:'smooth'});}
function addToCart(id){const p=getProducts().find(x=>x.id===id);if(!p)return;const x=cart.find(i=>i.id===id);if(x)x.qty++;else cart.push({id,qty:1});save();openCart();}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();}
function save(){localStorage.setItem('247cart',JSON.stringify(cart));updateCart();}
function updateCart(){
 const ps=getProducts();
 const count=cart.reduce((s,x)=>s+x.qty,0);
 document.getElementById('cartCount').textContent=count;
 const rows=cart.map(x=>{const p=ps.find(y=>y.id===x.id);if(!p)return '';return `<div class="cart-row"><div><b>${esc(p.name)}</b><br><small>${money(p.price)} × ${x.qty}</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join('');
 document.getElementById('cartItems').innerHTML=rows||'<p>Your cart is empty.</p>';
 const total=cart.reduce((s,x)=>{const p=ps.find(y=>y.id===x.id);return s+(p?p.price*x.qty:0)},0);
 document.getElementById('cartTotal').textContent=money(total);
}
function openCart(){document.getElementById('overlay').classList.add('open');updateCart()}
function closeCart(e){if(!e||e.target.id==='overlay')document.getElementById('overlay').classList.remove('open')}
function checkout(){
 const ps=getProducts();
 const valid=cart.filter(x=>ps.some(p=>p.id===x.id));
 if(!valid.length){alert('Cart is empty');return}
 const lines=valid.map(x=>{const p=ps.find(y=>y.id===x.id);return `${p.name} x${x.qty} = ${money(p.price*x.qty)}`});
 const total=valid.reduce((s,x)=>s+ps.find(p=>p.id===x.id).price*x.qty,0);
 const msg='Assalam-o-Alaikum, I want to order from 24/7 Shop:\n\n'+lines.join('\n')+'\n\nTotal: '+money(total);
 window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(msg),'_blank');
}
document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter')filterProducts()});
document.getElementById('searchCategory').addEventListener('change',()=>{currentCategory='All';render()});
window.addEventListener('storage',render);
render();
