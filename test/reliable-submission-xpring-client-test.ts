import FakeXpringClient from "./fakes/fake-xpring-client";
import ReliableSubmissionXpringClient from "../src/reliable-submission-xpring-client";
import { assert } from "chai";
import {
  TransactionStatus as RawTransactionStatus,
  Wallet,
  WalletGenerationResult
} from "xpring-common-js";
import TransactionStatus from "../src/transaction-status";

/* eslint-disable @typescript-eslint/no-magic-numbers */

/* global BigInt */

const testAddress = "X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH";

const transactionStatusCodeSuccess = "tesSUCCESS";

const transactionHash = "DEADBEEF";

const wallet = (Wallet.generateRandomWallet() as WalletGenerationResult).wallet;

const fakedGetBalanceValue = BigInt(10);
const fakedTransactionStatusValue = TransactionStatus.Succeeded;
const fakedSendValue = transactionHash;
const fakedLastLedgerSequenceValue = 10;

const fakedRawTransactionStatusValue = new RawTransactionStatus();
const fakedRawTransactionStatusLastLedgerSequenceValue = 20;
const fakedRawTransactionStatusValidatedValue = true;
const fakedRawTransactionStatusTransactionStatusCode = transactionStatusCodeSuccess;

describe("Reliable Submission Xpring Client", function(): void {
  beforeEach(function(): void {
    fakedRawTransactionStatusValue.setLastLedgerSequence(
      fakedRawTransactionStatusLastLedgerSequenceValue
    );
    fakedRawTransactionStatusValue.setValidated(
      fakedRawTransactionStatusValidatedValue
    );
    fakedRawTransactionStatusValue.setTransactionStatusCode(
      fakedRawTransactionStatusTransactionStatusCode
    );

    this.fakeXpringClient = new FakeXpringClient(
      fakedGetBalanceValue,
      fakedTransactionStatusValue,
      fakedSendValue,
      fakedLastLedgerSequenceValue,
      fakedRawTransactionStatusValue
    );
    this.reliableSubmissionClient = new ReliableSubmissionXpringClient(
      this.fakeXpringClient
    );
  });

  // eslint-disable-next-line prettier/prettier
  it("Get Account Balance - Response Not Modified", async function(): Promise<void> {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a balance is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getBalance(
      testAddress
    );

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedGetBalanceValue);
  });

  // eslint-disable-next-line prettier/prettier
  it("Get Transaction Status - Response Not Modified", async function(): Promise<void> {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getTransactionStatus(
      testAddress
    );

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedTransactionStatusValue);
  });

  // eslint-disable-next-line prettier/prettier
  it("Get Latest Ledger Sequence - Response Not Modified", async function(): Promise<void> {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN the latest ledger sequence is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getLastValidatedLedgerSequence();

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedLastLedgerSequenceValue);
  });

  // eslint-disable-next-line prettier/prettier
  it("Get Raw Transaction Status - Response Not Modified", async function(): Promise<void> {
    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` WHEN a raw transaction status is retrieved.
    const returnedValue = await this.reliableSubmissionClient.getRawTransactionStatus(
      testAddress
    );

    // THEN the result is returned unaltered.
    assert.deepEqual(returnedValue, fakedRawTransactionStatusValue);
  });

  // eslint-disable-next-line prettier/prettier
  it("Send - Returns when the latestLedgerSequence is too low", async function(): Promise<void> {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000);

    // GIVEN A ledger sequence number that will increment in 200ms.
    setTimeout((): void => {
      const latestLedgerSequence =
        fakedRawTransactionStatusLastLedgerSequenceValue + 1;
      this.fakeXpringClient.latestLedgerSequence = latestLedgerSequence;
    }, 200);

    // WHEN a reliable send is submitted
    const transactionHash = await this.reliableSubmissionClient.send(
      "1",
      testAddress,
      wallet
    );

    // THEN the function returns
    assert.deepEqual(transactionHash, fakedSendValue);
  });

  // eslint-disable-next-line prettier/prettier
  it("Send - Returns when the transaction is validated", async function(): Promise<void> {
    // Increase timeout because `setTimeout` is only accurate to 1500ms.
    this.timeout(5000);

    // GIVEN A transaction that will validate itself in 200ms.
    setTimeout((): void => {
      fakedRawTransactionStatusValue.setValidated(true);
    }, 200);

    // WHEN a reliable send is submitted
    const transactionHash = await this.reliableSubmissionClient.send(
      "1",
      testAddress,
      wallet
    );

    // THEN the function returns
    assert.deepEqual(transactionHash, fakedSendValue);
  });

  it("Send - Throws when transaction doesn't have a last ledger sequence", function(done): void {
    // Increase timeout because the poll interview is 4s.
    this.timeout(5000);

    // GIVEN a `ReliableSubmissionXpringClient` decorating a `FakeXpringClient` which will return a transaction that did not have a last ledger sequence attached.
    const malformedRawTransactionStatus = new RawTransactionStatus();
    malformedRawTransactionStatus.setLastLedgerSequence(0);
    this.fakeXpringClient.getRawTransactionStatusValue = malformedRawTransactionStatus;

    // WHEN `send` is called THEN the promise is rejected.
    this.reliableSubmissionClient
      .send("1", testAddress, wallet)
      .then((): void => {
        return;
      })
      .catch((): void => done());
  });
});
