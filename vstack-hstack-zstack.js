class VStack extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        let shadowRoot = this.attachShadow({ mode: 'open' })
        this.background = this.getAttribute('background') || getComputedStyle(this.parentElement).background
        this.alignment = this.getAttribute('alignment')
        shadowRoot.innerHTML = `
        <style>
            .vstack {
                display: flex;
                flex-direction: column;
                width: fit-content;
                height: fit-content;
                align-items: ${this.alignment == 'left' ? 'flex-start' : this.alignment == 'right' ? 'flex-end' : 'center'};
                background: ${this.background}
            }
            .vstack, .vstack *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
        <div class="vstack">
            <slot></slot>
        </div>
        `
    }
}
customElements.define('v-stack',VStack)
class HStack extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        let shadowRoot = this.attachShadow({ mode: 'open' })
        this.background = this.getAttribute('background') || getComputedStyle(this.parentElement).background
        this.alignment =  this.getAttribute('alignment')
        shadowRoot.innerHTML = `
        <style>
            .hstack {
                display: flex;
                flex-direction: row;
                height: fit-content;
                width: fit-content;
                align-items: ${this.alignment == 'top' ? 'flex-start' : this.alignment == 'bottom' ? 'flex-end' : 'center'};
                background: ${this.background}
            }
            .hstack, .hstack *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
        </style>
        <div class="hstack">
            <slot></slot>
        </div>
        `
    }
}
customElements.define('h-stack',HStack)
class ZStack extends HTMLElement {
    constructor() {
        super()
    }
    connectedCallback() {
        let shadowRoot = this.attachShadow({ mode: 'open' })
        let getWidth = element => Number(element.offsetWidth)
        let getHeight = element => Number(element.offsetHeight)
        let maxHeight = this.children[0]
        let maxWidth = this.children[0]
        this.width = this.getAttribute('width') || getWidth(maxWidth) + 'px'
        this.height = this.getAttribute('height') || getHeight(maxHeight) + 'px'
        this.background = this.getAttribute('background') || getComputedStyle(this.parentElement).background
        this.style.background = this.background
        this.alignment = this.getAttribute('alignment')
        shadowRoot.innerHTML = `
        <style>
            .zstack {
                position: relative;
            }
            .zstack, .zstack *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
           
        </style>
        <div class="zstack">
            <slot></slot>
        </div>
        `
        window.requestAnimationFrame(()=> {
            for (let child of this.children) {
                if (Number(getWidth(child)) > Number(getWidth(maxWidth))) {
                    maxWidth = child
                }
                if (Number(getHeight(child)) > Number(getHeight(maxHeight))) {
                    maxHeight = child
                }
                child.style.position = 'absolute'
                switch(this.alignment) {
                    case 'top-left':
                        child.style.top = child.style.left = 0
                        break
                    case 'left':
                        child.style.left = 0
                        child.style.top = '50%'
                        child.style.transform = 'translateY(-50%)'
                        break
                    case 'top-right':
                        child.style.top = child.style.right = 0
                        break
                    case 'bottom':
                        child.style.bottom = 0
                        child.style.left = '50%'
                        child.style.transform = 'translateX(-50%)'
                        break
                    case 'top':
                        child.style.top = 0
                        child.style.right = '50%'
                        child.style.transform = 'translateX(50%)'
                        break
                    case 'bottom-left':
                        child.style.bottom = child.style.left = 0
                        break
                    case 'right':
                        child.style.right = 0
                        child.style.top = '50%'
                        child.style.transform = 'translateY(-50%)'
                        break
                    case 'bottom-right':
                        child.style.bottom = child.style.right = 0
                        break
                    default:
                        child.style.top = child.style.left = '50%'
                        child.style.transform = 'translate(-50%, -50%)'
                        break
                }
            }
            let zStackContainer = this.shadowRoot.querySelector('.zstack');
            zStackContainer.style.height = `${maxHeight.offsetHeight}px`;
            zStackContainer.style.width = `${maxWidth.offsetWidth}px`;
        })
    }
}
customElements.define('z-stack',ZStack)
