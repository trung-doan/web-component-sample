import {LitElement, html, customElement, property, eventOptions} from 'lit-element';

type CustomEventDetail = {
  value: string;
  oldValue?: string;
  isTest1?: boolean;
  isTest0?: boolean;
};

@customElement('my-text')
class MyText extends LitElement {
  @property({type: String}) value = '';

  private _dispatchCustomEvent(eventName: string, detail?: CustomEventDetail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    });
    return this.dispatchEvent(event);
  }

  private _handleChangeInput(event: Event) {
    event.stopPropagation();
    const targetEl = event.target as HTMLInputElement;
    const detail: CustomEventDetail = {value: '', oldValue: this.value};
    this.value = targetEl.value;
    detail.value = this.value;
    this._dispatchCustomEvent('change', detail);
  }

  private _click(event: Event) {
    // console.log(event)
  }

  private testFunction() {
    // console.log('testFunction');
  }

  render() {
    return html`
    My Text:
    <input
      .value=${this.value}
      @change=${this._handleChangeInput}
      @click=${this._click}
    >
  `;
  }
}

export default MyText;
