(()=>{
 'use strict';

 const headline=document.querySelector('.rt-hero-headline');
 if(headline){
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const lines=headline.querySelectorAll('.rt-headline-line');
  const prepared=root.classList.contains('rt-headline-prep');
  clearTimeout(window.rtHeadlineFallback);root.classList.remove('rt-headline-prep');
  let reveal;
  if(window.gsap&&!reduced.matches&&prepared){
   headline.dataset.headlineState='playing';
   reveal=gsap.fromTo(lines,{yPercent:108,autoAlpha:0},{yPercent:0,autoAlpha:1,duration:1.1,stagger:0.16,ease:'power4.out',clearProps:'transform,opacity,visibility',onComplete:()=>{headline.dataset.headlineState='complete';}});
  }else headline.dataset.headlineState=reduced.matches?'reduced':'fallback';
  reduced.addEventListener('change',event=>{if(event.matches){if(reveal)reveal.kill();if(window.gsap)gsap.set(lines,{clearProps:'transform,opacity,visibility'});headline.dataset.headlineState='reduced';}});
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const words=[...headline.querySelectorAll('.rt-hover-word')];
  const wordInners=words.map(word=>word.firstElementChild);
  const resetWords=()=>{if(window.gsap){gsap.killTweensOf(wordInners);gsap.set(wordInners,{clearProps:'transform,color'});}};
  words.forEach(word=>{
   const inner=word.firstElementChild;
   word.addEventListener('pointerenter',()=>{
    if(!window.gsap||reduced.matches||!finePointer.matches||headline.dataset.headlineState==='playing')return;
    gsap.to(inner,{y:-3.5,rotation:-0.3,color:'#314b9b',duration:0.28,ease:'power2.out',overwrite:'auto'});
   });
   word.addEventListener('pointerleave',()=>{
    if(!window.gsap||reduced.matches||!finePointer.matches)return;
    gsap.to(inner,{y:0,rotation:0,color:'inherit',duration:0.38,ease:'power3.out',overwrite:'auto',clearProps:'transform,color'});
   });
  });
  reduced.addEventListener('change',event=>{if(event.matches)resetWords();});
  finePointer.addEventListener('change',event=>{if(!event.matches)resetWords();});

 }
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
