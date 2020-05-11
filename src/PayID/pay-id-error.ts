// Disable multiple classes to accommodate the switch to idiomatic style naming.
// TODO(keefertaylor): Remove this when migration is complete.
/* eslint-disable  max-classes-per-file */

/**
 * Types of errors that originate from PayID.
 *
 * @deprecated Please use the idiomatically named `PayIdErrorType` class instead.
 */
export enum PayIDErrorType {
  InvalidPayID,
  MappingNotFound,
  UnexpectedResponse,
  Unimplemented,
  Unknown,
}

/**
 * Represents errors thrown by PayID components of the Xpring SDK.
 *
 * @deprecated Please use the idiomatically named `PayIdError` class instead.
 */
export default class PayIDError extends Error {
  /**
   * Default errors.
   */
  public static unimplemented = new PayIDError(
    PayIDErrorType.Unimplemented,
    'Unimplemented',
  )

  public static invalidPayID = new PayIDError(
    PayIDErrorType.InvalidPayID,
    'Invalid payment pointer',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: PayIDErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}

/**
 * Types of errors that originate from PayID.
 */
export enum PayIdErrorType {
  InvalidPayId,
  MappingNotFound,
  UnexpectedResponse,
  Unimplemented,
  Unknown,
}

/**
 * Represents errors thrown by PayID components of the Xpring SDK.
 */
export class PayIdError extends Error {
  /**
   * Default errors.
   */
  public static unimplemented = new PayIdError(
    PayIdErrorType.Unimplemented,
    'Unimplemented',
  )

  public static invalidPayId = new PayIdError(
    PayIdErrorType.InvalidPayId,
    'Invalid payment pointer',
  )

  /**
   * @param errorType The type of error.
   * @param message The error message.
   */
  public constructor(
    public readonly errorType: PayIdErrorType,
    message: string | undefined = undefined,
  ) {
    super(message)
  }
}
