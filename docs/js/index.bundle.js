!function(){const e=document.querySelector("#add"),t=document.querySelector("#list"),o=document.querySelector("#list-item-tmp"),l=document.querySelector("#select-all"),c=document.querySelector("#items-count"),d=document.querySelector("#clear"),r=document.querySelectorAll("#filter > li a"),n=e=>{const t=JSON.stringify(e);localStorage.setItem("itemList",t)},a=e=>{(13===e.keyCode||void 0===e.keyCode)&&e.target.value.trim().length>0&&(p.push({id:Math.random(),task:e.target.value.trim(),completed:!1}),e.target.value="",n(p),u())},i=(e,t,o,l)=>{13===e.keyCode||void 0===e.keyCode?"boolean"==typeof l?(t[o]=l,n(p),u()):l.trim().length>0?(t[o]=l.trim(),n(p),u()):s(t.id):27===e.keyCode&&u()},s=e=>{p=p.filter((t=>e!=t.id)),n(p),u()},u=()=>{t.innerHTML="",m=0;const e=window.location.href.substring(window.location.href.lastIndexOf("#/")+2),l=((e,t)=>"active"===e?t.filter((e=>!1===e.completed)):"completed"===e?t.filter((e=>!0===e.completed)):t)(e,p);(e=>{for(const t of r)t.getAttribute("data-type")!=e?(t.classList.remove("toDoApp__sort-link_select"),["active","completed"].includes(e)||"all"!=t.getAttribute("data-type")||t.classList.add("toDoApp__sort-link_select")):t.classList.add("toDoApp__sort-link_select")})(e);for(const e of l){const l=o.content.cloneNode(!0),c=l.querySelector(".toDoApp__label"),d=l.querySelector(".toDoApp__select"),r=l.querySelector(".toDoApp__edit-input"),n=l.querySelector(".toDoApp__delete");r.value=e.task,c.innerHTML=e.task,c.setAttribute("data-id",e.id),d.checked=e.completed,d.checked&&(m+=1),n.addEventListener("click",(()=>s(e.id))),c.addEventListener("dblclick",(()=>{r.style.display="block",r.focus(),r.addEventListener("blur",(t=>{i(t,e,"task",r.value)})),r.addEventListener("keyup",(t=>{27===t.keyCode&&(r.value=e.task),27!==t.keyCode&&13!==t.keyCode||r.blur()}))})),d.addEventListener("change",(t=>{d.checked?m+=1:m-=1,i(t,e,"completed",d.checked)})),t.prepend(l)}c.innerHTML=`${m} item left`};l.addEventListener("change",(e=>{for(const t of p)i(e,t,"completed",e.target.checked),localStorage.setItem("selectAllButtonState",e.target.checked)})),window.onhashchange=u;let p=JSON.parse(localStorage.getItem("itemList")||"[]"),m=0;(()=>{const e=JSON.parse(localStorage.getItem("selectAllButtonState"))||!1;l.checked=e})(),u(),e.addEventListener("blur",a),e.addEventListener("keyup",a),d.addEventListener("click",(()=>{p=[],n(p),u()}))}();