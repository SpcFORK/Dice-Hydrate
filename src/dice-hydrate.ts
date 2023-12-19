// === AUTHORHEADER ===
// @SpcFORK
// $module: true
// === ===

// dice-hydrate - A useless adition to improve your dice experience
// © SpcFORK, SpectCOW 2023
/* 
    ,""""""""""""""""",^,"""""""""""",                  
  .l ?]]]]]]]]]]]]]]]].~.????????????.I                 
 ",!l]IIIIIIIIIIIIIIII,< ]]]]]]]]]]]] l                 
 l ]]]lllllllllllllIII:> ]]]]]]]]]]]] l                 
 l:iii>>>>>>>>>>>>>]]] ~ ]]]]]]]]]]]] l                 
 l`++++++++++++++++---.~ ]]]]]]]]]]]] l                 
 lIIIIIIIIIIIIIIIIIIII;~.??????----?? l                 
 lIlllllllllllllllllll:iI"""""",;:;''l;".               
 l;lllllllllllllllllll:l    '^,,Iii??]-i;".             
 `I,I:::::::::I,,,,,,,:`   ,;ii??]]]]]]]-i",            
   ,:iiiiiiiii:,          :IIii!!!!!!!?]]]I:"           
   l ]]]]]]]]] l           ^`````````l.]]]] i           
   l ]]]]]]]]] l                   .`l.]]]]?.I          
   l.?]]]]]]]] l         ,""""""""";!!?]]]]] l          
   `i ]]]]]]]] l        I.?????????-]]]]]]]I";          
    ;:I]]]]]]]l;""""""",! ]]]]]]]]]]]]]]]?!^;           
     I,i-]]]]]]-???????.~ ]]]]]]]]]]]]]?!,,^            
      ^IIi?-]]]]]]]]]]] ~ ]]]]]]]]]]??!,,^              
        ^I"I!!!!!!!!!!!">:!!!!!!!!!!,",^                
           ^```````````^ ^``````````^
*/

const om_ = {
  hydrateCache: {
    elements: [] as HTMLElement[],
    currentPromise: null as Promise<boolean> | null,
  },

  listAllEventListeners() {
    const 
      allElements = Array.prototype.slice.call(document.querySelectorAll('*')),
      types = []
    
    allElements.push(document) // we also want document events
    
    for (let ev in window) {
      if (/^on/.test(ev)) types[types.length] = ev;
    }

    let elements = [];
    for (let i = 0; i < allElements.length; i++) {
      const currentElement = allElements[i];
      for (let j = 0; j < types.length; j++) {
        if (typeof currentElement[types[j]] === 'function') {
          elements.push({
            "node": currentElement,
            "type": types[j],
            "func": currentElement[types[j]].toString(),
          });
        }
      }
    }

    return elements.sort(function(a,b) {
      return a.type.localeCompare(b.type);
    });
  },

  findListenerEvents(element: HTMLElement) {
    let listeners = om_.listAllEventListeners()

    let events = [];
    for (let i = 0; i < listeners.length; i++) {
      const currentListener = listeners[i];
      if (currentListener.node === element) {
        events.push({
          "type": currentListener.type,
          "func": currentListener.func,
        });
      }
    }

    return events
  },
  
  dice: document.querySelector<HTMLElement>('#crscrs'),

  LOC_: 'https://dicebutton.coding398.dev/?f=',
  locate: (url: string) => om_.LOC_+url,
  
  sendEvent(ele: HTMLElement, name: string) {
    let e = new Event(name);
    ele.dispatchEvent(e);
  },

  run() {
    let dice = om_.dice;

    if (!dice) return;
    // dice as HTMLElement;

    // First, remove all events in dice event stack
    let diceEvents = om_.findListenerEvents(dice);

    for (let i = 0; i < diceEvents.length; i++) {
      let currentEvent = diceEvents[i];
      dice.removeEventListener(currentEvent.type, currentEvent.func);
    }

    // Mouse over dice?
    dice.addEventListener('mouseover', async (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      await om_.hydrate()
    })

    // Mouse left dice?
    dice.addEventListener('mouseleave', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      om_.unhydrate()
    })

    dice.addEventListener('click', async (e) => {
      // Prevent link
      e.preventDefault();
      e.stopImmediatePropagation();
      await om_.hydrateCache.currentPromise;
    })
  },

  async hydrate() {
    let dice = om_.dice

    let iframe = document.createElement('iframe');
    iframe.src = om_.locate(window.location.href);
    iframe.style.display = 'none';
    document.body.appendChild(iframe)

    // Wait for Iframe to load
    om_.hydrateCache.currentPromise = new Promise((resolve) => {
      iframe.onload = () => {
        resolve(true);
      }
    })

    await om_.hydrateCache.currentPromise;
  },

  unhydrate() {
    
  },

  fullscreen(element: HTMLElement) {
    // Fullscreen element using styles
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.width = '100%';
    element.style.height = '100%';
    element.style.margin = '0';
    element.style.padding = '0';
    element.style.border = 'none';
    element.style.outline = 'none';
    element.style.display = 'block';
  }
}

addEventListener('DOMContentLoaded', () => om_.run())