(()=>{
 'use strict';
 const explorer=document.querySelector('.rt-explorer');
 if(!explorer)return;
 const descriptions={
  roller:{
   covering:{kicker:'THE WORKING SURFACE',title:'Outer covering',text:'The layer that meets your material. Rubber or polyurethane is selected around the application, operating conditions and required surface characteristics.',index:'LAYER 03'},
   bonding:{kicker:'THE CONNECTION',title:'Bonding layer',text:'The connection between the prepared core and its covering. The bonding system is chosen to suit the core, covering material and manufacturing process.',index:'LAYER 02'},
   core:{kicker:'THE FOUNDATION',title:'Steel core',text:'The structural foundation of the roller. Its dimensions, journals and condition are part of the specification for a new covering or refurbishment.',index:'LAYER 01'}
  },
  sleeve:{
   covering:{kicker:'THE WORKING SURFACE',title:'Sleeve covering',text:'The outer working surface of a covered sleeve. The covering material, finished diameter and surface finish are specified for the printing or coating application.',index:'LAYER 03'},
   bonding:{kicker:'THE CONNECTION',title:'Bonding layer',text:'The interface between the sleeve body and its covering. The bonding system must suit the sleeve construction and the covering process; the illustrated arrangement is an example.',index:'LAYER 02'},
   core:{kicker:'THE HOLLOW CARRIER',title:'Sleeve body',text:'A hollow carrier that fits a compatible mandrel. Its bore, construction and dimensions must match the machine and application. Unlike the illustrated roller, the sleeve has no integral journals.',index:'LAYER 01'}
  }
 };
 let product='roller',layer='covering';
 const controls=[...explorer.querySelectorAll('[data-roller-layer]')];
 const toggle=explorer.querySelector('.rt-explode-toggle');
 const svg=explorer.querySelector('.rt-roller');
 const productButtons=[...explorer.querySelectorAll('[data-roller-product]')];
 function updateToggle(){
  const separated=explorer.classList.contains('is-exploded');
  toggle.setAttribute('aria-pressed',String(separated));
  toggle.firstChild.textContent=separated?`Assemble ${product} `:'Separate layers ';
  svg.setAttribute('viewBox',separated?'0 0 900 460':'0 0 740 460');
 }
 function select(key){
  const item=descriptions[product][key];if(!item)return;
  layer=key;explorer.dataset.activeLayer=key;
  controls.forEach(el=>{
   const selected=el.dataset.rollerLayer===key;
   el.classList.toggle('is-active',selected);el.setAttribute('aria-pressed',String(selected));
   const label=descriptions[product][el.dataset.rollerLayer].title;
   if(el.tagName.toLowerCase()==='button')el.children[1].textContent=label;
   else el.setAttribute('aria-label','Select '+label.toLowerCase());
  });
  explorer.querySelector('.rt-detail-kicker').textContent=item.kicker;
  explorer.querySelector('.rt-layer-details h3').textContent=item.title;
  explorer.querySelector('.rt-layer-details p').textContent=item.text;
  explorer.querySelector('.rt-drawing-meta span:last-child').textContent=item.index;
 }
 productButtons.forEach(button=>button.addEventListener('click',()=>{
  product=button.dataset.rollerProduct;explorer.dataset.product=product;
  productButtons.forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
  const sleeve=product==='sleeve';
  explorer.querySelector('.rt-explorer-heading>p').textContent=sleeve?'Explore a covered sleeve: a hollow body, bonding interface and working surface.':'Explore a covered roller: a steel core, bonding layer and working surface.';
  explorer.querySelector('.rt-drawing-meta span:first-child').textContent=sleeve?'SLEEVE CROSS-SECTION':'ROLLER CROSS-SECTION';
  explorer.querySelector('.rt-figure').setAttribute('aria-label',sleeve?'Interactive illustration of a covered hollow sleeve':'Interactive illustration of a covered industrial roller');
  explorer.querySelector('#rt-svg-title').textContent=sleeve?'Layers of a covered sleeve':'Layers of a covered roller';
  explorer.querySelector('#rt-svg-desc').textContent=sleeve?'Illustrative hollow sleeve body, bonding layer and outer covering. Select a layer using the drawing or numbered controls.':'Illustrative steel core, bonding layer and outer covering. Select a layer using the drawing or numbered controls.';
  const link=explorer.querySelector('.rt-spec-link');
  link.setAttribute('href',sleeve?'services/sleeve-coverings.html':'services/rubber-polyurethane-coverings.html');
  link.firstChild.textContent=sleeve?'Explore sleeve coverings ':'Explore roller coverings ';
  select(layer);updateToggle();
 }));
 toggle.addEventListener('click',()=>{explorer.classList.toggle('is-exploded');updateToggle();});
 controls.forEach(el=>{
  el.addEventListener('click',()=>select(el.dataset.rollerLayer));
  if(el.tagName.toLowerCase()!=='button')el.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(el.dataset.rollerLayer);}});
 });
 select('covering');updateToggle();
})();
