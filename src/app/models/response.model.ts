class ResponseBaseModel {
  id:         number;
  success:    boolean;
  messages:   string;
  errors:     ErrorModel[] = [];
  hasErrors:  boolean;
  firstError: string;
  listErrors: string;

  constructor() {
    this.hasErrors = this.errors.length >= 1 ? true : false;
    this.firstError = this.errors[0].message;

    let r;
    this.errors.forEach(e => {
      r += e.message + '\n';
    });
    this.listErrors = r;
  }
}

class ErrorModel {
  code:    number;
  message: string;
}

export class ResponseModel<T> extends ResponseBaseModel {
  data: T;
}
