export class Photo {
  value: string;
  ariaLabel: string;
  constructor(data: any) {
    this.value = data.value ?? '';
    this.ariaLabel = data.ariaLabel ?? '';
  }
}