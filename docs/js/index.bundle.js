!function(){const e=document.querySelector("#add"),t=document.querySelector("#list"),o=document.querySelector("#list-item-tmp"),l=document.querySelector("#select-all"),c=document.querySelector("#items-count"),d=document.querySelector("#clear"),n=document.querySelectorAll("#filter > li a");let r;document.addEventListener("click",(()=>{r=null}));const a=e=>{const t=JSON.stringify(e);localStorage.setItem("itemList",t)},i=e=>{(13===e.keyCode||void 0===e.keyCode)&&e.target.value.trim().length>0&&(m.push({id:Math.random(),task:e.target.value.trim(),completed:!1}),e.target.value="",a(m),p())},s=(e,t,o,l)=>{13===e.keyCode||void 0===e.keyCode?"boolean"==typeof l?(t[o]=l,a(m),p()):l.trim().length>0?(t[o]=l.trim(),a(m),p()):u(t.id):27===e.keyCode&&p()},u=e=>{m=m.filter((t=>e!=t.id)),a(m),p()},p=()=>{t.innerHTML="",k=0;const e=window.location.href.substring(window.location.href.lastIndexOf("#/")+2),l=((e,t)=>"active"===e?t.filter((e=>!1===e.completed)):"completed"===e?t.filter((e=>!0===e.completed)):t)(e,m);(e=>{for(const t of n)t.getAttribute("data-type")!=e?(t.classList.remove("toDoApp__sort-link_select"),["active","completed"].includes(e)||"all"!=t.getAttribute("data-type")||t.classList.add("toDoApp__sort-link_select")):t.classList.add("toDoApp__sort-link_select")})(e);for(const e of l){const l=o.content.cloneNode(!0),c=l.querySelector(".toDoApp__label"),d=l.querySelector(".toDoApp__select"),n=l.querySelector(".toDoApp__edit-input"),a=l.querySelector(".toDoApp__delete");n.value=e.task,c.innerHTML=e.task,c.setAttribute("data-id",e.id),d.checked=e.completed,d.checked&&(k+=1),a.addEventListener("click",(()=>u(e.id))),c.addEventListener("dblclick",(()=>{n.style.display="block",n.focus(),n.addEventListener("blur",(t=>{console.log(r),27!==r&&s(t,e,"task",n.value)})),n.addEventListener("keyup",(t=>{27!==t.keyCode&&13!==t.keyCode||(r=t.keyCode,s(t,e,"task",n.value))}))})),d.addEventListener("change",(t=>{d.checked?k+=1:k-=1,s(t,e,"completed",d.checked)})),t.prepend(l)}c.innerHTML=`${k} item left`};l.addEventListener("change",(e=>{for(const t of m)s(e,t,"completed",e.target.checked),localStorage.setItem("selectAllButtonState",e.target.checked)})),window.onhashchange=p;let m=JSON.parse(localStorage.getItem("itemList")||"[]"),k=0;(()=>{const e=JSON.parse(localStorage.getItem("selectAllButtonState"))||!1;l.checked=e})(),p(),e.addEventListener("blur",i),e.addEventListener("keyup",i),d.addEventListener("click",(()=>{m=[],a(m),p()}))}();