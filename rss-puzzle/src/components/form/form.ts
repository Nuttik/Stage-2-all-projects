import './form.scss';

class Form {
  className: string;

  inputs?: HTMLElement[];

  button?: HTMLButtonElement;

  constructor(className: string) {
    this.className = className;
    this.inputs = [];
  }

  public addInputTextWithLabel(
    id: string,
    labelText: string,
    placeholder: string,
    minLength: number,
    maxLength: number,
    required: boolean
  ) {
    const inputWrapper: HTMLDivElement = document.createElement('div');
    inputWrapper.className = 'input-field';

    const label: HTMLLabelElement = document.createElement('label');
    label.className = 'label input-field__label';
    label.innerHTML = labelText;
    label.htmlFor = id;

    const input: HTMLInputElement = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.className = 'input input-field__input';
    input.name = id;
    input.value = '';
    input.placeholder = placeholder;
    input.minLength = minLength;
    input.maxLength = maxLength;
    input.pattern = '^[A-Z][a-z]*(-[A-Z][a-z]*)*$';
    input.required = required;

    inputWrapper.append(label);
    inputWrapper.append(input);
    inputWrapper.append();

    this.inputs.push(inputWrapper);
    input.addEventListener('focus', () => {
      inputWrapper.classList.add('active');
      if (inputWrapper.classList.contains('invalided')) inputWrapper.classList.remove('invalided');
    });
    input.addEventListener('blur', () => inputWrapper.classList.remove('active'));
    return input;
  }

  public create() {
    const formWrapper: HTMLDivElement = document.createElement('div');
    formWrapper.className = this.className;

    const form: HTMLFormElement = document.createElement('form');
    form.className = `form_${this.className} form`;

    this.inputs.forEach((el) => form.append(el));

    if (this.button) {
      form.append(this.button);
    }

    return form;
  }
}

export default Form;
