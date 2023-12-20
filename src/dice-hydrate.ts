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
  when(conditionFunction: Function, actionFunction: Function) {
    return new Promise((resolve, reject) => {
      if (typeof conditionFunction !== 'function') {
        reject(new Error('Arg 1; MUST BE FUNCTION!!!'));
        return
      }

      const interval = setInterval(() => {
        if (conditionFunction()) {
          clearInterval(interval);
          actionFunction?.();
          resolve(false);
        }
      }, 100); // Check the condition every 100 milliseconds.
    });
  },

  hydrateCache: {
    elements: [] as HTMLElement[],
    currentPromise: null as Promise<HTMLIFrameElement> | null,
    loaded: false,
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

    return elements.sort(function(a, b) {
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
  locate: (url: string) => om_.LOC_ + url,

  sendEvent(ele: HTMLElement, name: string) {
    let e = new Event(name);
    ele.dispatchEvent(e);
  },

  run() {
    let dice = om_.dice

    if (!dice) return;
    // dice as HTMLElement;
    let prd = dice.parentElement

    if (!prd) return

    let bb = dice.getBoundingClientRect();

    let parentOfDice = dice.parentElement as HTMLElement;
    // Put an overlay on the zfront which is ment to capture clicks
    // let overlay = document.createElement('div');
    // overlay.style.position = 'absolute';
    // overlay.style.display = 'flex';
    // overlay.style.width = '60px';
    // overlay.style.height = '60px';
    // overlay.style.bottom = '20px';
    // overlay.style.left = '20px';
    let overlay = dice.cloneNode(true) as HTMLElement;
    overlay.style.zIndex = '2147483647';
    dice.remove()
    
    document.body.appendChild(overlay);
    om_.dice = overlay;
    
    // Mouse over dice?
    overlay.addEventListener('mouseover', async (e) => {
      await om_.hydrate()
    })

    // Mouse left dice?
    overlay.addEventListener('mouseleave', async (e) => {
      await om_.unhydrate()
    })

    overlay.addEventListener('click', async (e) => {
      await om_.hydrateCache.currentPromise;
      await om_.immerse()
      om_.hydrateCache.loaded = false;
      om_.hydrateCache.currentPromise = null;
    })


    // let rule;
    // om_.when(() => getComputedStyle(dice, '::after').content !== 'none', () => {
    //   // Clone Pseudo Element
    //   let pseudoElement = document.createElement('div');

    //   overlay.appendChild(pseudoElement);
    // })
    // // parentOfDice.appendChild(overlay);
  },

  async hydrate() {
    let dice = om_.dice
    if (om_.hydrateCache.loaded) return

    let iframe = document.createElement('iframe');
    iframe.src = om_.locate(document.location.host);
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Wait for Iframe to load
    om_.hydrateCache.currentPromise = new Promise((resolve) => {
      iframe.onload = () => {
        resolve(iframe);
      }
    })

    await om_.hydrateCache.currentPromise;

    om_.hydrateCache.loaded = true;
  },

  async unhydrate() {
    let elm = await om_.hydrateCache.currentPromise

    if (om_.hydrateCache.loaded) return 
    
    if (elm) {
      elm.remove()
    }
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
  },

  async immerse() {
    let curp = await om_.hydrateCache.currentPromise
    if (!curp) return;

    let allowedContent = typeof curp.contentDocument == typeof Document
      ? curp.contentDocument
      : false

    if (allowedContent) {
      let allElements = curp.querySelectorAll('*');
      let scripts = allowedContent.scripts

      let clonedNodes = [...allElements].map((element: Node) => element.cloneNode(true));

      if (allElements) {
        document.write('')
        for (let i = 0; i < clonedNodes.length; i++) {
          let currentElement = allElements[i];

          document.appendChild(currentElement);
        }
      }
    } else {
      om_.fullscreen(curp)
    }
  }
}

addEventListener('DOMContentLoaded', () => om_.run())