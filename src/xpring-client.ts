import { NetworkClient } from "./network-client";
import GRPCNetworkClient from "./grpc-network-client";
import {
  AccountInfo,
  AccountInfoRequest,
  InjectionRequest,
  AccountData,
  InjectionResponse
} from "../generated/rippled_pb";
import { XRPAmount } from "../generated/XRPAmount_pb";
import { Payment } from "../generated/Payment_pb";
// TODO: How should imports work
import Signer from "../terram/src/signer";
import Wallet from "../terram/src/wallet";
import { SignedTransaction } from "../generated/SignedTransaction_pb";
import { Transaction } from "../generated/Transaction_pb";

/**
 * The default network client to use.
 */
const defaultNetworkClient = new GRPCNetworkClient();

/**
 * Error messages from XpringClient.
 */
class XpringClientErrorMessages {
  public static readonly malformedResponse = "Malformed Response.";
}

/**
 * XpringClient is a client which interacts with the Xpring platform.
 */
class XpringClient {
  /**
   * Create a new XpringClient.
   *
   * @param networkClient A network client which will manager remote RPCs to Rippled.
   */
  public constructor(
    private readonly networkClient: NetworkClient = defaultNetworkClient
  ) {}

  /**
   * Retrieve the balance for the given address.
   *
   * @param address The address to retrieve a balance for.
   * @returns The amount of XRP in the account.
   */
  public async getBalance(address: string): Promise<XRPAmount> {
    const accountData = await this.getAccountData(address);

    const balance = accountData.getBalance();
    if (balance == undefined) {
      throw new Error(XpringClientErrorMessages.malformedResponse);
    }

    const xrpAmount = new XRPAmount();
    xrpAmount.setDrops(balance);

    return xrpAmount;
  }

  /**
   * Send XRP to the given address.
   *
   * @param wallet The address sending the XRP.
   * @param destination The destination the XRP is being sent to.
   * @param amount The amount of XRP to send.
   * @returns An operation hash of the operation.
   */
  public async sendXRP(
    wallet: Wallet,
    destination: string,
    amount: XRPAmount
  ): Promise<InjectionResponse> {
    const accountData = await this.getAccountData(wallet.getAddress());
    const sequence = accountData.getSequence();
    if (sequence == undefined) {
      throw new Error(XpringClientErrorMessages.malformedResponse);
    }

    // TODO: Estimate fee.
    const fee = new XRPAmount();
    fee.setDrops("1");

    const payment = new Payment();
    payment.setDestination(destination);
    payment.setXrpAmount(amount);

    const transaction = new Transaction();
    transaction.setPayment(payment);
    transaction.setAccount(wallet.getAddress());
    transaction.setFee(fee);
    transaction.setSequence(sequence + 1);

    const signedTransaction = Signer.signTransaction(transaction, wallet);

    const injectionRequest = new InjectionRequest();
    injectionRequest.setSignedTransaction(signedTransaction);

    return this.networkClient.injectOperation(injectionRequest);
  }

  private async getAccountData(address: string): Promise<AccountData> {
    let accountInfo = await this.getAccountInfo(address);
    let accountData = accountInfo.getAccountData();
    if (accountData == undefined) {
      throw new Error(XpringClientErrorMessages.malformedResponse);
    }

    return accountData;
  }

  private async getAccountInfo(address: string): Promise<AccountInfo> {
    const accountInfoRequest = new AccountInfoRequest();
    accountInfoRequest.setAddress(address);

    const accountInfo = await this.networkClient.getAccountInfo(
      accountInfoRequest
    );
    if (accountInfo == undefined) {
      throw new Error(XpringClientErrorMessages.malformedResponse);
    }
    return accountInfo;
  }
}

export default XpringClient;
