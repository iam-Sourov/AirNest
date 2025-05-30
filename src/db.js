const filterData = JSON.parse(localStorage.getItem("flights"));
console.log(filterData.from);



fetch(`http://localhost:3000/flights?route.from.code=${filterData.from}&route.to.code=${filterData.to}`)
  .then(res => res.json())
  .then(json => {
    json.map(data => {
      cardBody.append(card(data));
    })
  })
let cardBody = document.getElementById('card');

function handleAddToCart(id) {
  const idArr = JSON.parse(localStorage.getItem('ID')) || [];

  if (!idArr.includes(id)) {
    idArr.push(id);
    localStorage.setItem('ID', JSON.stringify(idArr));
    
  }
}

// Flights section
function card({ id, airline, type, route, price }) {
  let innerCard = document.createElement('div');
  innerCard.innerHTML = `<div id ="fCard" class="grid grid-cols-[2fr_1fr] ">
        <div class=" flex justify-between border-2 border-neutral-400 border-dashed rounded-2xl  p-10 ">
          <div class="flex">
            <div class="flex items-center gap-3">
              <div class="font-semibold text-2xl ">${airline}</div>
              <div class="text-sm text-neutral-600 px-2 py-0.5 bg-neutral-100 rounded-full">${type}</div>
            </div>
          </div>
          <div class=" items-center">
            <div class="flex flex-col text-center">
              <div class="text-lg font-bold">${route.from.city}</div>
              <div class="text-sm text-gray-500">${route.from.code}</div>
            </div>
          </div>
          <div class="flex">
            <div class=" flex flex-col items-center text-center">
              <div class="text-sm text-gray-500">----</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="324" height="6" viewBox="0 0 324 6" fill="none">
                <path
                  d="M0 3L5 5.88675V0.113249L0 3ZM324 3L319 0.113249V5.88675L324 3ZM3 3V3.5H5V3V2.5H3V3ZM7 3V3.5H9V3V2.5H7V3ZM11 3V3.5H13V3V2.5H11V3ZM15 3V3.5H17V3V2.5H15V3ZM19 3V3.5H21V3V2.5H19V3ZM23 3V3.5H25V3V2.5H23V3ZM27 3V3.5H29V3V2.5H27V3ZM31 3V3.5H33V3V2.5H31V3ZM35 3V3.5H37V3V2.5H35V3ZM39 3V3.5H41V3V2.5H39V3ZM43 3V3.5H45V3V2.5H43V3ZM47 3V3.5H49V3V2.5H47V3ZM51 3V3.5H53V3V2.5H51V3ZM55 3V3.5H57V3V2.5H55V3ZM59 3V3.5H61V3V2.5H59V3ZM63 3V3.5H65V3V2.5H63V3ZM67 3V3.5H69V3V2.5H67V3ZM71 3V3.5H73V3V2.5H71V3ZM75 3V3.5H77V3V2.5H75V3ZM79 3V3.5H81V3V2.5H79V3ZM83 3V3.5H85V3V2.5H83V3ZM87 3V3.5H89V3V2.5H87V3ZM91 3V3.5H93V3V2.5H91V3ZM95 3V3.5H97V3V2.5H95V3ZM99 3V3.5H101V3V2.5H99V3ZM103 3V3.5H105V3V2.5H103V3ZM107 3V3.5H109V3V2.5H107V3ZM111 3V3.5H113V3V2.5H111V3ZM115 3V3.5H117V3V2.5H115V3ZM119 3V3.5H121V3V2.5H119V3ZM123 3V3.5H125V3V2.5H123V3ZM127 3V3.5H129V3V2.5H127V3ZM131 3V3.5H133V3V2.5H131V3ZM135 3V3.5H137V3V2.5H135V3ZM139 3V3.5H141V3V2.5H139V3ZM143 3V3.5H145V3V2.5H143V3ZM147 3V3.5H149V3V2.5H147V3ZM151 3V3.5H153V3V2.5H151V3ZM155 3V3.5H157V3V2.5H155V3ZM159 3V3.5H161V3V2.5H159V3ZM163 3V3.5H165V3V2.5H163V3ZM167 3V3.5H169V3V2.5H167V3ZM171 3V3.5H173V3V2.5H171V3ZM175 3V3.5H177V3V2.5H175V3ZM179 3V3.5H181V3V2.5H179V3ZM183 3V3.5H185V3V2.5H183V3ZM187 3V3.5H189V3V2.5H187V3ZM191 3V3.5H193V3V2.5H191V3ZM195 3V3.5H197V3V2.5H195V3ZM199 3V3.5H201V3V2.5H199V3ZM203 3V3.5H205V3V2.5H203V3ZM207 3V3.5H209V3V2.5H207V3ZM211 3V3.5H213V3V2.5H211V3ZM215 3V3.5H217V3V2.5H215V3ZM219 3V3.5H221V3V2.5H219V3ZM223 3V3.5H225V3V2.5H223V3ZM227 3V3.5H229V3V2.5H227V3ZM231 3V3.5H233V3V2.5H231V3ZM235 3V3.5H237V3V2.5H235V3ZM239 3V3.5H241V3V2.5H239V3ZM243 3V3.5H245V3V2.5H243V3ZM247 3V3.5H249V3V2.5H247V3ZM251 3V3.5H253V3V2.5H251V3ZM255 3V3.5H257V3V2.5H255V3ZM259 3V3.5H261V3V2.5H259V3ZM263 3V3.5H265V3V2.5H263V3ZM267 3V3.5H269V3V2.5H267V3ZM271 3V3.5H273V3V2.5H271V3ZM275 3V3.5H277V3V2.5H275V3ZM279 3V3.5H281V3V2.5H279V3ZM283 3V3.5H285V3V2.5H283V3ZM287 3V3.5H289V3V2.5H287V3ZM291 3V3.5H293V3V2.5H291V3ZM295 3V3.5H297V3V2.5H295V3ZM299 3V3.5H301V3V2.5H299V3ZM303 3V3.5H305V3V2.5H303V3ZM307 3V3.5H309V3V2.5H307V3ZM311 3V3.5H313V3V2.5H311V3ZM315 3V3.5H317V3V2.5H315V3ZM319 3V3.5H321V3V2.5H319V3Z"
                  fill="#808080" />
              </svg>
              <div class="text-sm text-gray-500">----</div>
            </div>
          </div>
          <div>
            <div class="flex flex-col text-center">
              <div class="text-lg font-bold">${route.to.city}</div>
              <div class="text-sm text-gray-500">${route.to.code}</div>
            </div>
          </div>
        </div>
        <div class="border-2 border-dashed border-neutral-400 rounded-2xl h-full -ml-[2px] p-10">
          <div class="flex justify-center gap-4 items-center">
            <div class="flex flex-col">
              <div class="font-bold text-neutral-900">${price.currency} ${price.current}</div>
              <div class=" line-through text-gray-400">${price.currency} ${price.original}</div>
            </div>
            <div class="flex ">
              <button onclick="handleAddToCart(${id})" class="cursor-pointer p-5 bg-neutral-900 text-white text-sm rounded-2xl ">Add To Cart</button>
            </div>
          </div>
        </div>
      </div>`;
  return innerCard
}
