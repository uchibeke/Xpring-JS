import { XpringClientDecorator } from "./xpring-client-decorator";
import TransactionStatus from "./transaction-status";
import {
  TransactionStatus as RawTransactionStatus,
  Wallet
} from "xpring-common-js";

// Disable required await rule while this class is implemented.
// TODO(keefertaylor): Remove this lint rule when this class has a working implementation.
/* eslint-disable @typescript-eslint/require-await */

export default class DefaultXpringClient implements XpringClientDecorator {
  /**
   * Retrieve the balance for the given address.
   *
   * @param address The X-Address to retrieve a balance for.
   * @returns A `BigInt` representing the number of drops of XRP in the account.
   */
  public async getBalance(address: string): Promise<BigInt> {
    throw new Error("unimplemented");
  }

  /**
   * Retrieve the transaction status for a given transaction hash.
   *
   * @param transactionHash The hash of the transaction.
   * @returns The status of the given transaction.
   */
  public async getTransactionStatus(
    transactionHash: string
  ): Promise<TransactionStatus> {
    throw new Error("unimplemented");
  }

  /**
   * Send the given amount of XRP from the source wallet to the destination address.
   *
   * @param drops A `BigInt`, number or numeric string representing the number of drops to send.
   * @param destination A destination address to send the drops to.
   * @param sender The wallet that XRP will be sent from and which will sign the request.
   * @returns A promise which resolves to a string representing the hash of the submitted transaction.
   */
  public async send(
    amount: BigInt | number | string,
    destination: string,
    sender: Wallet
  ): Promise<string> {
    throw new Error("unimplemented");
  }

  /**
   * Retrieve the latest validated ledger sequence on the XRP Ledger.
   *
   * @returns The index of the latest validated ledger.
   */
  public async getLastValidatedLedgerSequence(): Promise<number> {
    throw new Error("unimplemented");
  }

  /**
   * Retrieve the raw transaction status for the given transaction hash.
   *
   * @param transactionHash: The hash of the transaction.
   * @Return The status of the given transaction.
   */
  public async getRawTransactionStatus(
    transactionHash: string
  ): Promise<RawTransactionStatus> {
    throw new Error("unimplemented");
  }
}
