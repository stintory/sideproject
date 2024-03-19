// is-number-array.decorator.ts

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate } from 'class-validator';

@ValidatorConstraint({ name: 'isNumberArray', async: false })
export class IsNumberArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return this.isValid(value);
  }

  private isValid(arr: any[]): boolean {
    for (const elem of arr) {
      if (Array.isArray(elem)) {
        // Recursive check for nested arrays
        if (!this.isValid(elem)) {
          return false;
        }
      } else if (typeof elem !== 'number') {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Each element of the array must be a number.';
  }
}

export function IsNumberArray() {
  return Validate(IsNumberArrayConstraint);
}
