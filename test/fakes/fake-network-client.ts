import { NetworkClient } from "../../src/network-client";
import { AccountData, InjectionRequest, InjectionResponse } from "../../generated/rippled_pb";
import { AccountInfo } from "../../generated/rippled_pb";
import { AccountInfoRequest } from "../../generated/rippled_pb";

/**
 * A fake network client which stubs network interaction. This client always returns a successful response.
 *
 * TODO(keefertaylor): Add an interface to this class that allows for mocking of errors.
 */
class FakeNetworkClient implements NetworkClient {
  getAccountInfo(
    _accountInfoRequest: AccountInfoRequest
  ): Promise<AccountInfo> {
    const accountData = new AccountData();
    accountData.setBalance("4000");
    accountData.setSequence(1);

    const accountInfo = new AccountInfo();
    accountInfo.setAccountData(accountData);

    return new Promise((resolve, _reject) => {
      resolve(accountInfo);
    });
  }

  injectOperation(_injectionRequest: InjectionRequest): Promise<InjectionResponse> {
    const injectionResponse = new InjectionResponse();
    injectionResponse.setOperationHash("operation_hash");

    return new Promise((resolve, _reject) => {
      resolve(injectionResponse);
    });
  }
}

export default FakeNetworkClient;
